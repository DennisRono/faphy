import React, { useState } from 'react'
import '../styles/css/signal_modal.css'
import { ReactComponent as Xmark } from '../assets/svg/x-mark.svg'
import symbolsjson from '../data/symbols.json'

const SignalForm = ({ closeSignalModal, signal, setMySignals }) => {
  const timestamp = () => {
    const date = new Date()
    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
    return formattedDate
  }
  const [data, setData] = useState({
    horizon: 'medium',
    amount: 0,
    symbol: 'AAPL',
    timestamp: timestamp(),
  })
  const handleSignal = (e) => {
    e.preventDefault()
    setMySignals([...signal, data])
    closeSignalModal(false)
  }
  return (
    <div>
      <div className="signal_modal">
        <div className="signal_mod_wrapper">
          <div
            className="signal_mod_inner_wrapper"
            onClick={() => {
              closeSignalModal(false)
            }}
          >
            <div
              className="signal_mod_form_box"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Xmark
                className="signal_modal_close"
                onClick={() => {
                  closeSignalModal(false)
                }}
              />
              <h2 className="signal_box_title">Set Your Signals</h2>
              <form
                className="signal_form"
                onSubmit={(e) => {
                  handleSignal(e)
                }}
              >
                <div className="signal_form_group">
                  <label htmlFor="amount">Horizon</label>
                  <br />
                  <select
                    name="horizon"
                    className="signal_input_form"
                    style={{ width: '100%' }}
                    value={data.horizon}
                    onChange={(e) => {
                      setData({ ...data, [e.target.name]: e.target.value })
                    }}
                  >
                    <option value="medium">3-6 Months</option>
                    <option value="long_term">1-3 Years</option>
                    <option value="short_term">3 Months</option>
                  </select>
                </div>
                <div className="signal_form_group">
                  <label htmlFor="amount">Amount</label>
                  <br />
                  <input
                    type="text"
                    name="amount"
                    className="signal_input_form"
                    value={data.amount}
                    onChange={(e) => {
                      setData({ ...data, [e.target.name]: e.target.value })
                    }}
                  />
                </div>
                {/* <div className="signal_form_group_flexxer">
                  <div className="signal_form_group">
                    <label htmlFor="amount">Amount</label>
                    <br />
                    <input type="text" name="" className="signal_input_form" />
                  </div>
                  <div className="signal_form_group">
                    <label htmlFor="amount">Amount</label>
                    <br />
                    <input type="text" name="" className="signal_input_form" />
                  </div>
                </div> */}
                <div className="signal_form_group">
                  <label htmlFor="amount">Symbol</label>
                  <br />
                  <select
                    name="symbol"
                    className="signal_input_form"
                    style={{ width: '100%' }}
                    value={data.symbol}
                    onChange={(e) => {
                      setData({ ...data, [e.target.name]: e.target.value })
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
                <button className="signal_form_btn">set signal</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignalForm
