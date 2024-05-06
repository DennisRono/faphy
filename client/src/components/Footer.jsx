import React from 'react'
import '../styles/css/footer.css'

const Footer = () => {
  return (
    <div>
      <div className="footer">
        <div className="container footer_wrapper">
          <p className="footer_info">
            Copyright &copy; {new Date().getFullYear()} | optiwealth
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
