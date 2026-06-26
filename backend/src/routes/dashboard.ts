import express from 'express';
import { k8sService } from '../services/k8s.service';

const router = express.Router();

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await k8sService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', async (req, res, next) => {
  try {
    const analytics = await k8sService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

export default router;
