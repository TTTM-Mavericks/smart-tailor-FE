import React from 'react'
import styles from './CustomButton.module.scss'

const CustomButton = ({ type, title, customStyles, handleClick }) => {

  const generateStyle = (type) => {
    if(type === 'filled') {
      return {
        backgroundColor: "white",
        color: "black"
      }
    } else if(type === "outline") {
      return {
        borderWidth: '1px',
        borderColor:  "black",
        color: "white"
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