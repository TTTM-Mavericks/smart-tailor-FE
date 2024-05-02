
import React, { useEffect, useState } from 'react'
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'
import styles from './CustomDesign.module.scss';
// import { SRGBToLinear } from 'three';
import ImageDraggableComponent from '../../components/Draggable/ImageDraggableComponent';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, SLEEVE_CLOTH_PART } from '../../models/ClothModel';
import { downloadCanvasToImage, reader } from '../../utils/DesignerUtils';
import { DecalTypes, EditorTabs } from '../../config/TabSetting';
import state from '../../store';
import { ColorPicker, FilePicker, Tab } from '../../components';
import { AnimatePresence, motion } from "framer-motion";
import { slideAnimation } from '../../config/MotionSetting';
import HeaderComponent from '../../components/Header/HeaderComponent';



interface PartOfCloth {
  partValue: string;
  imgUrl: string;
};

const partOfClothData: PartOfCloth[] = [
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
]

function CustomDesignScreen() {

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfCloth | undefined>();
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
  }

  const _handleSetselectedItem = (item: PartOfCloth) => {
    setSelectedPartOfCloth(item)
    const result: PartOfCloth | undefined = partOfClothData.find((itemFounded: PartOfCloth) => itemFounded.partValue === item.partValue)
    if (result) {
      setSelectedItem(result.partValue)
    }
  }

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
      <HeaderComponent></HeaderComponent>
      <div className={styles.customDesign__container__editorArea}>
        <motion.div
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
        </motion.div>
        {selectedPartOfCloth ? (
          <>
            <ImageDraggableComponent partOfCloth={selectedPartOfCloth} selectedItem={selectedItem}></ImageDraggableComponent>
            <div style={{ position: 'absolute', right: 0 }}>

            </div>
          </>
        ) : (
          <ImageDraggableComponent></ImageDraggableComponent>

        )}
        <div className={styles.customDesign__container__editorArea__partOfCloth}>
          {partOfClothData.map((item: PartOfCloth, key: any) => (
            <div key={key} className={styles.partOfClothSellector} style={{ backgroundColor: selectedItem === item.partValue ? 'red' : 'black' }} onClick={() => _handleSetselectedItem(item)}>
              <img src={item.imgUrl} className={styles.partOfClothSellector__img}></img>
            </div>
          ))}


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