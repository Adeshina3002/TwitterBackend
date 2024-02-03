import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create tweet
router.post('/', async (req, res) => {
  const { content, image, userId } = req.body;

  try {
    const tweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId,
      },
    });
    res.json(tweet);
  } catch (error) {
    res.status(400).json({ error: 'Error creating tweet' });
  }
});

// lists tweet
router.get('/', async (req, res) => {
  const tweets = await prisma.tweet.findMany({ 
    include: { 
      user: { 
        select: { 
          id: true, 
          name: true, 
          userName: true, 
          image: true 
        }
      } 
    }
});
  res.json(tweets);
});

// get one tweet
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });

    if (!tweet) {
      return res.status(404).json({ error: `Tweet not found` });
    }
    res.status(200).json(tweet);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update tweet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;
  try {
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });

    if (!tweet) {
      return res.status(404).json({ error: `Tweet not found` });
    }

    const updateTweet = await prisma.tweet.update({
      where: { id: Number(id) },
      data: { content, image },
    });
    res.status(200).json({ message: 'Tweet updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating tweet' });
  }
});

// delete tweet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await prisma.tweet.delete({ where: { id: Number(id) } });

    if (!tweet) {
      return res.status(404).json({ error: `Tweet not found` });
    }

    res.status(200).json(tweet);
  } catch (error) {
    res.status(400).json({ error: 'Error deleting tweet' });
  }
});

export default router;
