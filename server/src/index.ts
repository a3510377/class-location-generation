import fs from 'fs';
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

interface PosData {
  id: number;
  name: string;
}

type CacheType = (PosData | undefined)[][];

export async function main() {
  const app = express();
  const clients: Record<string, Response> = {};
  let simpleMap: string[] = [];
  let cache: CacheType = Array.from({ length: 7 }).map(() =>
    Array.from({ length: 5 })
  );
  let users: string[] = [];

  const save = () => {
    fs.writeFileSync('data.json', JSON.stringify({ users, cache, simpleMap }));
  };

  try {
    const {
      cache: _cache,
      users: _users,
      simpleMap: _simpleMap,
    } = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    [cache, users, simpleMap] = [_cache, _users, _simpleMap];
    // eslint-disable-next-line no-empty
  } catch {}

  app
    .set('PORT', PORT)
    .use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }))
    .use(compression())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  const send = (eventName: string, data: unknown = '') => {
    if (eventName === 'set') save();

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
  const setCatch = (x: number, y: number, userID: string) => {
    cache[x] ||= [];
    cache[x][y] = userID ? { id: +userID, name: users[+userID - 1] } : void 0;

    console.log(`${x}-${y} => ${cache[x][y]?.name || 'null'}`);

    send('set', cache);
  };

  bot
    .on(Events.ClientReady, () => console.log(`Logged in as ${bot.user?.tag}`))
    .on(Events.MessageCreate, ({ channelId, content }) => {
      if (channelId !== watchChannelID) return;

      if (content.startsWith('sim_pos')) {
        const [, data] = content.split('\n');

        simpleMap = data.split(',');
        save();
      } else if (content.startsWith('set_user')) {
        const data = content.split('\n');
        data.shift();

        users = data;
        for (const XData of cache) {
          for (const YData of XData) {
            if (!YData) return;

            YData.name = users[YData.id - 1];
          }
        }
        send('set', cache);
      } else if (/(\d+)-(\d+)(:(\d+))?/.test(content)) {
        [...content.matchAll(/(\d+)-(\d+)(:(\d+))?/gm)].forEach(
          ([, x, y, , userID]) => setCatch(+x - 1, +y - 1, userID)
        );
      } else if (/(\d+)(:(\d+))?/.test(content)) {
        [...content.matchAll(/(\d+)(:(\d+))?/gm)].forEach(
          ([, _id, , userID]) => {
            const [x, y] = simpleMap[+_id - 1].split('-');

            setCatch(+x - 1, +y - 1, userID);
          }
        );
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
    send('set', cache);

    clients[id.toString()] = res;

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
