// Purpose: Server file for backend
const express = require('express');
const cors = require("cors");
const authRoutes = require("./auth");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON body parsing
app.use("/api/auth", authRoutes); // Include auth routes

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hi, Node.js v22.14.0 backend! Connect via API to frontend!!!!!! :)');
});

app.get('/menu', async (req, res) => {
  try {
    const connection = await db(); // Await the connection
    const [results] = await connection.query('SELECT name, description, image_name, price FROM items');
    const menuItems = results.map(item => ({
      id: item.item_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image_name
    }));
    res.json(menuItems);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
