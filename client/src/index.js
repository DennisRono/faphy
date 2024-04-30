import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/css/globals.css'
import { Provider } from 'react-redux'
import { persistor, store } from './state/store'
import { PersistGate } from 'redux-persist/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
