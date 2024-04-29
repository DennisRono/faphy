const backend = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:5000/'
  } else {
    return process.env.REACT_APP_BACKEND_URL
  }
}

export default backend
