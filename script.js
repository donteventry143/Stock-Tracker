const stocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "ADBE", name: "Adobe Inc." }
];

const trendingStocks = ["AAPL", "TSLA", "NVDA"]; 
const API_KEY = "cu2tb11r01qh0l7i40ogcu2tb11r01qh0l7i40p0"; 


async function handleStockSearch(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");
    const symbol = searchBox.value.trim().toUpperCase();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.c && data.pc) {
            const currentPrice = data.c;
            const previousClose = data.pc;
            const difference = currentPrice - previousClose;
            const percentageChange = (difference / previousClose) * 100;

            displaySearchedStock(symbol, currentPrice, difference, percentageChange);
        } else {
            alert(`No data found for symbol: ${symbol}`);
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
        alert("Failed to fetch stock data. Please try again.");
    }
}


function displaySearchedStock(symbol, price, difference, percentageChange) {
    const stockGrid = document.getElementById("stockGrid");
    const existingStock = document.getElementById(`searched-${symbol}`);

    if (existingStock) {
        existingStock.remove();
    }

    const div = document.createElement("div");
    div.className = "stock-box";
    div.id = `searched-${symbol}`;
    div.innerHTML = `
        <h3>${symbol}</h3>
        <p>Price: <span class="price">$${price.toFixed(2)}</span></p>
        <p class="change" style="color: ${difference > 0 ? "green" : "red"};">
            ${difference > 0 ? "+" : ""}${difference.toFixed(2)} (${percentageChange.toFixed(2)}%)
        </p>
    `;
    stockGrid.prepend(div);
}


async function fetchStockPrice(symbol, isTrending = false) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.c && data.pc) {
            const currentPrice = data.c;
            const previousClose = data.pc;
            const difference = currentPrice - previousClose;
            const percentageChange = (difference / previousClose) * 100;

            updatePrice(symbol, currentPrice, difference, percentageChange, isTrending);
        } else {
            console.warn(`No price data available for ${symbol}`);
        }
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
    }
}


function updatePrice(symbol, price, difference, percentageChange, isTrending) {
    const stockId = isTrending ? `trending-${symbol}` : `stock-${symbol}`;
    const stockElement = document.querySelector(`#${stockId}`);
    if (stockElement) {
        const priceElement = stockElement.querySelector(".price");
        const changeElement = stockElement.querySelector(".change");

        if (priceElement && changeElement) {
            priceElement.textContent = `$${price.toFixed(2)}`;
            changeElement.textContent = `${difference > 0 ? "+" : ""}${difference.toFixed(2)} (${percentageChange.toFixed(2)}%)`;
            changeElement.style.color = difference > 0 ? "green" : "red";
        }
    }
}


function displayStocks() {
    const stockGrid = document.getElementById("stockGrid");
    stockGrid.innerHTML = "";

    stocks.forEach((stock) => {
        const div = document.createElement("div");
        div.className = "stock-box";
        div.id = `stock-${stock.symbol}`;
        div.innerHTML = `
            <h3>${stock.name} (${stock.symbol})</h3>
            <p>Price: <span class="price">Loading...</span></p>
            <p class="change">Change: Loading...</p>
        `;
        stockGrid.appendChild(div);
        fetchStockPrice(stock.symbol);
    });
}


function displayTrendingStocks() {
    const trendingGrid = document.getElementById("trendingGrid");
    trendingGrid.innerHTML = "";

    trendingStocks.forEach((symbol) => {
        const stock = stocks.find((s) => s.symbol === symbol);
        if (stock) {
            const div = document.createElement("div");
            div.className = "stock-box";
            div.id = `trending-${stock.symbol}`;
            div.innerHTML = `
                <h3>${stock.name} (${stock.symbol})</h3>
                <p>Price: <span class="price">Loading...</span></p>
                <p class="change">Change: Loading...</p>
            `;
            trendingGrid.appendChild(div);
            fetchStockPrice(stock.symbol, true);
        }
    });
}


displayStocks();
displayTrendingStocks();


const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleStockSearch(event);
    }
});
