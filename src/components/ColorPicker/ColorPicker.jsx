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
      />
    </div>
  )
}

export default ColorPicker