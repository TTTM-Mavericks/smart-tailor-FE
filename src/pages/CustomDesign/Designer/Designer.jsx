import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import { EditorTabs, FilterTabs, DecalTypes } from "../../../config/TabSetting"
import { download } from "../../../assets"
import { __downloadCanvasToImage, reader, __urlToBase64 } from "../../../utils/DesignerUtils"
import { fadeAnimation, slideAnimation } from "../../../config/MotionSetting";
// import { ColorPicker, FilePicker, CustomButton, Tab } from "../../../components";
import styles from './Designer.module.scss'
import state from "../../../store";
import { ColorPicker, FilePicker, Tab } from "../../../components";

const Designer = ({ onclickFn }) => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('')
  const [generateImg, setGenerateImg] = useState('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: false,
    stylishShirt: false
  })


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
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;
    state.imageLogoUrl = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
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
    //   const result = __urlToBase64(data.image.data[0].url, (base64) => base64);
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
            <button onClick={onclickFn} style={{ position: 'absolute', right: 10, border: `1px solid gray`, fontSize: 12 }} className=' py-1 px-2 rounded inline-flex items-center flex justify-center'>
              View 3D
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Designer;