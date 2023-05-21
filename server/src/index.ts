import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

const port = process.env.PORT || 3000;

process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);

dotenv.config();

export async function main() {
  const app = express();

  app
    .set('PORT', port)
    .use(compression())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  app.get('/message', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });

    req.on('close', () => {});
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main();

export default main;
