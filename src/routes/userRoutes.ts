import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// create user
router.post('/', async (req, res) => {
    const { email, name, userName } = req.body;
    
    try {
        const result = await prisma.user.create({
            data: {
                email,
                name,
                userName,
                bio: "I'm a new user"
            }
        })
      res.json(result);
    } catch (error) {
        res.status(400).json({ error: "UserName and email must be unique" })
    }
});

// list users
router.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany()
    res.json(allUsers);
});

// get one user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) }});
  res.json(user);
});

// update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
        where: { id: Number(id)},
        data: { bio, name, image }
    })
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: `Failed to update the user with ID:${id}` });
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({ where: {id: Number(id)}});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: `Failed to delete the user with ID:${id}` });
  }
});

export default router;
