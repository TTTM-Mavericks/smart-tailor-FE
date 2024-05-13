
import React, { useEffect, useState } from 'react'
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'
import styles from './CustomDesign.module.scss';
// import { SRGBToLinear } from 'three';
import ImageDraggableComponent from '../../components/Draggable/ImageDraggableComponent';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, PartOfCloth, SLEEVE_CLOTH_PART } from '../../models/ClothModel';
import { __downloadCanvasToImage, reader } from '../../utils/DesignerUtils';
import { DecalTypes } from '../../config/TabSetting';
import state from '../../store';
import { ColorPicker, FilePicker, Tab } from '../../components';
import { frontOfCloth, shirtModel, systemLogo } from '../../assets';

import { HiOutlineDownload, HiShoppingCart, HiOutlineLogin } from 'react-icons/hi';
import { FaSave, FaTshirt, FaPen, FaIcons, FaRegHeart, FaFileCode, FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { blackColor, primaryColor, whiteColor } from '../../root/ColorSystem';
import { IoMdColorPalette } from "react-icons/io";
import { IoText } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import ProductCardDesignComponent from '../../components/Card/ProductCardDesign/ProductCardDesignComponent';
import { TbHomeHeart } from "react-icons/tb";
import ProductDialogComponent from './Components/ProductDialogComponent';




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

  },
  {
    id: 2,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 3,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 4,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 5,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 6,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 7,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 8,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/52574437729-admin/theme/68492970862-xhmp_scrub_bunny_illustration_in_the_style_of_spiritcore_symbo_3097ddb3-58eb-4701-830a-fb2e19663671_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  }
]

const collectionItem = [
  {
    id: 1,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 2,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 3,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 4,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 5,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 6,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 7,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  },
  {
    id: 8,
    imgUrl: 'https://catkissfish-en-prod.oss-ap-southeast-1.aliyuncs.com/admin/theme/77798606438-admin/theme/3298507943-xhmp_a_colorful_graphic_car_with_an_abstract_designsolid_color_c348f443-b784-4c95-951f-db3e416972c8_pixian_ai.png?x-oss-process=image/resize,m_fill,h_600,w_600,color_FFFFFF/format,webp',

  }
]

interface Item {
  id: any;
  imgUrl: string;
}

