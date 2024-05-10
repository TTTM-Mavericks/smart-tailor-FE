
import React, { useEffect, useState } from 'react'
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'
import styles from './CustomDesign.module.scss';
// import { SRGBToLinear } from 'three';
import ImageDraggableComponent from '../../components/Draggable/ImageDraggableComponent';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, PartOfCloth, SLEEVE_CLOTH_PART } from '../../models/ClothModel';
import { downloadCanvasToImage, reader } from '../../utils/DesignerUtils';
import { DecalTypes, EditorTabs } from '../../config/TabSetting';
import state from '../../store';
import { ColorPicker, FilePicker, Tab } from '../../components';
import { AnimatePresence, motion } from "framer-motion";
import { slideAnimation } from '../../config/MotionSetting';
import HeaderComponent from '../../components/Header/HeaderComponent';
import { systemLogo } from '../../assets';



const partOfClothData = [
  {
    partValue: LOGO_PART,
    imgUrl: '../../assets/img/landing-img/wave.jpg'
  },
  {
    partValue: FRONT_CLOTH_PART,
    imgUrl: '../../assets/img/landing-img/slider-bird1.jpg'
  },
  {
    partValue: BACK_CLOTH_PART,
    imgUrl: '../../assets/img/landing-img/slider-bird3.jpg'
  },
  {
    partValue: SLEEVE_CLOTH_PART,
    imgUrl: '../../assets/img/landing-img/wave.jpg'
  }
];

function CustomDesignScreen() {

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfCloth>({
    partValue: '',
    imgUrl: ''
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [file, setFile] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('')


  // ---------------Usable Variable---------------//
  // ---------------UseEffect---------------//
  useEffect(() => {
    setSelectedPartOfCloth(selectedPartOfCloth)
  }, [setSelectedPartOfCloth]);

  useEffect(() => {
    setSelectedItem(selectedItem)
  }, [selectedItem]);

  useEffect(() => {
    console.log('activeEditorTab: ', activeEditorTab);
  }, [activeEditorTab])
  // ---------------FunctionHandler---------------//

  const __generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={_handleReadFile} partOfCloth={selectedItem} />
      case "download":
        downloadCanvasToImage();
      default:
        return null
    }
  };

  const handleSetSelectedItem = (item: PartOfCloth) => {

    setSelectedPartOfCloth(item);
    const result: PartOfCloth | undefined = partOfClothData.find((itemFounded: PartOfCloth) => itemFounded.partValue === item.partValue)
    if (result) {
      setSelectedItem(result.partValue);
    }
  };

  // Define a type for the keys of DecalTypes
  type DecalTypeKey = keyof typeof DecalTypes;

  // Now you can use DecalTypeKey as the type for the `type` parameter
  const _handleDecals = (type: DecalTypeKey, result: any) => {
    console.log('result: ', result);
    const decalType = DecalTypes[type];
    console.log('aaaaaaaaaaaaaaaaaaa: ', result);




    if (selectedItem === LOGO_PART) {
      state.imageLogoUrl = result;
      state.isLogoTexture = true;
      state.logoDecal = result;
    }

    if (selectedItem === FRONT_CLOTH_PART) {
      state.imageFrontClothUrl = result;
      state.isFrontClothTexture = true;
      state.frontClothDecal = result

    }

    if (selectedItem === BACK_CLOTH_PART) {
      state.imageBackClothUrl = result;
      state.isBackClothTexture = true;
      state.backClothDecal = result

    }

    if (selectedItem === SLEEVE_CLOTH_PART) {
      state.imagesleeveClothUrl = result;
      state.isSleeveClothTexture = true;
      state.sleeveClothDecal = result

    }


  }


  const _handleReadFile = (type: any) => {
    reader(file)
      .then((result) => {
        _handleDecals(type, result);
      })
  }




  return (
    <div className={styles.customDesign__container}>

      <div className={styles.customDesign__container__header}>
        <div className={styles.customDesign__container__header__logo}>
          <img src={systemLogo}></img>
          <div>
            <h3>Smart Tailor</h3>
          </div>
        </div>

        <div className={styles.customDesign__container__header__buttonGroup}>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Download</span>
          </button>

          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Save design</span>
          </button>

          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Order</span>
          </button>

          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Sign in</span>
          </button>


        </div>

      </div>

      <div className={styles.customDesign__container__editorArea}>
        {/* <motion.div
          key="custom"
          className={styles.customDesign__container__editorArea__menu}

          {...slideAnimation('left')}
        >
          {__generateTabContent()}

          <div className={styles.customDesign__container__editorArea__menu__tab}>
            {EditorTabs.map((tab: any, index: any) => (
              <Tab
                isActiveTab={true}
                isFilterTab={true}
                key={tab.name}
                tab={tab}
                handleClick={() => { setActiveEditorTab(tab.name) }}
              >

              </Tab>
            ))}

          </div>
        </motion.div> */}

        

        <div className={styles.customDesign__container__editorArea__partOfCloth}>
          {partOfClothData.map((item: PartOfCloth, key: any) => (
            <div key={key} className={styles.partOfClothSellector} style={{ backgroundColor: selectedItem === item.partValue ? 'red' : 'black' }} onClick={() => handleSetSelectedItem(item)}>
              <img src={systemLogo} className={styles.partOfClothSellector__img}></img>
            </div>
          ))}


        </div>

        

        <div className={`${styles.customDesign__container__editorArea__display} `}>

          <div className={styles.customDesign__container__editorArea__display__menuBar} >


          </div>

          {selectedPartOfCloth ? (
            <div className={styles.customDesign__container__editorArea__display__displayDesign} >
              <ImageDraggableComponent partOfCloth={selectedPartOfCloth} selectedItem={selectedItem}></ImageDraggableComponent>

            </div>
          ) : (
            <ImageDraggableComponent></ImageDraggableComponent>

          )}
        </div>

        <div className={styles.customDesign__container__editorArea__itemSelector}>

        </div>

      </div>
      <Designer />
      <main className={styles.customDesign__container__canvas}>
        <CanvasModel />
      </main>
      <ImageEditor />
    </div>
  )
}

export default CustomDesignScreen