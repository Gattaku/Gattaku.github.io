import React from 'react'
import axisImage from "../../assets/images/axis_image.png";

const Axis = () => {
  return (
    <div className='axis-content'>
      <div className="axis-name">
          Axis
      </div>
      <div className="axis-image">
        <img className='axis-image-data' src={axisImage} alt="#" />
      </div>
    </div>
  )
}

export default Axis