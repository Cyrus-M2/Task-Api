import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.send("Welcome To My Task API.");
});

// create a task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, isCompleted } = req.body;

        const task = await prisma.tasks.create({ 
            data: {
                title,
                description,
                isCompleted: isCompleted ?? false
            }
        });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Failed to create task'})
    }
});

// get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.tasks.findMany();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Failed to fetch tasks'})
    }
});

// get a task by id
app.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const task = await prisma.tasks.findUnique({ 
            where: { id } 
        });

        if (!task) {
            return res.status(404).json({error:'Task not found'})
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Failed to fetch task'})
    }
});

// update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, isCompleted } = req.body;

        const updated = await prisma.tasks.update({ 
            where: { id },
            data: { title, description, isCompleted }
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Failed to update task'})
    }
});

// delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tasks.delete({ where: { id } });
        res.json({ message:'Task deleted successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Failed to delete task'})
    }
});

// port
const port = process.env.PORT || 6500;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
