import React from 'react'
import styles from './CustomButton.module.scss'
import { primaryColor, whiteColor } from '../../root/ColorSystem'
import { borderRadius } from '@mui/system'

const CustomButton = ({ type, title, customStyles, handleClick }) => {

  const generateStyle = (type) => {
    if(type === 'filled') {
      return {
        backgroundColor: primaryColor,
        color: whiteColor,
        borderRadius: '5px'
      }
    } else if(type === "outline") {
      return {
        borderWidth: '1px',
        borderColor:  "black",
        color: "white",
        borderRadius: '8px'
      }
    }
  }

  return (
    <button
      className={`${styles.customButton} ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton