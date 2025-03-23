// Purpose: Server file for backend
const express = require('express');
const cors = require("cors");
const authRoutes = require("./auth");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON body parsing
app.use("/api/auth", authRoutes); // Include auth routes

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hi, Node.js v22.14.0 backend! Connect via API to frontend!!!!!! :)');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
