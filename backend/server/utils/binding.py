import pickle
import yfinance as yf
import pandas as pd
import numpy as np

def download_top_ten_data(tickers, start_date, end_date):
    data = {}
    for ticker in tickers:
        data[ticker] = yf.download(ticker, start=start_date, end=end_date)
    combined_data = pd.concat(data.values(), keys=data.keys(), names=['Ticker', 'Date'])
    return combined_data

def data_cleaning(df):
    df = df.drop(columns=['Adj Close'])
    df['change_tomorrow'] = df['Close'].pct_change(-1)
    df['change_tomorrow'] = df['change_tomorrow'] * -1
    df['change_tomorrow'] = df['change_tomorrow'] * 100
    df = df.drop(columns = ['change_tomorrow'])
    df = df.dropna().copy()
    return df

def load_model_and_predict(data):
    with open("../../Model/model_dt_Classification.pkl", 'rb') as file:
        loaded_model = pickle.load(file)
    predictions = loaded_model.predict(data)
    return predictions

top_ten_tickers = ['AAPL', 'MSFT', 'AMZN', 'SBUX', 'AMD', 'META', 'TSLA', 'CSCO', 'QCOM', 'NFLX', 'GOOG']
start_date = '2000-01-01'
end_date = '2024-04-24'

combined_data = download_top_ten_data(top_ten_tickers, start_date, end_date)
# combined_data.to_csv("../../Data/downloaded_data.csv", index=True)
# df = combined_data.loc['GOOG']

# df.head()

# Clean the data
cleaned_data = data_cleaning(combined_data)
cleaned_data.head()
cleaned_data.to_csv("../../Data/downloaded_data.csv", index=True)


# Load model and make predictions
#predictions = load_model_and_predict(cleaned_data)

# print(predictions)