import { useState } from 'react'
import CustomButton from '../CustomButton/CustomButton'
import styles from './FilePicker.module.scss'
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, SLEEVE_CLOTH_PART } from '../../models/ClothModel'
import { primaryColor } from '../../root/ColorSystem'

const FilePicker = ({ file, setFile, readFile, partOfCloth }) => {
  const [trigger, setTrigger] = useState(false);

  const _handleSetUploadFile = () => {
    console.log(partOfCloth);
    if (partOfCloth === LOGO_PART) {
      readFile('logo');
    }

    if (partOfCloth === FRONT_CLOTH_PART) {
      readFile('front');
    }

    if (partOfCloth === BACK_CLOTH_PART) {
      readFile('back');
    }

    if (partOfCloth === SLEEVE_CLOTH_PART) {
      readFile('sleeve');
    }


  }

  return (
    <div className={styles.filePickerContainer}>
      <div className={styles.filePickerContainer__box}>
        <input
          id="file-upload"
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => { setFile(e.target.files[0]); setTrigger(true) }}
        />
        <label htmlFor="file-upload" className={styles.filePickerContainer__box__label}>
          Upload File
        </label>

        <p className={styles.filePickerContainer__box__text}>
          {file === '' ? "No file selected" : file?.name}
        </p>
      </div>

      <div className={styles.filePickerContainer__button}>
        <CustomButton
          type="filled"
          title="Upload"
          handleClick={() => _handleSetUploadFile()}
          customStyles={`font-size: 0.75rem; line-height: 1rem; background-color: ${primaryColor}`}
        />
      </div>
    </div>
  )
}

export default FilePicker