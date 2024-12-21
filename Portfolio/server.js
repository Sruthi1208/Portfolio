const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

const stockData = {};  // Store stock holdings by symbol

// Alpha Vantage API key (replace with your own)
const ALPHA_VANTAGE_API_KEY = 'your_api_key_here';

// Fetch real-time stock price from Alpha Vantage
const getStockPrice = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        const latestTime = Object.keys(data['Time Series (5min)'])[0];
        const latestPrice = data['Time Series (5min)'][latestTime]['4. close'];
        return parseFloat(latestPrice);
    } catch (error) {
        console.error('Error fetching stock price', error);
        return null;
    }
};

// Add stock holding to portfolio
app.post('/add-stock', async (req, res) => {
    const { symbol, shares } = req.body;
    if (!symbol || !shares) {
        return res.status(400).json({ error: 'Symbol and shares are required' });
    }

    const price = await getStockPrice(symbol);
    if (price !== null) {
        stockData[symbol] = { shares, price };
        res.status(200).json({ message: 'Stock added successfully', stockData });
    } else {
        res.status(500).json({ error: 'Failed to fetch stock price' });
    }
});

// Get portfolio total value
app.get('/portfolio', (req, res) => {
    let totalValue = 0;
    for (const symbol in stockData) {
        totalValue += stockData[symbol].shares * stockData[symbol].price;
    }
    res.status(200).json({ totalValue });
});

// Delete a stock holding
app.delete('/delete-stock/:symbol', (req, res) => {
    const { symbol } = req.params;
    if (stockData[symbol]) {
        delete stockData[symbol];
        res.status(200).json({ message: 'Stock deleted successfully' });
    } else {
        res.status(404).json({ error: 'Stock not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
