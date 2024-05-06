import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import dayjs from 'dayjs'

const ChartFinancial = ({ data, loading }) => {
  console.log(data)
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'candle',
          data: data,
        },
      ],
      chart: {
        height: 'auto',
        type: 'candlestick',
      },
      //   title: {
      //     text: 'CandleStick Chart - Category X-axis',
      //     align: 'left',
      //   },
      annotations: {
        xaxis: [
          {
            x: 'Oct 06 14:00',
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#00E396',
              },
              orientation: 'horizontal',
              offsetY: 7,
              //   text: 'Annotation Test',
            },
          },
        ],
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function (val) {
            return dayjs(val).format('MMM DD HH:mm')
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          formatter: function (val) {
            return parseFloat(val).toFixed(2)
          },
        },
      },
      noData: {
        text: loading ? 'Loading...' : 'No Data to show',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined,
        },
      },
    }

    const chart = new ApexCharts(document.querySelector('#chart'), options)
    chart.render()

    // Cleanup
    return () => {
      chart.destroy()
    }
  }, [data])

  return <div id="chart" />
}

export default ChartFinancial
