import React, { useState } from 'react'
import '../styles/css/dashboard.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LineChart from '../components/LineChart'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  return (
    <div>
      <Header />
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
                </div>
              </div>
              <LineChart
                data={[
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  [2, 5, 3, 5, 7, 2, 5, 8, 9, 5, 4, 7],
                ]}
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
            </div>
            <div className="dash_landing_right"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
