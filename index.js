import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const client = new PrismaClient();

app.use(express.json());


// routes
app.get("/", (req, res) => {
    res.send("Welcome To My Task API")
})

app.post('/tasks', async (req, res) => {
    try {
            const { title, description, isCompleted} = req.body;
            const task = await client.Tasks.create({
                data: {
                    title,
                    description,
                    isCompleted: isCompleted || false
                }
            });
            res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({error: 'Failed to create task'});
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await client.Tasks.findMany();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.json(tasks);
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
           const task = await client.Tasks.findUnique({
        where: {
            id: req.params.id

        }
    });
    
    if (!task) {
        return res.status(404).json({error: 'Task not found'})
    }
    res.json(task);
} catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({error: 'Failed to fetch task'})
}
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, description, isCompleted } = req.body;

        const updatedTask = await client.Tasks.update({
            where: {
                id: req.params.id
            },
            data: {
                title,
                description,
                isCompleted
            }
        });
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({error: 'Failed to update task'});
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        await client.Tasks.delete({
            where: {
                id: req.params.id
            }
        });
        res.status(200).end();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task'});
    }
})

// const port = process.env.PORT || 1000;
let port;
if (process.env.PORT){
    port = process.env.PORT || 6000;
} else {
   port = 6000; 
}


app.listen(port, () => {
    console.log("App running on port ${port}");
})
