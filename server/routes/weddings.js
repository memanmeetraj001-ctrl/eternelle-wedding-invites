import express from 'express';
import { query, isPostgresAvailable, memoryDB } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// Helper to map DB row to wedding object
function mapRowToWedding(row) {
  const custom = typeof row.theme_customizations === 'string' ? JSON.parse(row.theme_customizations || '{}') : (row.theme_customizations || {});
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    coupleName1: row.couple_name1,
    coupleName2: row.couple_name2,
    coupleInitials: row.couple_initials,
    subtitleIntro: row.subtitle_intro,
    headline: row.headline,
    weddingDate: row.wedding_date,
    weddingTime: row.wedding_time,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    cityState: row.city_state,
    mapsUrl: row.maps_url,
    rsvpDeadline: row.rsvp_deadline,
    themeId: row.theme_id,
    themeCustomizations: custom,
    timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline || '[]') : (row.timeline || []),
    menu: custom.menu || [],
    storyTitle: custom.storyTitle || 'Our Love Story',
    storyText: custom.storyText || '',
    faqs: custom.faqs || [],
    hotels: typeof row.hotels === 'string' ? JSON.parse(row.hotels || '[]') : (row.hotels || []),
    dressCode: typeof row.dress_code === 'string' ? JSON.parse(row.dress_code || '{}') : (row.dress_code || {}),
    photos: typeof row.photos === 'string' ? JSON.parse(row.photos || '[]') : (row.photos || []),
    transportInfo: row.transport_info,
    giftRegistryUrl: row.gift_registry_url,
    musicEnabled: row.music_enabled !== false,
    backgroundMusicUrl: row.background_music_url,
  };
}

// GET /api/weddings/mine (Private - for authenticated user)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (isPostgresAvailable) {
      const result = await query('SELECT * FROM weddings WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1', [userId]);
      if (result.rows.length > 0) {
        return res.json({ wedding: mapRowToWedding(result.rows[0]) });
      }
    } else {
      const wedding = Object.values(memoryDB.weddings).find(w => w.userId === userId);
      if (wedding) {
        return res.json({ wedding });
      }
    }
    return res.status(404).json({ error: 'No wedding suite found for this user' });
  } catch (err) {
    console.error('Error fetching user wedding:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/weddings/:slug (Public - for guests & preview)
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();

    if (isPostgresAvailable) {
      const result = await query('SELECT * FROM weddings WHERE LOWER(slug) = $1 OR id = $1', [slug]);
      if (result.rows.length > 0) {
        return res.json({ wedding: mapRowToWedding(result.rows[0]) });
      }
    } else {
      const wedding = memoryDB.weddings[slug] || Object.values(memoryDB.weddings).find(w => w.slug === slug || w.id === slug);
      if (wedding) {
        return res.json({ wedding });
      }
    }

    return res.status(404).json({ error: 'Wedding suite not found' });
  } catch (err) {
    console.error('Error fetching wedding by slug:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/weddings (Save or update couple wedding suite)
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const weddingId = data.id || 'wed_' + Date.now();
    const slug = (data.slug || 'my-wedding').toLowerCase().trim();

    if (isPostgresAvailable) {
      const sql = `
        INSERT INTO weddings (
          id, user_id, slug, couple_name1, couple_name2, couple_initials,
          subtitle_intro, headline, wedding_date, wedding_time, venue_name,
          venue_address, city_state, maps_url, rsvp_deadline, theme_id,
          theme_customizations, timeline, hotels, dress_code, photos,
          transport_info, gift_registry_url, music_enabled, background_music_url, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          couple_name1 = EXCLUDED.couple_name1,
          couple_name2 = EXCLUDED.couple_name2,
          couple_initials = EXCLUDED.couple_initials,
          subtitle_intro = EXCLUDED.subtitle_intro,
          headline = EXCLUDED.headline,
          wedding_date = EXCLUDED.wedding_date,
          wedding_time = EXCLUDED.wedding_time,
          venue_name = EXCLUDED.venue_name,
          venue_address = EXCLUDED.venue_address,
          city_state = EXCLUDED.city_state,
          maps_url = EXCLUDED.maps_url,
          rsvp_deadline = EXCLUDED.rsvp_deadline,
          theme_id = EXCLUDED.theme_id,
          theme_customizations = EXCLUDED.theme_customizations,
          timeline = EXCLUDED.timeline,
          hotels = EXCLUDED.hotels,
          dress_code = EXCLUDED.dress_code,
          photos = EXCLUDED.photos,
          transport_info = EXCLUDED.transport_info,
          gift_registry_url = EXCLUDED.gift_registry_url,
          music_enabled = EXCLUDED.music_enabled,
          background_music_url = EXCLUDED.background_music_url,
          updated_at = NOW()
        RETURNING *;
      `;

      const fullCustom = {
        ...(data.themeCustomizations || {}),
        menu: data.menu || [],
        storyTitle: data.storyTitle || 'Our Love Story',
        storyText: data.storyText || '',
        faqs: data.faqs || [],
      };

      const values = [
        weddingId, userId, slug, data.coupleName1 || 'Bride', data.coupleName2 || 'Groom',
        data.coupleInitials || 'B&G', data.subtitleIntro || '', data.headline || '',
        data.weddingDate || '2027-06-18', data.weddingTime || '', data.venueName || '',
        data.venueAddress || '', data.cityState || '', data.mapsUrl || '',
        data.rsvpDeadline || '', data.themeId || 'olive-burgundy',
        JSON.stringify(fullCustom),
        JSON.stringify(data.timeline || []),
        JSON.stringify(data.hotels || []),
        JSON.stringify(data.dressCode || {}),
        JSON.stringify(data.photos || []),
        data.transportInfo || '', data.giftRegistryUrl || '',
        data.musicEnabled !== false, data.backgroundMusicUrl || ''
      ];

      await query(sql, values);
    } else {
      memoryDB.weddings[slug] = { ...data, id: weddingId, userId, slug };
    }

    return res.json({ success: true, wedding: { ...data, id: weddingId, userId, slug } });
  } catch (err) {
    console.error('Save wedding error:', err);
    return res.status(500).json({ error: 'Failed to save wedding data' });
  }
});

export default router;
