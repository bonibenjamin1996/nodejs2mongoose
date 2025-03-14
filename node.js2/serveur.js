require('dotenv').config();
const express = require('express')

const port = 3000

const app = express()

app.use(express.json())

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bonisigoubenjamin:boni1996@benjamin.feide.mongodb.net/')
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur de connexion", err));

  

  //schema
  const TaskSchema = new mongoose.Schema({
        title: { type: String, required: true },    
        content: { type: String, required: true },
    });
    
  const Task = mongoose.model("Task", TaskSchema);

  // Route principale
  app.get('/', (req, res) => {
    res.send({ "message": "Bienvenue sur API-Boni!" });
});

// Création de tâche

app.post("/tasks", async (req, res) => {
    try {
        const { title, content, completed } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        
        const newTask = new Task({ title, content, completed: completed ?? false });
        
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("❌ Erreur serveur :", error);  // Affiche l'erreur dans la console
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});


// Récupération des tâches
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Récupération d'une tâche par ID
app.get("/tasks/:id", async (req, res) => {
    try {
       
        const task = await Task.findById(req.params.id);
         
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Mise à jour d'une tâche
app.put("/tasks/:id", async (req, res) => {
    try {
        const { title, content, completed } = req.body;
        
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, content, completed },
            { new: true }
        );
        
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Suppression d'une tâche
app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});


//Demarer le serveur
app.listen(port, (req, res) => { 
    console.log(`Serveur en ligne   sur http://localhost:${port}`)
})
