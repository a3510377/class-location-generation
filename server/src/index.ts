import dotenv from 'dotenv';
import morgan from 'morgan';
import express, { Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import ID from './service/id';

dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const PORT = process.env.PORT || 3000;
const watchChannelID = process.env.WATCH_CHANNEL_ID || '';

process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);

export async function main() {
  const app = express();
  const clients: Record<string, Response> = {};
  const cache: (number | undefined)[][] = [];

  app
    .set('PORT', PORT)
    .set('client', clients)
    .use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }))
    .use(compression())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  const send = (eventName: string, data: unknown = '') => {
    Object.values(clients).forEach((client) => {
      client.write(`event: ${eventName}\n`);
      client.write(
        `data: ${
          ['string', 'number', 'bigint'].includes(typeof data)
            ? data
            : JSON.stringify(data)
        }\n\n`
      );
    });
  };

  const sendPos = (x: number, y: number, pos?: number) => {
    cache[x] ||= [];
    cache[x][y] = pos ? pos : void 0;

    send('setPos', `${x}-${y}${pos ? `:${pos}` : ''}`);
  };

  bot.on(Events.ClientReady, () => {
    console.log(`Logged in as ${bot.user?.tag}`);
  });
  bot.on(Events.MessageCreate, ({ channelId, content }) => {
    if (channelId !== watchChannelID) return;

    if (content === 'reset') send('reset');
    else if (/(\d+)-(\d+)(:(\d+))?/.test(content)) {
      const [, x, y, , userID] = content.match(/(\d+)-(\d+)(:(\d+))?/) || [];

      if (x && y) sendPos(+x, +y, userID ? +userID : void 0);
    }
  });

  app.get('/message', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });

    const id = new ID();
    res.write('retry: 1000\n\n');
    send('connect');
    send('setup', '7;5');

    clients[id.toString()] = res;
    for (const [x, XValue] of Object.entries(cache)) {
      for (const [y, YValue] of Object.entries(XValue)) sendPos(+x, +y, YValue);
    }

    req.on('close', () => {
      delete clients[id.toString()];

      console.log(`${id} close`);
    });
  });

  bot.login(process.env.BOT_TOKEN);
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

main();

export default main;
