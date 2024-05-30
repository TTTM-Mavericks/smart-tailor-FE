import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import { EditorTabs, FilterTabs, DecalTypes } from "../../../config/TabSetting"
import { download } from "../../../assets"
import { __downloadCanvasToImage, reader, urlToBase64 } from "../../../utils/DesignerUtils"
import { fadeAnimation, slideAnimation } from "../../../config/MotionSetting";
import { ColorPicker, FilePicker, CustomButton, Tab } from "../../../components";
import state from "../../../store"
import styles from './Designer.module.scss'

const Designer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('')
  const [generateImg, setGenerateImg] = useState<string>('')
  const [activeEditorTab, setActiveEditorTab] = useState<string>('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: false,
    stylishShirt: false
  })

  useEffect(()=>{
    console.log('file', file);
  },[file])

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />
      case "download":
        __downloadCanvasToImage();
      default:
        return null
    }
  }

  const handleDecals = (type, result) => {
    console.log('result: ', result);
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;
    state.imageLogoUrl = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const handleGenerateImage = async (type) => {
    alert("This feature is disabled for now. Please try again later.")

    //cors problem in openai server side not backend server side, dont blame to backend server. thanks

    // if(!prompt) return alert("Please enter a prompt");

    // try {
    //   setGenerateImg(true);

    //   const response = await fetch('https://node-js-ai-api.vercel.app/ai/image-generator', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       prompt,
    //     })
    //   })

    //   const data = await response.json();
    //   const result = urlToBase64(data.image.data[0].url, (base64) => base64);
    // 
      
    //   // handleDecals(type, `data:image/png;base64,${result}`)
    // } catch (error) {
    //   alert(error)
    // } finally {
    //   setGenerateImg(false);
    //   setActiveEditorTab("");
    // }
  }

  return (
    <AnimatePresence>
      {snap.intro && (
        <>
          {/* <motion.div
            key="custom"
            className={styles.container}
            {...slideAnimation('left')}
          >
            <div className={styles.container__options}>
              <div className={styles.container__options__editorTab}>
                {EditorTabs.map((tab, index) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => { setActiveEditorTab(tab.name) }}
                  >

                  </Tab>
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div> */}

          {/* <motion.div
            className={styles.customButtonContainer}
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Image Editor"
              handleClick={() => state.intro = false}
              customStyles={styles.customButtonContainer__switchScreenButton}
            />
          </motion.div> */}

          <motion.div className={styles.filterTabContainer} {...slideAnimation('up')}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              >

              </Tab>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Designer;