import { app } from '../src/app';
import { createServer } from 'http';
import { parse } from 'url';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const server = createServer(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  const parsedUrl = parse(req.url!, true);
  server.emit('request', req, res);
}