function CustomDesignScreen() {

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfCloth>({
    partValue: '',
    imgUrl: ''
  });
  const [selectedStamp, setSelectedStamp] = useState<Item>({
    id: '',
    imgUrl: ''
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [file, setFile] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
  const [codeLanguage, setCodeLanguage] = useState('EN');
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isCollectionTab, setIsColectionTab] = useState(false);
  const [toolSelected, setToolSelected] = useState('modelProductTab');
  const [collection, setCollection] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isOpenProductDialog, setIsOpenProductDialog] = useState(false);






  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  // ---------------UseEffect---------------//

  useEffect(() => {
    const getItemFromStorage = localStorage.getItem('collection')
    if (getItemFromStorage) {
      console.log('getItemFromStorage: ', getItemFromStorage);
      const savedCollection = JSON.parse(getItemFromStorage);
      setCollection(savedCollection);
    }
    // localStorage.getItem('collection');

  }, []);

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
  }, [activeEditorTab]);



  // Save collection to local storage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem('collection', JSON.stringify(collection));
  // }, [collection]);
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
        __downloadCanvasToImage();
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

  const __handleSelectEditorMode = (isSelected: boolean) => {
    setIsEditorMode(!isSelected);
    if (!isSelected) {
      setToolSelected('stampsItem');
    } else {
      setToolSelected('modelProductTab');

    }
  }

  const __handleSelectCollectionTab = (isSelected: boolean) => {
    setIsColectionTab(!isSelected);
  }

  const __handleSelectToolDesign = (selectedTool: string) => {
    setToolSelected(selectedTool);
  }

  const __handleAddToCollection = (item: Item) => {
    if (!collection.some((collectionItem) => collectionItem.id === item.id)) {
      const updatedCollection = [...collection, item];
      setCollection(updatedCollection);
      localStorage.setItem('collection', JSON.stringify(updatedCollection));
    }
  };

  const __handleRemoveFromCollection = (itemId: string) => {
    const updatedCollection = collection.filter((collectionItem) => collectionItem.id !== itemId);
    setCollection(updatedCollection);
    localStorage.setItem('collection', JSON.stringify(updatedCollection));
  };

  const __toggleCollectionItem = (item: Item) => {
    const itemId = item.id;
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
      __handleRemoveFromCollection(itemId);
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
      __handleAddToCollection(item);
    }
  };

  const __handleSetSelectedStamp = (item: Item) => {

    setSelectedStamp(item);
    const result: Item | undefined = currentItem.find((itemFounded: Item) => itemFounded.id === item.id)
    if (result) {
      setSelectedStamp(result.id);
    }
  };

  const __handleCloseDialog = () => {
    setIsOpenProductDialog(false); // Close the dialog
  };


  return (
    <div className={styles.customDesign__container}>
      {/* Dialog area */}
      <ProductDialogComponent isOpen={isOpenProductDialog} onClose={() => __handleCloseDialog()} />
      {/* Header */}
      <div className={styles.customDesign__container__header}>
        <div className={styles.customDesign__container__header__logo}>
          <img src={systemLogo}></img>
          <div>
            <h3>{t(codeLanguage + '000001')}</h3>
          </div>
        </div>

        <div className={styles.customDesign__container__header__buttonGroup}>
          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__downloadBtn} `} onClick={() => __downloadCanvasToImage()}>
            <HiOutlineDownload size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></HiOutlineDownload>
            <span>{t(codeLanguage + '000104')}</span>
          </button>

          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__saveBtn} `}>
            <FaSave size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaSave>
            <span>{t(codeLanguage + '000105')}</span>
          </button>

          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__orderBtn} `}>
            <HiShoppingCart size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.orderIcon}></HiShoppingCart>
            <span>{t(codeLanguage + '000106')}</span>
          </button>

          <button onClick={() => window.location.href = '/auth/signin'} className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__signInBtn} `}>
            <HiOutlineLogin size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.signInIcon} ></HiOutlineLogin>
            <span>{t(codeLanguage + '000107')}</span>
          </button>

        </div>

      </div>

      <div className={styles.customDesign__container__editorArea}>



        {/* Part of cloth of Model */}
        <div className={styles.customDesign__container__editorArea__partOfCloth}>
          {partOfClothData.map((item: PartOfCloth, key: any) => (
            <div key={key} className={styles.partOfClothSellector} style={selectedItem === item.partValue ? { border: `2px solid ${primaryColor}` } : {}} onClick={() => __handleSetSelectedItem(item)}>
              <img src={frontOfCloth} className={styles.partOfClothSellector__img}></img>
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
              onClick={() => __handleSelectEditorMode(true)}
              style={!isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaTshirt size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></FaTshirt>
              <span>{t(codeLanguage + '000108')}</span>
            </button>

            <button
              className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__editorArea__itemSelector__buttonGroup__editorModelBtn} `}
              onClick={() => __handleSelectEditorMode(false)}
              style={isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaPen size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaPen>
              <span>{t(codeLanguage + '000109')}</span>
            </button>

          </div>

          {/* Display item selector */}
          {isEditorMode ? (
            <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup}>
              <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuEditor}>
                <button
                  className=" rounded inline-flex items-center border-none"
                  onClick={() => __handleSelectToolDesign('stampsItem')}
                  style={toolSelected === 'stampsItem' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}
                >
                  <FaIcons color={toolSelected === 'stampsItem' ? primaryColor : blackColor} size={20} className={`${styles.menuEditor__icon}`}></FaIcons>
                </button>

                <button
                  className=" rounded inline-flex items-center"
                  onClick={() => __handleSelectToolDesign('colorPicker')}
                  style={toolSelected === 'colorPicker' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}
                >
                  <IoMdColorPalette color={toolSelected === 'colorPicker' ? primaryColor : blackColor} size={25} className={`${styles.menuEditor__icon}`}></IoMdColorPalette>
                </button>

                <button
                  className=" rounded inline-flex items-center"
                  onClick={() => __handleSelectToolDesign('filePicker')}
                  style={toolSelected === 'filePicker' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}

                >
                  <FaFileCode color={toolSelected === 'filePicker' ? primaryColor : blackColor} size={25} className={`${styles.menuEditor__icon}`}></FaFileCode>
                </button>

                <button
                  className=" rounded inline-flex items-center"
                  onClick={() => __handleSelectToolDesign('downloadTool')}
                  style={toolSelected === 'downloadTool' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}

                >
                  <IoText color={toolSelected === 'downloadTool' ? primaryColor : blackColor} size={25} className={`${styles.menuEditor__icon}`}></IoText>
                </button>

                {/* <div
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
                </div> */}
              </div>

              {/* Menu bar tab colection */}
              {toolSelected === 'stampsItem' && (
                <>
                  <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuTabBar}>
                    <button
                      className=" text-white font-bold py-2 px-4 rounded"
                      onClick={() => __handleSelectCollectionTab(true)}
                      style={!isCollectionTab ? { color: primaryColor, borderBottom: `2px solid ${primaryColor}` } : {}}
                    >
                      {t(codeLanguage + '000110')}
                    </button>
                    <button
                      className=" text-white font-bold py-2 px-4 rounded"
                      onClick={() => __handleSelectCollectionTab(false)}
                      style={isCollectionTab ? { color: primaryColor, borderBottom: `2px solid ${primaryColor}` } : {}}
                    >
                      {t(codeLanguage + '000111')}
                    </button>
                  </div>

                  {/* Sample Item list area */}
                  {!isCollectionTab ? (
                    <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}>
                      {currentItem.map((item: any, key) => (
                        <div
                          key={item.id}
                          style={selectedStamp === item.id ? { border: `2px solid ${primaryColor}` } : {}}
                          className={styles.sampleItemCard}

                        >
                          <img src={item.imgUrl} style={{ width: '90%', height: '90%' }} alt="Item" onClick={() => __handleSetSelectedStamp(item)} />
                          <button onClick={() => __toggleCollectionItem(item)}>
                            {collection.some((collectionItem: any) => collectionItem.id === item.id) ? (
                              <FaHeart color='red' size={20} className={styles.sampleItemCard__icon} />
                            ) : (
                              <FaRegHeart size={20} className={styles.sampleItemCard__icon} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                    : (
                      <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleCollectionList}>
                        {collection.map((item: any) => (
                          <div
                            key={item.id}
                            style={selectedStamp === item.id ? { border: `2px solid ${primaryColor}` } : {}}
                            className={styles.sampleItemCard}
                            onClick={() => __handleSetSelectedStamp(item)}
                          >
                            <img src={item.imgUrl} style={{ width: '90%', height: '90%' }} onClick={() => __handleSetSelectedStamp(item)}></img>
                            <button onClick={() => __toggleCollectionItem(item)}>
                              {collection.some((collectionItem: any) => collectionItem.id === item.id) ? (
                                <FaHeart color='red' size={20} className={styles.sampleItemCard__icon} />
                              ) : (
                                <FaRegHeart size={20} className={styles.sampleItemCard__icon} />
                              )}
                            </button>
                          </div>
                        ))}
                        {collection.length === 0 && (
                          <span style={{ padding: 20, fontSize: 15, fontWeight: 400, textAlign: 'center', color: primaryColor }}>{t(codeLanguage + '000111')}</span>
                        )}
                      </div>
                    )
                  }
                </>
              )}

              {toolSelected === 'colorPicker' && (
                <div
                  className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}
                >
                  <ColorPicker></ColorPicker>
                </div>
              )}

              {toolSelected === 'filePicker' && (
                <div
                  className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}
                >
                  <FilePicker file={file} setFile={setFile} readFile={__handleReadFile} partOfCloth={selectedItem} />
                </div>
              )}


            </div>
          ) : (
            <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup}>
              <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuEditor}>
                <button
                  className=" rounded inline-flex items-center border-none"
                  onClick={() => __handleSelectToolDesign('modelProductTab')}
                  style={toolSelected === 'modelProductTab' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}
                >
                  <GiClothes color={toolSelected === 'modelProductTab' ? primaryColor : blackColor} size={30} className={`${styles.menuEditor__icon}`}></GiClothes>
                </button>

              </div>

              {/* Menu bar tab colection */}
              {toolSelected === 'modelProductTab' && (
                <>
                  <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__menuTabBarProduct} style={{ display: '' }}>
                    <button className={`${styles.menuTabBar__viewSample__btn}`} onClick={() => setIsOpenProductDialog(true)}>
                      <img src={shirtModel} className={`${styles.menuTabBar__viewSample__btn__img}`}></img>
                      <div className={`${styles.menuTabBar__viewSample__btn__content}`}>
                        <span>{t(codeLanguage + '000114')}</span>
                      </div>
                      <TbHomeHeart color={primaryColor} size={20} style={{ marginLeft: '40%' }} ></TbHomeHeart>
                    </button>
                    <button
                      className={` text-white font-bold py-2 px-4 rounded ${styles.menuTabBar__createBlank__btn}`}

                    >
                      <span>{t(codeLanguage + '000113')}</span>
                    </button>

                  </div>

                  {/* Sample Item list area */}

                  <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__modelProductList}>
                    {currentItem.map((item: any, key) => (
                      <div
                        key={item.id}
                        style={selectedStamp === item.id ? { border: `2px solid ${primaryColor}` } : {}}
                      >
                        <ProductCardDesignComponent></ProductCardDesignComponent>
                      </div>
                    ))}
                  </div>



                </>
              )}




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