import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import weddingsRoutes from './routes/weddings.js';
import rsvpsRoutes from './routes/rsvps.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize DB schema on startup
initializeDatabase().catch((err) => console.error('Database initialization error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingsRoutes);
app.use('/api/rsvps', rsvpsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'eternelle-wedding-saas', timestamp: new Date().toISOString() });
});

// Serve Vite Production Static Build (dist)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA Fallback: All unmatched routes serve index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Éternelle Wedding SaaS Server running on port ${PORT}`);
});
