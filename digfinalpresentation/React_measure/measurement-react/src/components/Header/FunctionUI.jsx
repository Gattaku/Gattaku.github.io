import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FunctionUI = () => {
  return (
    <div className='function-icon'>
        <div className="setting">
            <SettingsIcon />
        </div>
        <div className="information">
            <HelpOutlineIcon />
        </div>
    </div>
  )
}

export default FunctionUI