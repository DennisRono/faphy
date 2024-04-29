from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stock_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Bind the Flask application to SQLAlchemy
db = SQLAlchemy(app)

class StockData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(10))
    date = db.Column(db.Date)
    open = db.Column(db.Float)  # Opening price
    high = db.Column(db.Float)  # Highest price
    low = db.Column(db.Float)   # Lowest price
    close = db.Column(db.Float)  # Closing price
    adj_close = db.Column(db.Float)  # Adjusted closing price
    volume = db.Column(db.Float)  # Trading volume
    ma_100 = db.Column(db.Float)  # 100-day moving average
    price_std = db.Column(db.Float)  # Price standard deviation
    rsi = db.Column(db.Float)  # Relative Strength Index
    macd = db.Column(db.Float)  # MACD
    stochastic_oscillator = db.Column(db.Float)  # Stochastic Oscillator
    volume_ma_100 = db.Column(db.Float)  # 100-day volume moving average
    rolling_mean = db.Column(db.Float)  # Rolling mean for Bollinger Bands
    rolling_std = db.Column(db.Float)  # Rolling standard deviation for Bollinger Bands
    upper_band = db.Column(db.Float)  # Upper Bollinger Band
    lower_band = db.Column(db.Float)  # Lower Bollinger Band
    close_lagged_1 = db.Column(db.Float)  # Lagged variable (Close price from previous day)


def predict_stock_direction(StockData):
    
    
    predictions = []
    for index, row in StockData.iterrows():
        # Example: if closing price tomorrow is higher than today, predict 'Up'
        if row['Close_tomorrow'] > row['Close_today']:
            predictions.append('Up')
        # Example: if closing price tomorrow is lower than today, predict 'Down'
        elif row['Close_tomorrow'] < row['Close_today']:
            predictions.append('Down')
        # Example: if closing price tomorrow is same as today, predict 'No Change'
        else:
            predictions.append('No Change')
    
    return predictions
# Route to create the database
@app.route('/create-db')
def create_db():
    db.create_all()
    return 'Database created successfully!'

if __name__ == '__main__':
    app.run(debug=True)
