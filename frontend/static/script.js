document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/stock-data')
        .then(response => response.json())
        .then(data => {
            const stockDataContainer = document.getElementById('stockData');
            data.forEach(stock => {
                const stockElement = document.createElement('div');
                stockElement.innerHTML = `
                    <h2>${stock.ticker}</h2>
                    <p>Date: ${stock.date}</p>
                    <p>Close Price: ${stock.close}</p>
                    <p>MA (100): ${stock.ma_100}</p>
                    <p>RSI: ${stock.rsi}</p>
                    <p>MACD: ${stock.macd}</p>
                    <p>Stochastic Oscillator: ${stock.stochastic_oscillator}</p>
                    <p>Volume MA (100): ${stock.volume_ma_100}</p>
                    <p>Rolling Mean: ${stock.rolling_mean}</p>
                    <p>Rolling Std: ${stock.rolling_std}</p>
                    <p>Upper Band: ${stock.upper_band}</p>
                    <p>Lower Band: ${stock.lower_band}</p>
                    <p>Close Lagged 1: ${stock.close_lagged_1}</p>
                `;
                stockDataContainer.appendChild(stockElement);
            });
        })
        .catch(error => console.error('Error fetching stock data:', error));
});


