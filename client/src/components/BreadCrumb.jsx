import React, { useEffect, useState } from 'react'
import '../styles/css/breadcrumb.css'
import { ReactComponent as Caret } from '../assets/svg/caret.svg'
import symbolsjson from '../data/symbols.json'
import api from '../api/axios'

const BreadCrumb = () => {
  const [symbols, setSymbols] = useState(symbolsjson)
  function updateSymbols(init, newdata) {
    let update = newdata.map((b) => {
      let match = init.find((t) => t.symbol === b.symbol)
      if (match) {
        return {
          ...b,
          price: match.close,
          high: match.high,
          low: match.low,
          open: match.open,
          volume: match.volume,
          prediction: match.prediction,
        }
      }
      return b
    })

    return update
  }
  useEffect(() => {
    const fetchPredictions = async () => {
      const smbols = symbols.map((i) => {
        return i.symbol
      })
      let currentDate = new Date()
      let currentDay = currentDate.toISOString().split('T')[0]
      let sevenDaysAgo = new Date(currentDate)
      sevenDaysAgo.setDate(currentDate.getDate() - 7)
      let sevenDaysAgoFormatted = sevenDaysAgo.toISOString().split('T')[0]
      const res = await api('POST', 'get-last-close-and-predictions', {
        symbol: smbols,
        start_date: sevenDaysAgoFormatted,
        end_date: currentDay,
      })
      if (res.status === 200) {
        const newupdates = updateSymbols(res.data.last_rows, symbols)
        setSymbols(newupdates)
      }
    }
    fetchPredictions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <div className="breadcrumb">
        <div className="container breadcrumb_warapper">
          <div className="breadcrumb_content">
            <ul className="breadcrumb_unlist">
              {Array.isArray(symbols) &&
                symbols.map((symbol) => {
                  return (
                    <li className="breadcrumb_list_item" key={symbol.symbol}>
                      {symbol.price ? (
                        <span className="breadcrumb_texts">
                          {`${symbol.symbol} ${parseFloat(symbol.open).toFixed(
                            2
                          )} (${(
                            parseFloat(symbol.open) - parseFloat(symbol.price)
                          ).toFixed(2)}`}
                          {symbol.prediction ? (
                            <Caret
                              className="breadcrumb_caret_ic"
                              style={
                                (
                                  parseFloat(symbol.open) -
                                  parseFloat(symbol.price)
                                ).toFixed(2) < 0
                                  ? {
                                      fill: 'red',
                                      transform: 'rotate(180deg)',
                                      marginBottom: '-4px',
                                    }
                                  : {}
                              }
                            />
                          ) : null}
                          {`) Prediction: ${
                            symbol.prediction === 'UP' ? 'BUY' : 'SELL'
                          }`}
                        </span>
                      ) : (
                        <span className="breadcrumb_texts">{`${symbol.symbol}`}</span>
                      )}
                    </li>
                  )
                })}
            </ul>
            <ul className="breadcrumb_unlist  breadcrumb_unlist_secondary">
              {Array.isArray(symbols) &&
                symbols.map((symbol) => {
                  return (
                    <li className="breadcrumb_list_item" key={symbol.symbol}>
                      {symbol.price ? (
                        <span className="breadcrumb_texts">
                          {`${symbol.symbol} ${parseFloat(symbol.open).toFixed(
                            2
                          )} (${(
                            parseFloat(symbol.open) - parseFloat(symbol.price)
                          ).toFixed(2)}`}
                          {symbol.prediction ? (
                            <Caret
                              className="breadcrumb_caret_ic"
                              style={
                                (
                                  parseFloat(symbol.open) -
                                  parseFloat(symbol.price)
                                ).toFixed(2) < 0
                                  ? {
                                      fill: 'red',
                                      transform: 'rotate(180deg)',
                                      marginBottom: '-4px',
                                    }
                                  : {}
                              }
                            />
                          ) : null}
                          {`) Prediction: ${
                            symbol.prediction === 'UP' ? 'BUY' : 'SELL'
                          }`}
                        </span>
                      ) : (
                        <span className="breadcrumb_texts">{`${symbol.symbol}`}</span>
                      )}
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreadCrumb
