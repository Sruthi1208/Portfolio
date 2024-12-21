const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// In-memory storage for simplicity
let portfolio = [];

// Middleware
app.use(express.json());

// Add stock to portfolio
app.post('/api/stocks', (req, res) => {
  const { symbol, quantity, purchasePrice } = req.body;
  portfolio.push({ symbol, quantity, purchasePrice });
  res.status(201).json({ message: 'Stock added' });
});

// Get all stocks
app.get('/api/stocks', (req, res) => {
  res.json(portfolio);
});

// Delete stock
app.delete('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  portfolio = portfolio.filter(stock => stock.symbol !== symbol);
  res.json({ message: 'Stock deleted' });
});

// Fetch real-time stock price
app.get('/api/stock-price/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const price = response.data['Global Quote']['05. price'];
    res.json({ price: parseFloat(price) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

