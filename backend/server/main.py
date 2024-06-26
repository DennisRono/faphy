from flask import Blueprint, jsonify, request
import pickle
import pandas as pd
import yfinance as yf
from .utils.binding import get_stats

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def index():
    return {"message": 'hello'}

@main.route('/predict', methods=['GET', 'POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight request successful"}), 200
    try:
        frontend_data = request.get_json()
        # get data as an object
        downloaded_data = pd.read_csv('Data/downloaded_data.csv')
        date_filter = frontend_data.get("date")
        ticker = frontend_data.get("ticker")
        filtered_data = downloaded_data[downloaded_data['Date'] == date_filter]
        data  = filtered_data[filtered_data['Ticker'] == ticker]
        data = data.drop(columns=['Ticker', 'Date'], inplace=False)
        print(data)
        def load_model_and_predict(data):
            with open("Model/model_dt_Classification.pkl", 'rb') as file:
                loaded_model = pickle.load(file)
            predictions = loaded_model.predict(data)
            return predictions
        prediction = load_model_and_predict(data)
        return jsonify({'prediction': prediction.tolist()}), 200
    except Exception as e:
        return jsonify({"message": "something wrong happened", "stack": str(e)}), 500

@main.route('/get-data', methods=['GET'])
def getdata():
    ticker = request.args.get('ticker')
    startdate = request.args.get('startdate')
    enddate = request.args.get('enddate')
    data = pd.read_csv('Data/downloaded_data.csv')
    data  = data[data['Ticker'] == ticker]
    data['Date'] = pd.to_datetime(data['Date'])
    if startdate and enddate:
        data = data[(data['Date'] >= startdate) & (data['Date'] <= enddate)]
    data = data.to_dict(orient='records') 
    return jsonify({'data': data}), 200

@main.route('/get-current-data', methods=['GET'])
def getcurrentdata():
    ticker = request.args.get('ticker')
    startdate = request.args.get('startdate')
    enddate = request.args.get('enddate')
    print(ticker, startdate, enddate)
    data = yf.download(ticker, start=startdate, end=enddate)
    print(data)
    if data.empty:
        print({"message": "Did not found!"})
        return jsonify({'data': []}), 200
    else:
        data = data.drop('Adj Close', axis=1)
        data = data.reset_index()
        data = data.to_dict(orient='records') 
        return jsonify({'data': data}), 200

@main.route('/get-last-close-and-predictions', methods=['POST', 'OPTIONS'])
def lastclose():
    try:
        if request.method == 'OPTIONS':
            return jsonify({"message": "Preflight request successful"}), 200
        data = request.get_json()
        ticker_symbols = data.get('symbol')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        lst_rows = []
        def load_model_and_predict(data):
            with open("Model/model_dt_Classification.pkl", 'rb') as file:
                loaded_model = pickle.load(file)
            predictions = loaded_model.predict(df)
            return predictions    
        for ticker_symbol in ticker_symbols:
            data = yf.download(ticker_symbol, start=start_date, end=end_date)
            if data.empty:
                print(data)
                print({"message": "Did not found!"})
            else:
                last_row = data.tail(1)
                df = last_row.drop('Adj Close', axis=1)
                df.reset_index()
                prediction = load_model_and_predict(df)
                df = last_row.reset_index().values.tolist()[0]
                lst_data = {"date":df[0].strftime('%Y-%m-%d'),"open":df[1], "high": df[2], "low": df[3], "close": df[4], "volume": df[6], "symbol": ticker_symbol, "prediction": prediction[0]}
                lst_rows.append(lst_data)
        
        return jsonify({"message": "success", "last_rows": lst_rows}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "error", "last_rows": [] }), 500

@main.route('/get-stats', methods=['GET'])
def serve_stats():
    stats = get_stats()
    return jsonify(stats)


@main.errorhandler(403)
def forbidden(e):
    return jsonify({
        "message": "Forbidden",
        "error": str(e),
        "data": None
    }), 403

@main.errorhandler(404)
def forbidden(e):
    return jsonify({
        "message": "Endpoint Not Found",
        "error": str(e),
        "data": None
    }), 404
