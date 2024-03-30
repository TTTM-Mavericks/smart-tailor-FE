import CustomButton from '../CustomButton/CustomButton'
import styles from './FilePicker.module.scss'

const FilePicker = ({ file, setFile, readFile }) => {
  return (
    <div className={styles.filePickerContainer}>
      <div className={styles.filePickerContainer__box}>
        <input 
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
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
          type="outline"
          title="Logo"
          handleClick={() => readFile('logo')}
          customStyles="font-size: 0.75rem; line-height: 1rem;"
        />
        <CustomButton 
          type="filled"
          title="Full"
          handleClick={() => readFile('full')}
          customStyles="font-size: 0.75rem; line-height: 1rem;"
        />
      </div>
    </div>
  )
}

export default FilePicker