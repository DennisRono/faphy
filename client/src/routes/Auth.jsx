import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/css/auth.css'
import api from '../api/axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { setIsLogged } from '../state/actions/loggedAction.js'

const Auth = () => {
  const [isregistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    email: '',
    password: '',
    cpassword: '',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await api('POST', 'login', data)
    setLoading(false)
    if (res.status === 200) {
      toast('Login Successful!', { type: 'success' })
      dispatch(setIsLogged(true))
      Cookies.set(
        '_faphy',
        JSON.stringify({ token: res.data.access_token, email: res.data.email }),
        { expires: 7 }
      )
      navigate('/')
    } else {
      toast(res.data.message, { type: 'error' })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await api('POST', 'register', data)
    setLoading(false)
    if (res.status === 200) {
      toast('Registration Successful!', { type: 'success' })
    } else {
      toast(res.data.message, { type: 'error' })
    }
  }
  return (
    <div>
      <div className="authentification">
        <div className="auth_wrapper">
          <div className="auth_top">
            <div className="auth_inner_wrapper">
              <Link to="/" className="back_to_home_link">
                <h1 className="auth_title">OPTIWEALTH</h1>
              </Link>
              <h3 className="auth_info">Log in to your OPTIWEALTH accout</h3>
              <p className="auth_p_info">
                By logging in, you agree with our policies
              </p>
              <div className="authentication_forms">
                <div
                  className={
                    isregistering
                      ? 'auth_wrap_box hide_authbox'
                      : 'auth_wrap_box'
                  }
                >
                  <form
                    className="auth_login_form"
                    onSubmit={(e) => {
                      handleLogin(e)
                    }}
                  >
                    <div className="auth_form_group">
                      <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, [e.target.name]: e.target.value })
                        }}
                      />
                    </div>
                    <div className="auth_form_group">
                      <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={data.password}
                        onChange={(e) => {
                          setData({ ...data, [e.target.name]: e.target.value })
                        }}
                      />
                    </div>
                    <button className="auth_login_btn">
                      {loading ? (
                        <div className="dot-flashing"></div>
                      ) : (
                        'Log in'
                      )}
                    </button>
                  </form>
                </div>
                <div
                  className={
                    isregistering
                      ? 'auth_wrap_box'
                      : 'auth_wrap_box hide_authbox'
                  }
                >
                  <form
                    className="auth_login_form"
                    onSubmit={(e) => {
                      handleRegister(e)
                    }}
                  >
                    <div className="auth_form_group">
                      <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, [e.target.name]: e.target.value })
                        }}
                      />
                    </div>
                    <div className="auth_form_group">
                      <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={data.password}
                        onChange={(e) => {
                          setData({ ...data, [e.target.name]: e.target.value })
                        }}
                      />
                    </div>
                    <div className="auth_form_group">
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        name="cpassword"
                        value={data.cpassword}
                        onChange={(e) => {
                          setData({ ...data, [e.target.name]: e.target.value })
                        }}
                      />
                    </div>
                    <button className="auth_login_btn">
                      {loading ? (
                        <div className="dot-flashing"></div>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </form>
                </div>
              </div>
              <div className="auth_additional_meta">
                <span>Forgot your password?</span>
                <br />
                <br />
                <span
                  onClick={() => {
                    setIsRegistering(!isregistering)
                  }}
                >
                  {isregistering ? 'login' : 'register'}
                </span>
              </div>
            </div>
          </div>
          <div className="auth_bottom"></div>
        </div>
      </div>
    </div>
  )
}

export default Auth
