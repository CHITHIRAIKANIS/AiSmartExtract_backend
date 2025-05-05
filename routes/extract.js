import { Router } from 'express';
const router = Router();
import { summarizeContent } from '../services/aiService';
import { get } from 'axios';
import { JSDOM } from 'jsdom';
require('dotenv').config(); 

router.post('/', async (req, res) => {
  const { url } = req.body;
  try {
    const page = await get(url);
    const dom = new JSDOM(page.data);
    const text = dom.window.document.body.textContent;

    const summary = await summarizeContent(text.slice(0, 3000));
    res.json({ summary });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to extract content' });
  }
});

export default router;
