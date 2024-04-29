import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/css/auth.css'

const Auth = () => {
  const [isregistering, setIsRegistering] = useState(false)
  return (
    <div>
      <div className="authentification">
        <div className="auth_wrapper">
          <div className="auth_top">
            <div className="auth_inner_wrapper">
              <Link to="/" className="back_to_home_link">
                <h1 className="auth_title">FAPHY</h1>
              </Link>
              <h3 className="auth_info">Log in to your FAPHY accout</h3>
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
                  <form className="auth_login_form">
                    <div className="auth_form_group">
                      <input type="email" placeholder="Enter Email" />
                    </div>
                    <div className="auth_form_group">
                      <input type="password" placeholder="Enter Password" />
                    </div>
                    <button className="auth_login_btn">Log in</button>
                  </form>
                </div>
                <div
                  className={
                    isregistering
                      ? 'auth_wrap_box'
                      : 'auth_wrap_box hide_authbox'
                  }
                >
                  <form className="auth_login_form">
                    <div className="auth_form_group">
                      <input type="email" placeholder="Enter Email" />
                    </div>
                    <div className="auth_form_group">
                      <input type="password" placeholder="Enter Password" />
                    </div>
                    <div className="auth_form_group">
                      <input type="password" placeholder="Confirm Password" />
                    </div>
                    <button className="auth_login_btn">Sign Up</button>
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
                  {isregistering ? 'register' : 'login'}
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
