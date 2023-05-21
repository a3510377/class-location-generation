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

  app
    .set('PORT', PORT)
    .set('client', clients)
    .use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }))
    .use(compression())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  bot.on(Events.ClientReady, () => {
    console.log(`Logged in as ${bot.user?.tag}`);
  });
  bot.on(Events.MessageCreate, ({ channelId, content }) => {
    if (channelId !== watchChannelID) return;

    if (/(\d+)-(\d+)(:(\d+))?/.test(content)) {
      Object.values(clients).forEach((client) => {
        client.write('event: setPos\n');
        client.write(`data: ${content}\n\n`);
      });
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
    clients[id.toString()] = res;

    res.write('event: connect\n');
    res.write('data:\n\n');

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
