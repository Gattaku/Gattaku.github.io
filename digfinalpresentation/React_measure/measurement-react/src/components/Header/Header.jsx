import React from 'react'
import Axis from './Axis'
import HeaderText from './HeaderText'
import Operater from './Operater'
import "./CSS/header.css"
import FunctionUI from './FunctionUI'

const Header = () => {
  return (
    <div className='header-container'>
        <div className="axis-container">
            <Axis />
        </div>
        <div className="header-text">
            <HeaderText />
        </div>
        <div className="operate-area">
            <Operater />
        </div>
        <div className="function-area">
            <FunctionUI />
        </div>
        
    </div>
  )
}

export default Header