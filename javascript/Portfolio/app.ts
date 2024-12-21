let portfolio = [];
const stockTableBody = document.querySelector("#stockTable tbody");
const totalValueEl = document.getElementById("totalValue");
const topStockEl = document.getElementById("topStock");
const chartCtx = document.getElementById("distributionChart").getContext("2d");

// Add stock to portfolio
document.getElementById("stockForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const symbol = document.getElementById("symbol").value.toUpperCase();
  const quantity = parseInt(document.getElementById("quantity").value);
  const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);

  const currentPrice = await fetchStockPrice(symbol);
  portfolio.push({ symbol, quantity, purchasePrice, currentPrice });
  updatePortfolio();
});

// Fetch real-time stock price
async function fetchStockPrice(symbol) {
  const response = await fetch(`/api/stock-price/${symbol}`);
  const data = await response.json();
  return data.price;
}

// Update portfolio table and metrics
function updatePortfolio() {
  stockTableBody.innerHTML = "";
  let totalValue = 0;
  let topStock = { symbol: "N/A", value: 0 };
  const distribution = {};

  portfolio.forEach((stock) => {
    const value = stock.currentPrice * stock.quantity;
    totalValue += value;

    if (value > topStock.value) {
      topStock = { symbol: stock.symbol, value };
    }

    distribution[stock.symbol] = value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stock.symbol}</td>
      <td>${stock.quantity}</td>
      <td>${stock.purchasePrice}</td>
      <td>${stock.currentPrice.toFixed(2)}</td>
      <td>${value.toFixed(2)}</td>
      <td><button onclick="deleteStock('${stock.symbol}')">Delete</button></td>
    `;
    stockTableBody.appendChild(row);
  });

  totalValueEl.textContent = totalValue.toFixed(2);
  topStockEl.textContent = topStock.symbol;
  updateChart(distribution);
}

// Delete stock
function deleteStock(symbol) {
  portfolio = portfolio.filter(stock => stock.symbol !== symbol);
  updatePortfolio();
}

// Update portfolio distribution chart
function updateChart(distribution) {
  new Chart(chartCtx, {
    type: "pie",
    data: {
      labels: Object.keys(distribution),
      datasets: [{
        data: Object.values(distribution),
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
      }],
    },
  });
}
