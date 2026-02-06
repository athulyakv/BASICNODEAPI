const express = require("express");
const app = express();

app.use(express.json()); // to read JSON body

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Sample REST API
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Athulya" },
    { id: 2, name: "Alex" }
  ]);
});

app.post("/users", (req, res) => {
  const user = req.body;
  res.status(201).json({
    message: "User created",
    user
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
