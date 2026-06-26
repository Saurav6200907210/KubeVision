import express from 'express';
import { query } from '../db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM dashboard_settings LIMIT 1`);
    if (result.rows.length === 0) {
      return res.json({});
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { theme, refresh_interval, default_namespace } = req.body;
    
    // Since there's only one settings row typically, we update the first one
    const result = await query(
      `UPDATE dashboard_settings 
       SET theme = $1, refresh_interval = $2, default_namespace = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = (SELECT id FROM dashboard_settings LIMIT 1)
       RETURNING *`,
      [theme, refresh_interval, default_namespace]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
