import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/css/header.css'

const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="container header_wrapper">
          <div className="header_left">
            <h1 title="stock portfolio recomendation">FAPHY</h1>
          </div>
          <div className="header_right">
            <Link to="/about">About</Link>
            <Link className="login_header_btn" to="/auth">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
