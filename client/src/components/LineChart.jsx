import React, { useRef, useEffect } from 'react'
import Chart from 'chart.js/auto'

const LineChart = ({ data, labels, title }) => {
  const canvasRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      var gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, 'rgba(75, 192, 192, 1)')
      gradient.addColorStop(0.8, 'rgba(75, 192, 192, 0)')

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        chartInstance.current = new Chart(ctx, {
          data: {
            labels: labels,
            datasets: [
              {
                type: 'line',
                label: title[0],
                data: data[0],
                borderColor: [
                  'rgba(75, 192, 192)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
                backgroundColor: gradient,
                fill: true,
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.1,
              },
              {
                type: 'line',
                label: title[1],
                data: data[1],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
                backgroundColor: gradient,
                fill: false,
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                grid: {
                  display: true,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                beginAtZero: false,
              },
            },
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: true,
                align: 'end',
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, labels, title])

  return <canvas className="dashlnchart" ref={canvasRef} />
}

export default LineChart
