import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/css/header.css'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { setIsLogged } from '../state/actions/loggedAction.js'

const Header = () => {
  const islogged = useSelector((state) => state.logged)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setIsLogged(false))
    Cookies.remove('_faphy')
  }
  return (
    <div>
      <div className="header">
        <div className="container header_wrapper">
          <div className="header_left">
            <h1 title="stock portfolio recomendation">FAPHY</h1>
          </div>
          <div className="header_right">
            <Link to="/about">About</Link>
            {islogged ? (
              <button
                className="login_header_btn"
                onClick={() => {
                  handleLogout()
                }}
              >
                logout
              </button>
            ) : (
              <Link className="login_header_btn" to="/auth">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
