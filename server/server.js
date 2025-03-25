// Purpose: Server file for backend
const express = require('express');
const cors = require("cors");
const path = require('path');
const authRoutes = require("./auth");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON body parsing
app.use("/api/auth", authRoutes); // Include auth routes

const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..' , 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// v1.1.0
