import express from 'express';
import { query, isPostgresAvailable, memoryDB } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// GET /api/rsvps/:weddingId (Couple viewing their RSVP responses)
router.get('/:weddingId', async (req, res) => {
  try {
    const weddingId = req.params.weddingId;

    if (isPostgresAvailable) {
      const result = await query(
        'SELECT * FROM rsvps WHERE wedding_id = $1 ORDER BY submitted_at DESC',
        [weddingId]
      );
      const rsvps = result.rows.map(row => ({
        id: row.id,
        weddingId: row.wedding_id,
        guestName: row.guest_name,
        guestEmail: row.guest_email,
        attendance: row.attendance,
        partySize: row.party_size,
        plusOneNames: row.plus_one_names || [],
        mealChoice: row.meal_choice,
        dietaryNotes: row.dietary_notes,
        songRequest: row.song_request,
        personalMessage: row.personal_message,
        submittedAt: row.submitted_at,
      }));
      return res.json({ rsvps });
    } else {
      const rsvps = memoryDB.rsvps[weddingId] || [];
      return res.json({ rsvps });
    }
  } catch (err) {
    console.error('Error fetching RSVPs:', err);
    return res.status(500).json({ error: 'Failed to retrieve RSVPs' });
  }
});

// POST /api/rsvps/:weddingId (Public guest submission)
router.post('/:weddingId', async (req, res) => {
  try {
    const weddingId = req.params.weddingId;
    const { guestName, guestEmail, attendance, partySize, plusOneNames, mealChoice, dietaryNotes, songRequest, personalMessage } = req.body;

    if (!guestName) {
      return res.status(400).json({ error: 'Guest name is required' });
    }

    const rsvpId = 'rsvp_' + Date.now();
    const submittedAt = new Date().toISOString();

    if (isPostgresAvailable) {
      await query(
        `INSERT INTO rsvps (
          id, wedding_id, guest_name, guest_email, attendance, party_size, plus_one_names, meal_choice, dietary_notes, song_request, personal_message, submitted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          rsvpId, weddingId, guestName, guestEmail || '', attendance || 'attending',
          partySize || 1, JSON.stringify(plusOneNames || []), mealChoice || '',
          dietaryNotes || '', songRequest || '', personalMessage || '', submittedAt
        ]
      );
    } else {
      if (!memoryDB.rsvps[weddingId]) {
        memoryDB.rsvps[weddingId] = [];
      }
      memoryDB.rsvps[weddingId].unshift({
        id: rsvpId,
        weddingId,
        guestName,
        guestEmail,
        attendance: attendance || 'attending',
        partySize: partySize || 1,
        plusOneNames: plusOneNames || [],
        mealChoice,
        dietaryNotes,
        songRequest,
        personalMessage,
        submittedAt,
      });
    }

    return res.status(201).json({
      success: true,
      rsvp: {
        id: rsvpId,
        weddingId,
        guestName,
        guestEmail,
        attendance: attendance || 'attending',
        partySize: partySize || 1,
        plusOneNames: plusOneNames || [],
        mealChoice,
        dietaryNotes,
        songRequest,
        personalMessage,
        submittedAt,
      }
    });
  } catch (err) {
    console.error('Error submitting RSVP:', err);
    return res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

export default router;
