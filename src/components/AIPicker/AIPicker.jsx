import CustomButton from '../CustomButton/CustomButton';
import styles from './AIPicker.module.scss';

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className={styles.container}>
      <textarea 
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className={styles.container__textarea}
      />
      <div className={styles.container__generateButton}>
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="Asking AI..."
            customStyles="font-size: 0.75rem; line-height: 1rem;"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="font-size: 0.75rem; line-height: 1rem;"
            />

            <CustomButton 
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="font-size: 0.75rem; line-height: 1rem;"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIPicker