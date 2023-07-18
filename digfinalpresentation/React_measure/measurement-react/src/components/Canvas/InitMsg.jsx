import React from 'react'
import { useSelector } from 'react-redux'

const InitMsg = () => {

    const {imgSrc} = useSelector((state)=> state.initialSetting);



  return (
    <>
        {imgSrc ? 
        <div>
        </div>
        :
        <div className='initial-text'>
            画像をドラッグする or
            ペーストしてください。
        </div>  
        }
    </>
  )
}

export default InitMsg