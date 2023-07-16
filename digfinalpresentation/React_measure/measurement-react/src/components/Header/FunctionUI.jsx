import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { changeSetting } from '../../Redux/features/ControllerSlice';

const FunctionUI = () => {

  const dispatch = useDispatch();
  const {settingPage} = useSelector((state)=>state.controller);

  const handleSettingClick = () => {
    dispatch(changeSetting());
  }


  return (
    <div className='function-icon' onClick={()=> handleSettingClick()}>
        <div className="setting">
            {
              settingPage ? <ExitToAppIcon /> : <SettingsIcon />
            }            
        </div>
        <div className="information">
            <HelpOutlineIcon />
        </div>
    </div>
  )
}

export default FunctionUI