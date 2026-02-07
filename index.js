const express = require('express');
require('dotenv').config();

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(express.json()); // read JSON body

// Set response headers
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// --------------------
// SIMPLE DATABASE
// --------------------
let users = [
  { id: 1, name: "Athulya" }
];

// --------------------
// AUTH MIDDLEWARE
// --------------------
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token || token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

// --------------------
// ROOT API
// --------------------
app.get('/', (req, res) => {
  res.json({ message: "Node.js REST API is running" });
});

// --------------------
// GET API
// --------------------
app.get('/users', (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// POST API
// --------------------
app.post('/users', authMiddleware, (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newUser = {
      id: users.length + 1,
      name
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// PUT API
// --------------------
app.put('/users/:id', authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// DELETE API
// --------------------
app.delete('/users/:id', authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// 404 HANDLER
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
// START SERVER
// --------------------
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
