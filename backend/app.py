# from flask import Flask, jsonify, render_template, request, redirect
# from .binding import db,StockData
# import pandas as pd
# import yfinance as yf

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stock_data.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)

# # Function to calculate moving average
# def calculate_moving_average(df, window, min_periods=1):
#     return df['Close'].rolling(window=window, min_periods=min_periods).mean()

# # Function to calculate RSI
# def calculate_rsi(data, window=14):
#     delta = data['Close'].diff()
#     gain = delta.where(delta > 0, 0)
#     loss = -delta.where(delta < 0, 0)
#     avg_gain = gain.rolling(window=window, min_periods=1).mean()
#     avg_loss = loss.rolling(window=window, min_periods=1).mean()
#     rs = avg_gain / avg_loss
#     rsi = 100 - (100 / (1 + rs))
#     return rsi

# # Function to calculate MACD
# def calculate_macd(data, short_window=12, long_window=26):
#     return data['Close'].ewm(span=short_window).mean() - data['Close'].ewm(span=long_window).mean()

# # Function to calculate stochastic oscillator
# def calculate_stochastic_oscillator(data, window=14):
#     low_min = data['Low'].rolling(window=window, min_periods=1).min()
#     high_max = data['High'].rolling(window=window, min_periods=1).max()
#     return (data['Close'] - low_min) / (high_max - low_min) * 100

# # Function to calculate Bollinger Bands
# def calculate_bollinger_bands(data, window=100):
#     rolling_mean = data['Close'].rolling(window=window, min_periods=1).mean()
#     rolling_std = data['Close'].rolling(window=window, min_periods=1).std()
#     upper_band = rolling_mean + 2 * rolling_std
#     lower_band = rolling_mean - 2 * rolling_std
#     return rolling_mean, rolling_std, upper_band, lower_band

# @app.route('/api/stock-data', methods=['GET'])
# def get_stock_data():
#     # Fetch stock data from the database
#     stock_data = StockData.query.all()

#     # Convert stock data to DataFrame
#     df = pd.DataFrame([(stock.ticker, stock.date, stock.open, stock.high, stock.low, stock.close, stock.adj_close, stock.volume) for stock in stock_data],
#                       columns=['Ticker', 'Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'])

#     # Calculate additional features
#     df['100_day_MA'] = calculate_moving_average(df, window=100)
#     df['RSI'] = calculate_rsi(df)
#     df['MACD'] = calculate_macd(df)
#     df['Stochastic_Oscillator'] = calculate_stochastic_oscillator(df)
#     df['100_day_volume_MA'] = calculate_moving_average(df, window=100, min_periods=1)
#     df['Rolling_mean'], df['Rolling_std'], df['Upper_band'], df['Lower_band'] = calculate_bollinger_bands(df)

#     # Convert DataFrame back to list of dictionaries
#     data = df.to_dict(orient='records')

#     return jsonify(data)

# @app.route('/', methods=['POST', 'GET'])
# def index():
#     if request.method == 'POST':
#         task_content = request.form['content']
#         new_task = StockData(content=task_content)
#         try:
#             db.session.add(new_task)
#             db.session.commit()
#             return redirect('/')
#         except:
#             return 'There was an issue adding your task'
#     else:
#         tasks = StockData.query.order_by(StockData.date_created).all()
#         return render_template('index.html', tasks=tasks)


# if __name__ == '__main__':
#     app.run(debug=True)
