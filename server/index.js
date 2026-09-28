import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the Vite build output
const staticDir = path.resolve(__dirname, '..', 'dist');
app.use(express.static(staticDir));

// API routes (mounted under /api)
app.use('/api', router);

// Fallback for SPA routing – serve index.html for any non‑API route
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});