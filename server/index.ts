import express, { Request, Response } from 'express';
import helmet from 'helmet';
import next from 'next';

import api from './api';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

(async () => {
  try {
    app.prepare().then(() => {
      const server = express();

      server.use(express.json());
      server.use(helmet());

      server.use('/api/', api);

      server.all('*', (req: Request, res: Response) => {
        return handle(req, res);
      });

      server.listen(port, (err?: any) => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log(
          `> Server listening at http://localhost:${port} as ${
            dev ? 'development' : process.env.NODE_ENV
          }`,
        );
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
