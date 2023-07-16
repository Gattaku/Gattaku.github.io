import React from 'react'
import Popup from './Popup'

const HeaderText = () => {
  return (
    <div className='header-area'>
      <div className="header-text-content">
        <div className='headerTitle'>
          測定アプリ
        </div>
      </div>
      <div className="popup-area">
        <Popup />
      </div>
    </div>
  )
}

export default HeaderText