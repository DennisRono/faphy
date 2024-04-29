import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Landing from '../components/Landing'
import BreadCrumb from '../components/BreadCrumb'
import UserPage from '../components/UserPage'

const Home = () => {
  return (
    <div>
      <div className="home">
        <Header />
        <BreadCrumb />
        <UserPage />
        <Landing />
        <Footer />
      </div>
    </div>
  )
}

export default Home
