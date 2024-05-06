import numpy as np
import pandas as pd
from backtesting import Backtest, Strategy
import pickle
from bokeh.plotting import save, output_file, show
import json

# Load pre-trained LSTM model
with open("Model/model_dt_regression.pkl", 'rb') as file:
    loaded_model = pickle.load(file)

data = pd.read_csv('Data/downloaded_data.csv')
data = data[data['Ticker'] == 'GOOG']
data.drop(columns=['Ticker', 'Date'], inplace=True)

class Regression(Strategy):
    def init(self):
        self.model = loaded_model
        self.already_bought = False
    def next(self):
        explanatory_today = self.data.df.iloc[[-1], :]
        forecast_tomorrow = self.model.predict(explanatory_today)[0]
        if forecast_tomorrow > 1 and self.already_bought == False:
            self.buy()
            self.already_bought = True
        elif forecast_tomorrow < -5 and self.already_bought == True:
            self.sell()
            self.already_bought = False
        else:
            pass

def get_stats():
    df_explanatory = data[['Open', 'High', 'Low', 'Close', 'Volume']].copy()
    df_explanatory.iloc[-1:, :]
    bt = Backtest(df_explanatory, Regression,
                cash=10000, commission=.002, exclusive_orders=True)
    results = bt.run()
    results_fr= results.to_frame(name='Values').loc[:'Return [%]']
    stats = bt.run()
    

    plot = bt.plot(filename='server/reports_backtesting/backtesting_regression.html', open_browser=False)

    output_file("server/reports_backtesting/backtesting_regression.html")
    save(plot)

    results_json = results_fr.to_json()
    stats_json = stats.to_json()
    data_dict = json.loads(stats_json)
    data_dict.pop('_strategy', None)
    data_dict.pop('_equity_curve', None)
    data_dict.pop('_trades', None)
    updated_json_data = json.dumps(data_dict)

    return {"results": results_json, "stats": updated_json_data }


