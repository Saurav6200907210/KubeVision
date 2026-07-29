import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// In-memory store for pairing codes (code -> { sessionId, expiresAt })
// In a real production app with multiple instances, use Redis.
const pairingCodes = new Map<string, { sessionId: string, expiresAt: number }>();

const JWT_SECRET = process.env.JWT_SECRET || 'kubevision-super-secret-key';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/pair', (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(400).json({ error: 'sessionId is required' });
    return;
  }

  // Clear existing codes for this session (naive approach for this example)
  for (const [code, data] of pairingCodes.entries()) {
    if (data.sessionId === sessionId) {
      pairingCodes.delete(code);
    }
  }

  const code = generateCode();
  // 5 minutes expiration
  const expiresAt = Date.now() + 5 * 60 * 1000;
  
  pairingCodes.set(code, { sessionId, expiresAt });
  
  res.json({ code, expiresAt });
});

router.post('/connect', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    res.status(400).json({ error: 'code is required' });
    return;
  }

  const data = pairingCodes.get(code);
  if (!data) {
    res.status(400).json({ error: 'Invalid pairing code' });
    return;
  }

  if (Date.now() > data.expiresAt) {
    pairingCodes.delete(code);
    res.status(400).json({ error: 'Pairing code expired' });
    return;
  }

  // Valid code, generate JWT
  const token = jwt.sign({ sessionId: data.sessionId }, JWT_SECRET, { expiresIn: '30d' });
  
  // Clean up code
  pairingCodes.delete(code);

  res.json({ token, sessionId: data.sessionId });
});

export default router;
