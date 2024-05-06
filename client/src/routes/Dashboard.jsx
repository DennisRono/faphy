import React, { useState, useEffect } from 'react'
import '../styles/css/dashboard.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SignalForm from '../components/SignalForm'
import ChartFinancial from '../components/ChartFinancial'
import api from '../api/axios'
import { v4 as uuidv4 } from 'uuid'
import { formatDate } from '../utils/get_current_date'
import symbolsjson from '../data/symbols.json'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [signalmodal, setsignalModal] = useState(false)
  const [data, setData] = useState([])
  const [symbol, setSymbol] = useState('AAPL')
  const [mysignals, setMySignals] = useState([])
  const [chartloading, setChartLoading] = useState(false)
  const [statsdata, setStatsData] = useState(null)

  const getdata = async (
    ticker = symbol,
    startdate = formatDate(startDate),
    enddate = formatDate(endDate)
  ) => {
    if (startdate !== enddate) {
      setChartLoading(true)
      const res = await api(
        'GET',
        `get-current-data?ticker=${ticker}&startdate=${startdate}&enddate=${enddate}`
      )
      setChartLoading(false)
      if (res.status === 200) {
        const formatted_data = Array.isArray(res.data.data)
          ? res.data.data.map((item) => {
              return {
                x: item.Date,
                y: [item.Open, item.High, item.Low, item.Close],
              }
            })
          : []
        setData(formatted_data)
      } else {
      }
    }
  }
  useEffect(() => {
    getdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, startDate, endDate])

  const getstats = async () => {
    const res = await api('GET', 'get-stats', {})
    setStatsData({
      ...res.data,
      results: JSON.parse(res.data.results),
      stats: JSON.parse(res.data.stats),
    })
  }

  useEffect(() => {
    const getDateOneMonthAgo = () =>
      new Date(new Date().setMonth(new Date().getMonth() - 2))
    setStartDate(getDateOneMonthAgo)
    getdata()
    getstats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  statsdata ? console.log(statsdata) : console.log('Statsis null')

  return (
    <div>
      <Header />
      {signalmodal && (
        <SignalForm
          closeSignalModal={setsignalModal}
          signal={mysignals}
          setMySignals={setMySignals}
        />
      )}
      <div className="dashboard">
        <div className="container dashboard_wrapper">
          <div className="dash_landing_flexxer">
            <div className="dash_landing_left">
              <div className="dash_graph_filters">
                {/* Date Picker */}
                <div className="date_pickers">
                  <div className="dtp_item">
                    <span>Start Date:</span>
                    <DatePicker
                      className="date_picker"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                  <div className="dtp_item">
                    <span>End Date:</span>
                    <DatePicker
                      className="date_picker"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </div>
                  <div className="dtp_item">
                    <select
                      name="symbol"
                      className="signal_input_form"
                      style={{ width: '100%' }}
                      value={symbol}
                      onChange={(e) => {
                        setSymbol(e.target.value)
                      }}
                    >
                      {Array.isArray(symbolsjson) &&
                        symbolsjson.map((symbol) => (
                          <option
                            value={symbol.symbol}
                            key={symbol.symbol}
                          >{`${symbol.name} (${symbol.symbol})`}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <ChartFinancial data={data} loading={chartloading} />
            </div>
            <div className="dash_landing_right">
              <h2 className="dash_my_signals">My Signals</h2>
              <div className="dash_my_signals_list">
                {Array.isArray(mysignals) && mysignals.length !== 0 ? (
                  mysignals.map((signal) => {
                    return (
                      <div
                        key={`${signal.symbol}_${uuidv4()}`}
                        className="dash_signal_item"
                      >{`${signal.symbol} ${signal.horizon} Ksh.${parseFloat(
                        signal.amount
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} - ${signal.timestamp}`}</div>
                    )
                  })
                ) : (
                  <div className="dash_empty_signals">
                    <h3>you do not have any signals! Add One</h3>
                  </div>
                )}
              </div>
              <button
                className="add_my_signals"
                onClick={() => {
                  setsignalModal(true)
                }}
              >
                add signal
              </button>
              <div className="stats">
                {/* {statsdata ? (
                  <table className="stats_table">
                    <thead>
                      <tr>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsdata.results.Values.Duration ? (
                        <tr>
                          <th>Duration</th>
                          <th>{statsdata.results.Values.Duration}</th>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                ) : null} */}
                {statsdata ? (
                  <table className="stats_table">
                    <thead>
                      <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsdata.results.Values['Duration'] ? (
                        <tr>
                          <td>Duration</td>
                          <td>{statsdata.results.Values['Duration']}</td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['Start'] ? (
                        <tr>
                          <td>Start</td>
                          <td>{statsdata.results.Values['Start']}</td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['End'] ? (
                        <tr>
                          <td>End</td>
                          <td>{statsdata.results.Values['End']}</td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['Exposure Time [%]'] ? (
                        <tr>
                          <td>Exposure Time (%)</td>
                          <td>
                            {statsdata.results.Values['Exposure Time [%]']}
                          </td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['Equity Final [$]'] ? (
                        <tr>
                          <td>Final Equity ($)</td>
                          <td>
                            {statsdata.results.Values['Equity Final [$]']}
                          </td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['Equity Peak [$]'] ? (
                        <tr>
                          <td>Peak Equity ($)</td>
                          <td>{statsdata.results.Values['Equity Peak [$]']}</td>
                        </tr>
                      ) : null}
                      {statsdata.results.Values['Return [%]'] ? (
                        <tr>
                          <td>Return (%)</td>
                          <td>{statsdata.results.Values['Return [%]']}</td>
                        </tr>
                      ) : null}
                      {statsdata.stats['Buy & Hold Return [%]'] ? (
                        <tr>
                          <td>Buy & Hold Return (%)</td>
                          <td>{statsdata.stats['Buy & Hold Return [%]']}</td>
                        </tr>
                      ) : null}
                      {statsdata.stats['Max. Drawdown [%]'] ? (
                        <tr>
                          <td>Max. Drawdown (%)</td>
                          <td>{statsdata.stats['Max. Drawdown [%]']}</td>
                        </tr>
                      ) : null}
                      {statsdata.stats['Win Rate [%]'] ? (
                        <tr>
                          <td>Win Rate (%)</td>
                          <td>{statsdata.stats['Win Rate [%]']}</td>
                        </tr>
                      ) : null}
                      {statsdata.stats['Profit Factor'] ? (
                        <tr>
                          <td>Profit Factor</td>
                          <td>{statsdata.stats['Profit Factor']}</td>
                        </tr>
                      ) : null}
                      {statsdata.stats['SQN'] ? (
                        <tr>
                          <td>SQN</td>
                          <td>{statsdata.stats['SQN']}</td>
                        </tr>
                      ) : null}
                      <tr>
                        <td>Return (Ann.) [%]</td>
                        <td>{statsdata.stats['Return (Ann.) [%]']}</td>
                      </tr>
                      <tr>
                        <td># Trades</td>
                        <td>{statsdata.stats['# Trades']}</td>
                      </tr>
                      <tr>
                        <td>Avg. Drawdown Duration</td>
                        <td>{statsdata.stats['Avg. Drawdown Duration']}</td>
                      </tr>
                      <tr>
                        <td>Avg. Drawdown [%]</td>
                        <td>{statsdata.stats['Avg. Drawdown [%]']}</td>
                      </tr>
                      <tr>
                        <td>Avg. Trade Duration</td>
                        <td>{statsdata.stats['Avg. Trade Duration']}</td>
                      </tr>
                      <tr>
                        <td>Avg. Trade [%]</td>
                        <td>{statsdata.stats['Avg. Trade [%]']}</td>
                      </tr>
                      <tr>
                        <td>Best Trade [%]</td>
                        <td>{statsdata.stats['Best Trade [%]']}</td>
                      </tr>
                      <tr>
                        <td>Buy & Hold Return [%]</td>
                        <td>{statsdata.stats['Buy & Hold Return [%]']}</td>
                      </tr>
                      <tr>
                        <td>Calmar Ratio</td>
                        <td>{statsdata.stats['Calmar Ratio']}</td>
                      </tr>
                      <tr>
                        <td>Expectancy [%]</td>
                        <td>{statsdata.stats['Expectancy [%]']}</td>
                      </tr>
                      <tr>
                        <td>Max. Drawdown Duration</td>
                        <td>{statsdata.stats['Max. Drawdown Duration']}</td>
                      </tr>
                      <tr>
                        <td>Max. Drawdown [%]</td>
                        <td>{statsdata.stats['Max. Drawdown [%]']}</td>
                      </tr>
                      <tr>
                        <td>Max. Trade Duration</td>
                        <td>{statsdata.stats['Max. Trade Duration']}</td>
                      </tr>
                      <tr>
                        <td>Profit Factor</td>
                        <td>{statsdata.stats['Profit Factor']}</td>
                      </tr>
                      <tr>
                        <td>Sharpe Ratio</td>
                        <td>{statsdata.stats['Sharpe Ratio']}</td>
                      </tr>
                      <tr>
                        <td>Sortino Ratio</td>
                        <td>{statsdata.stats['Sortino Ratio']}</td>
                      </tr>
                      <tr>
                        <td>Volatility (Ann.) [%]</td>
                        <td>{statsdata.stats['Volatility (Ann.) [%]']}</td>
                      </tr>
                      <tr>
                        <td>Win Rate [%]</td>
                        <td>{statsdata.stats['Win Rate [%]']}</td>
                      </tr>
                      <tr>
                        <td>Worst Trade [%]</td>
                        <td>{statsdata.stats['Win Rate [%]']}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : null}
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '80vh' }}>
            <iframe
              src="http://localhost:5000/reports/backtesting_regression.html"
              frameborder="0"
              title="sdjfhsdkfhsdkjfhskdjfh"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
