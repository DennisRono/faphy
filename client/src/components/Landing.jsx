import React, { useEffect, useState } from 'react'
import '../styles/css/landing.css'
import LineChart from './LineChart'
import stock from '../assets/images/stock.jpg'
import axios from 'axios'
import api from '../api/axios'
import symbolsjson from '../data/symbols.json'
import { getCurrentDate } from '../utils/get_current_date'

const Landing = () => {
  const [prediction, setPrediction] = useState()
  const [data, setData] = useState([])
  const [symbol, setSymbol] = useState('AAPL')

  const getdata = async (
    ticker = symbol,
    startdate = '2023-04-24',
    enddate = '2024-04-24'
  ) => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-data?ticker=${ticker}&startdate=${startdate}&enddate=${enddate}`
    )
    if (res.status === 200) {
      setData(res.data.data)
    }
  }

  const fetchPrediction = async (date = getCurrentDate()) => {
    const res = await api('POST', 'predict', { date: date, ticker: symbol })
    if (res.status === 200) {
      setPrediction(res.data.prediction[0].toLowerCase())
    }
  }

  useEffect(() => {
    fetchPrediction()
    getdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  const prepareclosedata = (data) => {
    const monthlyClosePrices = Array.from({ length: 12 }, () => [])
    data.forEach((entry) => {
      const date = new Date(entry.Date)
      const month = date.getMonth()
      const closePrice = entry.Close
      monthlyClosePrices[month].push(closePrice)
    })
    const monthlyAverageClosePrices = monthlyClosePrices.map((monthData) => {
      if (monthData.length === 0) return 0
      const sum = monthData.reduce((acc, val) => acc + val, 0)
      return sum / monthData.length
    })

    return monthlyAverageClosePrices
  }

  const preparehighdata = (data) => {
    const monthlyHighPrices = Array.from({ length: 12 }, () => [])
    data.forEach((entry) => {
      const date = new Date(entry.Date)
      const month = date.getMonth()
      const highPrice =
        parseInt(entry.High) - Math.floor(Math.random() * (30 - 20 + 1)) + 20
      monthlyHighPrices[month].push(highPrice)
    })
    const monthlyAverageHighPrices = monthlyHighPrices.map((monthData) => {
      if (monthData.length === 0) return 0
      const sum = monthData.reduce((acc, val) => acc + val, 0)
      return sum / monthData.length
    })

    return monthlyAverageHighPrices
  }

  const monthlyAverageClosePrices = prepareclosedata(data)
  const monthlyAveragehighData = preparehighdata(data)

  return (
    <div>
      <div className="landing">
        <div className="container landing_wrapper">
          <div className="landing_left">
            <h1>Stock Portfolio Recomendation</h1>
            <LineChart
              data={[monthlyAverageClosePrices, monthlyAveragehighData]}
              labels={[
                'Jan',
                'feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ]}
              title={['price', 'volume']}
            />
            <div className="landing_model_predictions"></div>
          </div>
          <div className="landing_right">
            <div className="landing_right_wrapper">
              <div className="landing_right_symbols">
                <h1 className="landing_symbols_title">Stock Symbols</h1>
                <ul className="symbols_unordered_list">
                  <img className="symbols_background" src={stock} alt="" />
                  {Array.isArray(symbolsjson) &&
                    symbolsjson.map((sym) => {
                      return (
                        <li
                          onClick={() => {
                            setSymbol(sym.symbol)
                          }}
                          style={
                            symbol === sym.symbol
                              ? { backgroundColor: '#7b42ff', color: '#fff' }
                              : { color: '#fff' }
                          }
                          key={sym.symbol}
                        >
                          {`${sym.name} (${sym.symbol})`}
                        </li>
                      )
                    })}
                </ul>
                <div className="nice_landing_image">
                  <h1>{`Prediction on ${symbol} is: ${
                    prediction === 'up' ? 'BUY' : 'SELL'
                  }`}</h1>
                  {/* <img src={stock} alt="" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
