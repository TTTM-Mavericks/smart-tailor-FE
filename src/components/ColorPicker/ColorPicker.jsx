import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'
import styles from './ColorPicker.module.scss'
import state from '../../store';
import { useEffect, useState } from 'react';


const ColorPicker = ({ colorDefault }) => {
  const snap = useSnapshot(state);
  const [color, setColor] = useState();

  useEffect(()=> {
    console.log('colorDefault: ', colorDefault);
    setColor(colorDefault);
  },[colorDefault])

  useEffect(() => {
    state.color = color
    console.log(color);
  }, [color])

  return (
    <div className={styles.colorPicker}>
      <SketchPicker
        color={color}
        disableAlpha
        onChange={(color) => setColor(color.hex)}
        styles={{
          default: {
            picker: {
              width: '18em', // Set the width as desired
              height: '25em', // Set the height as desired
              boxShadow: 'none',
              color: 'black'
            }
          }
        }}

      />
    </div>
  )
}

export default ColorPicker