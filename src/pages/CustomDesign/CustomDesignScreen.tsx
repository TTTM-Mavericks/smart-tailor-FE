
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

import { HiOutlineDownload, HiShoppingCart, HiOutlineLogin } from 'react-icons/hi';
import { FaSave, FaTshirt, FaPen, FaIcons, FaRegHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { primaryColor, whiteColor } from '../../root/ColorSystem';
import { height } from '@mui/system';




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

const currentItem = [
  {
    id: 1,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 2,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 3,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 4,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 5,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 6,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 7,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 8,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  }
]

const collectionItem = [
  {
    id: 1,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 2,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 3,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 4,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 5,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 6,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 7,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  },
  {
    id: 8,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',
    isLiked: false
  }
]

function CustomDesignScreen() {

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfCloth>({
    partValue: '',
    imgUrl: ''
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [file, setFile] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
  const [codeLanguage, setCodeLanguage] = useState('EN');
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isCollectionTab, setIsColectionTab] = useState(false);





  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  // ---------------UseEffect---------------//

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);

  }, [selectedLanguage, i18n]);

  useEffect(() => {
    if (selectedLanguage) {
      const uppercase = selectedLanguage.toUpperCase();
      setCodeLanguage(uppercase)
    }

  }, [selectedLanguage]);

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

  const __handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const __generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={__handleReadFile} partOfCloth={selectedItem} />
      case "download":
        downloadCanvasToImage();
      default:
        return null
    }
  };

  const __handleSetSelectedItem = (item: PartOfCloth) => {

    setSelectedPartOfCloth(item);
    const result: PartOfCloth | undefined = partOfClothData.find((itemFounded: PartOfCloth) => itemFounded.partValue === item.partValue)
    if (result) {
      setSelectedItem(result.partValue);
    }
  };

  // Define a type for the keys of DecalTypes
  type DecalTypeKey = keyof typeof DecalTypes;

  // Now you can use DecalTypeKey as the type for the `type` parameter
  const __handleDecals = (type: DecalTypeKey, result: any) => {
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


  const __handleReadFile = (type: any) => {
    reader(file)
      .then((result) => {
        __handleDecals(type, result);
      })
  }

  const __handleSelectedEditorMode = (isSelected: boolean) => {
    setIsEditorMode(!isSelected);
  }

  const __handleSelectedCollectionTab = (isSelected: boolean) => {
    setIsColectionTab(!isSelected);
  }




  return (
    <div className={styles.customDesign__container}>

      <div className={styles.customDesign__container__header}>
        <div className={styles.customDesign__container__header__logo}>
          <img src={systemLogo}></img>
          <div>
            <h3>{t(codeLanguage + '000001')}</h3>
          </div>
        </div>

        <div className={styles.customDesign__container__header__buttonGroup}>
          <button className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__downloadBtn} `}>
            <HiOutlineDownload size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></HiOutlineDownload>
            <span>{t(codeLanguage + '000104')}</span>
          </button>

          <button className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__saveBtn} `}>
            <FaSave size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaSave>
            <span>{t(codeLanguage + '000105')}</span>
          </button>

          <button className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__orderBtn} `}>
            <HiShoppingCart size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.orderIcon}></HiShoppingCart>
            <span>{t(codeLanguage + '000106')}</span>
          </button>

          <button className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__signInBtn} `}>
            <HiOutlineLogin size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.signInIcon}></HiOutlineLogin>
            <span>{t(codeLanguage + '000107')}</span>
          </button>

        </div>

      </div>

      <div className={styles.customDesign__container__editorArea}>



        {/* Part of cloth of Model */}
        <div className={styles.customDesign__container__editorArea__partOfCloth}>
          {partOfClothData.map((item: PartOfCloth, key: any) => (
            <div key={key} className={styles.partOfClothSellector} style={{ backgroundColor: selectedItem === item.partValue ? 'red' : 'black' }} onClick={() => __handleSetSelectedItem(item)}>
              <img src={systemLogo} className={styles.partOfClothSellector__img}></img>
            </div>
          ))}
        </div>

        {/* Monitor of editor area */}
        <div className={`${styles.customDesign__container__editorArea__display} `}>

          {/* Menu Bar of editor area */}
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

        {/* Iteam selector area */}
        <div className={styles.customDesign__container__editorArea__itemSelector}>

          {/* Button group of item selected */}
          <div className={styles.customDesign__container__editorArea__itemSelector__buttonGroup}>
            <button
              className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__editorArea__itemSelector__buttonGroup__sampleModelBtn} `}
              onClick={() => __handleSelectedEditorMode(true)}
              style={!isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaTshirt size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></FaTshirt>
              <span>{t(codeLanguage + '000108')}</span>
            </button>

            <button
              className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__editorArea__itemSelector__buttonGroup__editorModelBtn} `}
              onClick={() => __handleSelectedEditorMode(false)}
              style={isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaPen size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaPen>
              <span>{t(codeLanguage + '000109')}</span>
            </button>

          </div>

          {/* Display item selector */}
          {isEditorMode && (
            <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup}>
              <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuEditor}>
                <button className=" rounded inline-flex items-center">
                  <FaIcons size={20} className={`${styles.menuEditor__icon}`}></FaIcons>
                </button>

                <div
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
                </div>
              </div>

              {/* Menu bar tab colection */}
              <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuTabBar}>
                <button
                  className=" text-white font-bold py-2 px-4 rounded"
                  onClick={() => __handleSelectedCollectionTab(true)}
                  style={!isCollectionTab ? { color: primaryColor, borderBottom: `2px solid ${primaryColor}` } : {}}
                >
                  {t(codeLanguage + '000110')}
                </button>
                <button
                  className=" text-white font-bold py-2 px-4 rounded"
                  onClick={() => __handleSelectedCollectionTab(false)}
                  style={isCollectionTab ? { color: primaryColor, borderBottom: `2px solid ${primaryColor}` } : {}}
                >
                  {t(codeLanguage + '000111')}
                </button>
              </div>

              {/* Sample Item list area */}
              {!isCollectionTab ? (
                <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}>
                  {currentItem.map((item: any, key) => (
                    <div key={item.id} className={styles.sampleItemCard}>
                      <img src={item.imgUrl} style={{ width: '90%', height: '90%' }}></img>
                      <button>
                        <FaRegHeart size={20} className={styles.sampleItemCard__icon}></FaRegHeart>
                      </button>
                    </div>
                  ))}
                </div>
              )
                : (
                  <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}>
                    {collectionItem.map((item: any) => (
                      <div key={item.id} className={styles.sampleItemCard}>
                        <img src={item.imgUrl} style={{ width: '90%', height: '90%' }}></img>
                        <button>
                          <FaRegHeart size={20} className={styles.sampleItemCard__icon}></FaRegHeart>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          )}
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