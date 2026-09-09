import express from 'express';
import { query, isPostgresAvailable, memoryDB } from '../db.js';

const router = express.Router();

// Middleware checking Master Key from query/header
function checkMasterKey(req, res, next) {
  const key = req.headers['x-master-key'] || req.query.master_key;
  if (key === 'Fox@967777' || key === 'admin123') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Invalid Master Key' });
}

// GET /api/admin/stats
router.get('/stats', checkMasterKey, async (req, res) => {
  try {
    let users = [];
    let weddingsCount = 0;
    let rsvpsCount = 0;

    if (isPostgresAvailable) {
      const usersRes = await query('SELECT id, name, email, role, plan, license_key, created_at FROM users ORDER BY created_at DESC');
      users = usersRes.rows;

      const weddingsRes = await query('SELECT COUNT(*) as count FROM weddings');
      weddingsCount = parseInt(weddingsRes.rows[0]?.count || '0', 10);

      const rsvpsRes = await query('SELECT COUNT(*) as count FROM rsvps');
      rsvpsCount = parseInt(rsvpsRes.rows[0]?.count || '0', 10);
    } else {
      users = memoryDB.users;
      weddingsCount = Object.keys(memoryDB.weddings).length;
      rsvpsCount = Object.values(memoryDB.rsvps).reduce((acc, l) => acc + l.length, 0);
    }

    const proUsers = users.filter(u => u.plan === 'pro');
    const lifetimeUsers = users.filter(u => u.plan === 'lifetime');
    const freeUsers = users.filter(u => u.plan === 'free');

    const totalRevenue = (proUsers.length * 19) + (lifetimeUsers.length * 79);
    const conversionRate = users.length > 0 ? ((proUsers.length + lifetimeUsers.length) / users.length) * 100 : 0;

    return res.json({
      analytics: {
        totalRevenue,
        totalUsers: users.length,
        proUsersCount: proUsers.length,
        lifetimeUsersCount: lifetimeUsers.length,
        freeUsersCount: freeUsers.length,
        totalWeddings: weddingsCount,
        totalRSVPs: rsvpsCount,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
      },
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.plan,
        licenseKey: u.license_key || u.licenseKey,
        createdAt: u.created_at || u.createdAt,
      }))
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// POST /api/admin/users/:id/plan
router.post('/users/:id/plan', checkMasterKey, async (req, res) => {
  try {
    const userId = req.params.id;
    const { plan } = req.body;
    const licenseKey = plan !== 'free' ? `GUM-${plan.toUpperCase()}-${Date.now().toString().slice(-4)}` : null;

    if (isPostgresAvailable) {
      await query(
        'UPDATE users SET plan = $1, license_key = $2 WHERE id = $3',
        [plan, licenseKey, userId]
      );
    } else {
      const user = memoryDB.users.find(u => u.id === userId);
      if (user) {
        user.plan = plan;
        user.license_key = licenseKey;
      }
    }

    return res.json({ success: true, plan, licenseKey });
  } catch (err) {
    console.error('Update plan error:', err);
    return res.status(500).json({ error: 'Failed to update user plan' });
  }
});

export default router;
