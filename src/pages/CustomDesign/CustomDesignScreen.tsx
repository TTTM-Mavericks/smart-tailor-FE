
import { useCallback, useEffect, useState } from 'react';
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'
import styles from './CustomDesign.module.scss';
import ImageDraggableComponent from './Components/Draggable/ImageDraggableComponent';
import { __downloadCanvasToImage, __handleChangeImageToBase64, __handleGenerateItemId, reader } from '../../utils/DesignerUtils';
import { ColorPicker, FilePicker } from '../../components';
import { frontOfCloth, shirtModel, systemLogo } from '../../assets';
import { HiOutlineDownload, HiShoppingCart, HiOutlineLogin } from 'react-icons/hi';
import { FaSave, FaTshirt, FaPen, FaIcons, FaRegHeart, FaFileCode, FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { blackColor, primaryColor, whiteColor } from '../../root/ColorSystem';
import { IoMdColorPalette } from "react-icons/io";
import { IoText } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { IoMdUndo, IoMdRedo } from "react-icons/io";
import { TbHomeHeart } from "react-icons/tb";
import ProductDialogComponent from './Components/Dialog/ProductDialogComponent';
import api from '../../api/ApiConfig';
import { DesignInterface, ItemMaskInterface, PartOfDesignInterface, PartOfShirtDesignData } from '../../models/DesignModel';
import { Skeleton } from '@mui/material';



function CustomDesignScreen() {
  // TODO MUTIL LANGUAGE

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfDesignInterface>(PartOfShirtDesignData[0]);
  const [partOfClothData, setPartOfClothData] = useState<PartOfDesignInterface[]>();
  const [selectedStamp, setSelectedStamp] = useState<ItemMaskInterface[]>();
  const [selectedItem, setSelectedItem] = useState<string>('LOGO_PART');
  const [file, setFile] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  const [codeLanguage, setCodeLanguage] = useState<string>('EN');
  const [isEditorMode, setIsEditorMode] = useState<boolean>(true);
  const [isCollectionTab, setIsColectionTab] = useState<boolean>(false);
  const [toolSelected, setToolSelected] = useState<string>('stampsItem');
  const [collection, setCollection] = useState<ItemMaskInterface[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isOpenProductDialog, setIsOpenProductDialog] = useState<boolean>(false);
  const [typeOfModel, setTypeOfModel] = useState<string>('shirtModel');
  const [currentItemList, setCurrentItemList] = useState<ItemMaskInterface[]>();
  const [isCurrentItemListLoading, setIsCurrentItemListLoading] = useState<boolean>(true);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [designModelData, setDesignModelData] = useState<DesignInterface>();
  const [partOfDesignModelData, setPartOfDesignModelData] = useState<PartOfDesignInterface[]>([]);
  const [itemMaskDesignModelData, setItemMaskDesignModelData] = useState<ItemMaskInterface[]>([]);
  const [imgBase64Array, setImgBase64Array] = useState<[]>([]);
  const [itemPositions, setItemPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [itemZIndices, setItemZIndices] = useState<{ [key: string]: number }>({});
  const [highestZIndex, setHighestZIndex] = useState<number>(1);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [itemMaskData, setItemMaskData] = useState<ItemMaskInterface[]>([]);
  const [newPartOfDesignData, setNewPartOfDeignData] = useState<PartOfDesignInterface[]>();
  const [updatePartData, setUpdatePartData] = useState<any>(null); // Replace `any` with the appropriate type





  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();

  const handleUpdatePart = useCallback((updatePart: any) => { // Replace `any` with the appropriate type
    console.log('Received updatePart from child: ', updatePart);
    setUpdatePartData(updatePart);
    setPartOfClothData(updatePart);
  }, []);
  // ---------------UseEffect---------------//

  useEffect(() => {
    const getItemFromStorage = localStorage.getItem('collection')
    if (getItemFromStorage) {
      const savedCollection = JSON.parse(getItemFromStorage);
      setCollection(savedCollection);
    }

    __handleFetchSystemItemData();
    __handleFetchDesignModelData();


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
    console.log('selectedPartOfCloth: ', partOfClothData);
    setSelectedPartOfCloth(selectedPartOfCloth);
    const result = partOfClothData?.find((item: PartOfDesignInterface) => item.part_name === selectedPartOfCloth.part_name);
    if (result) {
      console.log('result.item_mask: ', result.item_mask);
      setSelectedStamp(result.item_mask)
    }

  }, [selectedPartOfCloth]);

  useEffect(() => {
    setSelectedItem(selectedItem)
  }, [selectedItem]);

  useEffect(() => {
    setPartOfClothData(partOfClothData);
  }, [partOfClothData])

  useEffect(() => {
    if (typeOfModel === 'shirtModel') {
      setPartOfClothData(PartOfShirtDesignData);
      setSelectedPartOfCloth(PartOfShirtDesignData[0]);
    }
  }, [typeOfModel]);

  useEffect(() => {
    if (selectedStamp) {
      const result = partOfClothData?.filter((item: PartOfDesignInterface) => item.part_name === selectedPartOfCloth.part_name);
      if (result) {
        const updatedPartOfClothData = partOfClothData?.map(part =>
          part.part_of_design_id === selectedPartOfCloth.part_of_design_id
            ? { ...part, item_mask: selectedStamp }
            : part
        );
        setPartOfClothData(updatedPartOfClothData);
      }
    }
  }, [selectedStamp, selectedPartOfCloth]);


  useEffect(() => {
    setSelectedStamp(selectedStamp);
  },[selectedStamp])
  // ---------------FunctionHandler---------------//

  const __handleSetNewPartOfDesignData = (items: PartOfDesignInterface[] | undefined) => {
    setNewPartOfDeignData(items);
  }

  const __handleRemoveStamp = (itemId: string) => {
    setSelectedStamp((prev) => prev?.filter((stamp: ItemMaskInterface) => stamp.item_mask_id !== itemId));
  };

  const __handleSaveStateToUndoStack = () => {
    setUndoStack(prev => [
      ...prev,
      {
        itemPositions: { ...itemPositions },
        itemZIndices: { ...itemZIndices },
        highestZIndex,
      },
    ]);
    setRedoStack([]);
  };

  const __handleUndoFlow = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop()!;
      setRedoStack(prev => [
        ...prev,
        {
          itemPositions: { ...itemPositions },
          itemZIndices: { ...itemZIndices },
          highestZIndex,
        },
      ]);
      setItemPositions(lastState.itemPositions);
      setItemZIndices(lastState.itemZIndices);
      setHighestZIndex(lastState.highestZIndex);
      setUndoStack([...undoStack]);
    }
  };

  const __handleRedoFlow = () => {
    if (redoStack.length > 0) {
      const lastState = redoStack.pop()!;
      setUndoStack(prev => [
        ...prev,
        {
          itemPositions: { ...itemPositions },
          itemZIndices: { ...itemZIndices },
          highestZIndex,
        },
      ]);
      setItemPositions(lastState.itemPositions);
      setItemZIndices(lastState.itemZIndices);
      setHighestZIndex(lastState.highestZIndex);
      setRedoStack([...redoStack]);
    }
  };

  /**
   * Handle fetch apit to get system Item data
   */
  const __handleFetchDesignModelData = async () => {
    try {
      // const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.design.systemItem}`);
      const response = await api.get(`https://665dc0c3e88051d604081de3.mockapi.io/api/v1/design`);

      if (response) {
        setDesignModelData(response);
        // setIsCurrentItemListLoading(false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      setIsCurrentItemListLoading(false);

    }
  }

  /**
   * Handle fetch apit to get system Item data
   */
  const __handleFetchSystemItemData = async () => {
    setIsCurrentItemListLoading(true);
    try {
      // const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.design.systemItem}`);
      const response = await api.get(`https://665dc0c3e88051d604081de3.mockapi.io/api/v1/stamps`);

      if (response) {
        setCurrentItemList(response);
        setIsCurrentItemListLoading(false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      setIsCurrentItemListLoading(false);

    }
  }

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

  const __handleSetSelectedItem = (item: PartOfDesignInterface) => {

    setSelectedPartOfCloth(item);
    const result: PartOfDesignInterface | undefined = partOfClothData?.find((itemFounded: PartOfDesignInterface) => itemFounded.part_name === item.part_name)
    if (result) {
      setSelectedItem(result.part_name);
    }
  };


  const __handleReadFile = (type: any) => {
    reader(file)
      .then((result) => {
        setSelectedStamp((prev) => {
          const newItem: ItemMaskInterface = {
            item_mask_id: __handleGenerateItemId(),
            type_of_item: 'IMAGE',
            image_url: result,
          };

          if (prev && prev.length > 0) {
            return [...prev, { ...prev[prev.length - 1], ...newItem }];
          } else {
            return [newItem];
          }
        });
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

  const __handleAddToCollection = (item: ItemMaskInterface) => {
    if (!collection.some((collectionItem) => collectionItem.item_mask_id === item.item_mask_id)) {
      const updatedCollection = [...collection, item];
      setCollection(updatedCollection);
      localStorage.setItem('collection', JSON.stringify(updatedCollection));
    }
  };

  const __handleRemoveFromCollection = (itemId: string) => {
    const updatedCollection = collection.filter((collectionItem) => collectionItem.item_mask_id !== itemId);
    setCollection(updatedCollection);
    localStorage.setItem('collection', JSON.stringify(updatedCollection));
  };

  const __toggleCollectionItem = (item: ItemMaskInterface) => {
    const itemId = item.item_mask_id;
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
      __handleRemoveFromCollection(itemId);
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
      __handleAddToCollection(item);
    }
  };


  /**
   * Add or remove selected Item from setSelectedStamp
   * @param item 
   */
  const __handleSetSelectedStamp = async (item: ItemMaskInterface) => {
    const result: ItemMaskInterface | undefined = currentItemList?.find(
      (itemFounded: ItemMaskInterface) => itemFounded.item_mask_id === item.item_mask_id
    );

    if (result) {
      const imgBase64 = await __handleChangeImageToBase64(result.image_url);
      result.image_url = imgBase64; // Update the image_url with base64 string

      setSelectedStamp((prevSelectedStamp = []) => {
        const existingItemIndex = prevSelectedStamp.findIndex(
          (existingItem: ItemMaskInterface) => existingItem.item_mask_id === item.item_mask_id
        );

        if (existingItemIndex > -1) {
          // Remove existing item
          const updatedStamps = prevSelectedStamp.filter(
            (existingItem: ItemMaskInterface) => existingItem.item_mask_id !== item.item_mask_id
          );
          return updatedStamps;
        } else {
          // Add new item
          const addItemArr = [...prevSelectedStamp, result];
          return addItemArr;
        }
      });
    }
  };

  const __handleCloseDialog = () => {
    setIsOpenProductDialog(false); // Close the dialog
  };

  const __handleItemSelect = (item: string) => {
    setTypeOfModel(item);
  };

  return (
    <div className={styles.customDesign__container}>
      {/* Dialog area */}
      <ProductDialogComponent onItemSelect={__handleItemSelect} isOpen={isOpenProductDialog} onClose={() => __handleCloseDialog()} />
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
          {partOfClothData?.map((item: PartOfDesignInterface, key: any) => (
            <div key={key} className={styles.partOfClothSellector} style={selectedItem === item.part_name ? { border: `2px solid ${primaryColor}` } : {}} onClick={() => __handleSetSelectedItem(item)}>
              <img src={frontOfCloth} className={styles.partOfClothSellector__img}></img>
            </div>
          ))}
        </div>

        {/* Monitor of editor area */}
        <div className={`${styles.customDesign__container__editorArea__display} editorArea__display `}>

          {/* Menu Bar of editor area */}
          <div className={styles.customDesign__container__editorArea__display__menuBar} >
            <div className={styles.customDesign__container__editorArea__display__menuBar__buttonGroup}>
              <button onClick={__handleUndoFlow}>
                <IoMdUndo size={20} style={{ float: 'left' }} />
                <span>
                  Undo
                </span>
              </button>
              <button onClick={__handleRedoFlow}>
                <span>
                  Redo
                </span>
                <IoMdRedo size={20} style={{ float: 'right' }} />
              </button>
            </div>
          </div>

          {selectedPartOfCloth && (
            <>
              <div className={`${styles.customDesign__container__editorArea__display__displayDesign} editorArea__display__displayDesign`} >
                <ImageDraggableComponent
                  partOfCloth={selectedPartOfCloth}
                  partOfClothData={partOfClothData}
                  itemPositions={itemPositions}
                  setItemPositions={(positions) => {
                    __handleSaveStateToUndoStack();
                    setItemPositions(positions);
                  }}
                  itemZIndices={itemZIndices}
                  setItemZIndices={(zIndices) => {
                    __handleSaveStateToUndoStack();
                    setItemZIndices(zIndices);
                  }}
                  highestZIndex={highestZIndex}
                  setHighestZIndex={setHighestZIndex}
                  onDeleteItem={__handleRemoveStamp}
                  setNewItemData={(items) => __handleSetNewPartOfDesignData(items)}
                  onUpdatePart={handleUpdatePart}
                  stamps={selectedStamp}
                ></ImageDraggableComponent>
              </div>
            </>
          )}
        </div>

        {/* Item selector area */}
        <div className={styles.customDesign__container__editorArea__itemSelector}>

          {/* Button group of item selected */}
          <div className={styles.customDesign__container__editorArea__itemSelector__buttonGroup}>
            <button
              className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__editorArea__itemSelector__buttonGroup__editorModelBtn} `}
              onClick={() => __handleSelectEditorMode(false)}
              style={isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaPen size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaPen>
              <span>{t(codeLanguage + '000109')}</span>
            </button>

            <button
              className={` py-2 px-4 rounded inline-flex items-center ${styles.customDesign__container__editorArea__itemSelector__buttonGroup__sampleModelBtn} `}
              onClick={() => __handleSelectEditorMode(true)}
              style={!isEditorMode ? { backgroundColor: primaryColor, color: whiteColor, borderColor: primaryColor } : {}}
            >
              <FaTshirt size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></FaTshirt>
              <span>{t(codeLanguage + '000108')}</span>
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
                      {currentItemList ? currentItemList.map((item: ItemMaskInterface, key) => (
                        <div
                          key={item.item_mask_id}
                          style={
                            selectedStamp?.some((selectedItem) => selectedItem.item_mask_id === item.item_mask_id)
                              ? { border: `2px solid ${primaryColor}` }
                              : {}
                          }
                          className={styles.sampleItemCard}
                          onClick={() => __handleSetSelectedStamp(item)}
                        >
                          <img src={item.image_url} style={{ width: '90%', height: '90%', borderRadius: 8 }} />
                          <button onClick={() => __toggleCollectionItem(item)}>
                            {collection.some((collectionItem: ItemMaskInterface) => collectionItem.item_mask_id === item.item_mask_id) ? (
                              <FaHeart color='red' size={20} className={styles.sampleItemCard__icon} />
                            ) : (
                              <FaRegHeart size={20} className={styles.sampleItemCard__icon} />
                            )}
                          </button>
                        </div>
                      )) : (
                        <>
                          {Array.from({ length: 10 }).map((_, index) => (
                            <div
                              key={index}
                              className={styles.sampleItemCard}
                            >
                              <Skeleton
                                key={index}
                                variant="rectangular"
                                width={'100%'}
                                height={'100%'}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )
                    : (
                      <div className={`${styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleCollectionList} pl-2.5`}>
                        {collection.map((item: ItemMaskInterface) => (
                          <div
                            key={item.item_mask_id}
                            style={
                              selectedStamp?.some((selectedItem) => selectedItem.item_mask_id === item.item_mask_id)
                                ? { border: `2px solid ${primaryColor}` }
                                : {}
                            }
                            className={`${styles.sampleItemCard}`}
                            onClick={() => __handleSetSelectedStamp(item)}
                          >
                            <img src={item.image_url} style={{ width: '90%', height: '90%', borderRadius: 8 }}></img>
                            <button onClick={() => __toggleCollectionItem(item)}>
                              {collection.some((collectionItem: ItemMaskInterface) => collectionItem.item_mask_id === item.item_mask_id) ? (
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
                      <TbHomeHeart color={primaryColor} size={20} style={{ marginLeft: '10%' }} ></TbHomeHeart>
                    </button>
                    <button
                      className={` text-white font-bold py-2 px-4 rounded ${styles.menuTabBar__createBlank__btn}`}

                    >
                      <span>{t(codeLanguage + '000113')}</span>
                    </button>

                  </div>

                  {/* Sample Item list area */}

                  {/* <div className={styles.customDesign__container__editorArea__itemSelector__itemGroup__modelProductList}>
                    {currentItem.map((item: any, key) => (
                      <div
                        key={item.id}
                        style={selectedStamp === item.id ? { border: `2px solid ${primaryColor}` } : {}}
                      >
                        <ProductCardDesignComponent></ProductCardDesignComponent>
                      </div>
                    ))}
                  </div> */}



                </>
              )}




            </div>
          )}
        </div>

      </div>
      <Designer />
      <main className={styles.customDesign__container__canvas}>
        <CanvasModel typeOfModel={typeOfModel} />
      </main>
      <ImageEditor />
    </div >
  )
}

export default CustomDesignScreen