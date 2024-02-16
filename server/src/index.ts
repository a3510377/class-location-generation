import fs from 'fs';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Server } from 'socket.io';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import { createServer } from 'http';

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
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://a3510377.github.io',
    ],
  };
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: corsOptions });

  let simpleMap: string[] = [];
  let simpleDict: Record<string, number> = {};
  let cache: CacheType = Array.from({ length: 7 }).map(() =>
    Array.from({ length: 5 })
  );
  let users: string[] = [];

  const save = () => {
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(
      'data/data.json',
      JSON.stringify({ users, cache, simpleMap })
    );
  };
  const updateSimpleMap = (data: string[]) => {
    simpleMap = data;
    simpleDict = {};
    data.forEach((value, index) => {
      if (simpleDict[value]) console.log(`simple dict pos repeat ${value}`);

      simpleDict[value] = index;
    });
  };

  try {
    const {
      cache: _cache,
      users: _users,
      simpleMap: _simpleMap,
    } = JSON.parse(fs.readFileSync('data/data.json', 'utf-8'));

    [cache, users, simpleMap] = [_cache, _users, _simpleMap];
    updateSimpleMap(simpleMap);
    // eslint-disable-next-line no-empty
  } catch {}

  app
    .set('PORT', PORT)
    .use(cors(corsOptions))
    .use(compression())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  const getPosCache = () => {
    return cache.map((XD, x) =>
      XD.map((YD, y) => {
        const id = simpleDict[`${x + 1}-${y + 1}`];
        return id !== void 0 ? { ...(YD || {}), simPosID: id } : YD;
      })
    );
  };
  const send = (eventName: string, data: unknown = '') => {
    if (eventName === 'set') save();

    io.emit(eventName, data);
  };
  const setCatch = (x: number, y: number, userID: string) => {
    cache[x] ||= [];
    cache[x][y] = userID ? { id: +userID, name: users[+userID - 1] } : void 0;

    console.log(`${x}-${y} => ${cache[x][y]?.name || 'null'}`);

    send('set', getPosCache());
  };

  bot
    .on(Events.ClientReady, () => console.log(`Logged in as ${bot.user?.tag}`))
    .on(Events.MessageCreate, ({ channelId, content }) => {
      if (channelId !== watchChannelID) return;

      if (content.startsWith('sim_pos')) {
        const [, data] = content.split('\n');

        simpleMap = data.split(',');
        updateSimpleMap(simpleMap);
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
        send('set', getPosCache());
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

  io.on('connection', (socket) => socket.emit('set', getPosCache()));

  bot.login(process.env.BOT_TOKEN);
  httpServer.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

main();

export default main;
