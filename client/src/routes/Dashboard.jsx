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

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [signalmodal, setsignalModal] = useState(false)
  const [data, setData] = useState([])
  const [symbol, setSymbol] = useState('AAPL')
  const [mysignals, setMySignals] = useState([])

  const getdata = async (
    ticker = symbol,
    startdate = formatDate(startDate),
    enddate = formatDate(endDate)
  ) => {
    if (startdate !== enddate) {
      const res = await api(
        'GET',
        `get-current-data?ticker=${ticker}&startdate=${startdate}&enddate=${enddate}`
      )
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
  useEffect(() => {
    const getDateOneMonthAgo = () =>
      new Date(new Date().setMonth(new Date().getMonth() - 2))
    setStartDate(getDateOneMonthAgo)
    getdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
                  <div className="dtp_item"></div>
                </div>
              </div>
              <ChartFinancial data={data} />
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
