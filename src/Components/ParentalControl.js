import React from "react"
import { ReactComponent as ParentOn } from '../assets/parent_on.svg';
import { ReactComponent as ParentOff } from '../assets/parent_off.svg';

const Filter = ({ handleCheckBox, parentalControl = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 360, paddingTop: 80 }}>
      {parentalControl ? <ParentOn onClick={handleCheckBox} height={200} style={{ cursor: 'pointer' }} /> :
        <ParentOff onClick={handleCheckBox} height={200} style={{ cursor: 'pointer' }} />}
    </div>
  )
}
export default Filter