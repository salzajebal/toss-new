import express from 'express';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';

const app = express();
app.disable('x-powered-by');
const MAX_SIZE = 10 * 1024 * 1024;
const STORE_DIR = path.resolve(process.env.IMAGE_STORE_DIR || './images');
const PORT = Number(process.env.PORT || '4100');
const HOST = process.env.HOST || '127.0.0.1';
const TOKEN = process.env.UPLOAD_TOKEN || '';
const MIME_EXT = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif']
]);

if (TOKEN.length < 32) {
  console.error('UPLOAD_TOKEN must be at least 32 characters.');
  process.exit(1);
}
await mkdir(STORE_DIR, { recursive: true, mode: 0o700 });

function authenticated(req, res, next) {
  const prefix = 'Bearer ';
  const authorization = req.get('authorization') || '';
  const supplied = authorization.startsWith(prefix) ? authorization.slice(prefix.length) : '';
  const left = Buffer.from(supplied);
  const right = Buffer.from(TOKEN);
  if (!supplied || left.length !== right.length || !timingSafeEqual(left, right)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 1, fields: 0, parts: 1 },
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

// Private API bridge: the public app verifies a signed, size-bound upload ticket
// before forwarding bytes here with the internal service token.
app.put('/images/:id', authenticated, express.raw({
  type: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'], limit: MAX_SIZE,
}), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)) {
      return res.sendStatus(400);
    }
    if (!Buffer.isBuffer(req.body) || !req.body.length) return res.sendStatus(400);
    const detected = await fileTypeFromBuffer(req.body);
    if (!detected || !MIME_EXT.has(detected.mime) ||
        detected.mime !== req.get('content-type')?.split(';')[0]) {
      return res.status(415).json({ error: 'Invalid image content' });
    }
    await writeFile(path.join(STORE_DIR, id), req.body, { flag: 'wx', mode: 0o600 });
    res.status(201).json({ id, contentType: detected.mime, size: req.body.length });
  } catch (err) {
    if (err.code === 'EEXIST') return res.sendStatus(409);
    next(err);
  }
});

app.post('/images', authenticated, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({ error: err.code });
      }
      return next(err);
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({ error: 'An image file is required (field: image)' });
    }
    const detected = await fileTypeFromBuffer(req.file.buffer);
    if (!detected || !MIME_EXT.has(detected.mime)) {
      return res.status(415).json({ error: 'Only PNG, JPEG, and WebP files are allowed' });
    }
    // Reject inconsistent declared media types, when provided.
    if (req.file.mimetype && req.file.mimetype !== 'application/octet-stream' &&
        req.file.mimetype !== detected.mime) {
      return res.status(415).json({ error: 'Declared type does not match file contents' });
    }
    const filename = `${randomUUID()}.${MIME_EXT.get(detected.mime)}`;
    await writeFile(path.join(STORE_DIR, filename), req.file.buffer, { flag: 'wx', mode: 0o600 });
    res.status(201).json({
      id: filename,
      url: `/images/${filename}`,
      contentType: detected.mime,
      size: req.file.size,
    });
  } catch (err) { next(err); }
});

app.get('/images/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\.(png|jpg|webp|gif))?$/i.test(id)) {
      return res.sendStatus(404);
    }
    const fullPath = path.join(STORE_DIR, id);
    const buffer = await readFile(fullPath);
    const detected = await fileTypeFromBuffer(buffer);
    const expectedExt = detected && MIME_EXT.get(detected.mime);
    if (!expectedExt || (id.includes('.') && !id.endsWith(`.${expectedExt}`))) return res.sendStatus(404);
    res.set({
      'Content-Type': detected.mime,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    });
    res.send(buffer);
  } catch (err) {
    if (err.code === 'ENOENT') return res.sendStatus(404);
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, HOST, () => console.log(`Image service listening on http://${HOST}:${PORT}`));
