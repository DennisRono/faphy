import axios from 'axios'
import backend from './backend'

const api = async (method = 'GET', slug, data = {}, headers = {}) => {
  try {
    const config = {
      method: method,
      maxBodyLength: Infinity,
      url: backend() + slug,
      headers: {
        ...headers,
        'Access-Control-Allow-Origin': '*',
      },
      data: data,
    }

    const res = await axios(config)
    return res
  } catch (error) {
    console.log(error)
    return { ...error.response, status: error.response?.status || 400 }
  }
}

export default api
