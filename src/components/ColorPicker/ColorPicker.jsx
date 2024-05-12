import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'
import styles from './ColorPicker.module.scss'

import state from '../../store';

const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className={styles.colorPicker}>
      <SketchPicker
        color={snap.color}
        disableAlpha
        onChange={(color) => state.color = color.hex}
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