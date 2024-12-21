document.getElementById('stock-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const symbol = document.getElementById('stock-symbol').value.toUpperCase();
    const shares = parseInt(document.getElementById('stock-shares').value);

    // Add stock to the backend
    const response = await fetch('http://localhost:3000/add-stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, shares }),
    });
    const data = await response.json();
    if (data.message) {
        alert('Stock added successfully!');
        loadPortfolio();
    } else {
        alert('Failed to add stock');
    }
});

async function loadPortfolio() {
    // Fetch total portfolio value
    const portfolioResponse = await fetch('http://localhost:3000/portfolio');
    const portfolioData = await portfolioResponse.json();
    document.getElementById('total-value').textContent = portfolioData.totalValue.toFixed(2);

    // Fetch portfolio stocks
    const portfolioList = document.getElementById('portfolio-list');
    portfolioList.innerHTML = '';

    const response = await fetch('http://localhost:3000/portfolio');
    const data = await response.json();
    for (const symbol in data) {
        const li = document.createElement('li');
        li.textContent = `${symbol}: ${data[symbol].shares} shares at $${data[symbol].price} each`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', async () => {
            await fetch(`http://localhost:3000/delete-stock/${symbol}`, { method: 'DELETE' });
            loadPortfolio();
        });
        li.appendChild(deleteButton);
        portfolioList.appendChild(li);
    }
}

// Initial load
loadPortfolio();
