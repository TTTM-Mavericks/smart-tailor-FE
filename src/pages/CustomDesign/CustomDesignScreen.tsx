
import { useCallback, useEffect, useRef, useState } from 'react';
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'
import styles from './CustomDesign.module.scss';
import ImageDraggableComponent from './Components/Draggable/ImageDraggableComponent';
import { __downloadCanvasToImage, __getDownloadCanvasToImage, __handleChangeImageToBase64, __handleGenerateItemId, reader, } from '../../utils/DesignerUtils';
import { ChooseMaterialDialogComponent, ColorPicker, FilePicker, TextEditor } from '../../components';
import { shirtFrontDesign } from '../../assets';
import { shirtModel, systemLogo } from '../../assets';
import { HiOutlineDownload, HiShoppingCart, HiOutlineLogin } from 'react-icons/hi';
import { FaSave, FaTshirt, FaPen, FaIcons, FaRegHeart, FaFileCode, FaHeart, FaCrown } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { blackColor, grayColor, greenColor, primaryColor, redColor, whiteColor, yellowColor } from '../../root/ColorSystem';
import { IoMdColorPalette } from "react-icons/io";
import { IoText } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { IoMdUndo, IoMdRedo } from "react-icons/io";
import { TbHomeHeart } from "react-icons/tb";
import ProductDialogComponent from './Components/Dialog/ProductDialogComponent';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../api/ApiConfig';
import { DesignInterface, ItemMaskInterface, MaterialInterface, PartOfDesignInterface, PartOfHoodieDesignData, PartOfShirtDesignData } from '../../models/DesignModel';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton, Slider, Tooltip } from '@mui/material';
import ItemEditorToolsComponent from './Components/ItemEditorTools/ItemEditorToolsComponent';
import MaterialDetailComponent from './Components/MaterialDetail/MaterialDetailComponent';
import { FaCloudUploadAlt, FaRegEdit } from "react-icons/fa";
import state from '../../store';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import { UserInterface } from '../../models/UserModel';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Cloud, UploadCloud } from 'react-feather';
import { __handleDownloadElementAsPng, __handleGetElementAsBase64 } from '../../utils/CanvasUtils';
import { useSnapshot } from 'valtio';


interface ItemMask {
  itemMaskName: string;
  typeOfItem: string;
  materialID: string;
  isSystemItem: boolean;
  positionX: number;
  positionY: number;
  scaleX: number;
  scaleY: number;
  indexZ: number;
  imageUrl: string;
  printType: string;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  rotate?: number
}

interface PartOfDesign {
  partOfDesignName: string;
  imageUrl: string;
  successImageUrl: string;
  materialID: string;
  width: number;
  height: number;
  itemMask: ItemMask[];
  realpartImageUrl?: string;

}

interface Design {
  userID: string;
  expertTailoringID: string;
  titleDesign: string;
  publicStatus: boolean;
  imageUrl: string;
  color: string;
  partOfDesign: PartOfDesign[];
}

interface ImageSystemData {
  imageID: string;
  imageName: string;
  imageURL: string;
  imageStatus: boolean;
  imageType: string;
  isPremium: boolean;
}

interface BorderRadiusItemMaskInterface {
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
}



function CustomDesignScreen() {
  // TODO MUTIL LANGUAGE

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfDesignInterface>();
  const [partOfClothData, setPartOfClothData] = useState<PartOfDesignInterface[]>();
  const [selectedStamp, setSelectedStamp] = useState<ItemMaskInterface[]>();
  const [selectedItem, setSelectedItem] = useState<string>('LOGO_PART');
  const [file, setFile] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  const [codeLanguage, setCodeLanguage] = useState<string>('EN');
  const [isEditorMode, setIsEditorMode] = useState<boolean>(true);
  const [isCollectionTab, setIsColectionTab] = useState<boolean>(false);
  const [toolSelected, setToolSelected] = useState<string>('stampsItem');
  const [collection, setCollection] = useState<ItemMaskInterface[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isOpenProductDialog, setIsOpenProductDialog] = useState<boolean>(false);
  const [typeOfModel, setTypeOfModel] = useState<string>('shirtModel');
  const [typeOfModelID, setTypeOfModelID] = useState<string>('');
  const [currentItemList, setCurrentItemList] = useState<ItemMaskInterface[]>();
  const [isCurrentItemListLoading, setIsCurrentItemListLoading] = useState<boolean>(true);
  const [designModelData, setDesignModelData] = useState<DesignInterface>();
  const [itemPositions, setItemPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [itemZIndices, setItemZIndices] = useState<{ [key: string]: number }>({});
  const [highestZIndex, setHighestZIndex] = useState<number>(1);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [newPartOfDesignData, setNewPartOfDeignData] = useState<PartOfDesignInterface[]>();
  const [updatePartData, setUpdatePartData] = useState<any>(null);
  const [angle, setAngle] = useState<{ itemMaskID: any, value: number }>();
  const [itemIdToChangeRotate, setItemIdToChangeRotate] = useState<any>();
  const [isOpenMaterialDialog, setIsOpenMaterialDiaglog] = useState<boolean>(false);
  const [changeUploadPartOfDesignTool, setChangeUploadPartOfDesignTool] = useState<boolean>(false);
  const [isOpenNotiChangeUpdateImageDesignTool, setIsOpenNotiChangeUpdateImageDesignTool] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [userAuth, setUserAuth] = useState<UserInterface>();
  const [mainDesign, setMainDesign] = useState<DesignInterface>();
  const [usedMaterial, setUsedMaterial] = useState<MaterialInterface[]>();
  const [titleDesign, setTitleDesign] = useState<string>();
  const [isClickOutSide, setIsClickOutSize] = useState<boolean>(false);
  const [successImgPartOfDesign, setSuccessImgPartOfDesign] = useState<string>('');
  const [colorModel, setColorModel] = useState<string>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [imghehe, setImgHehe] = useState<string>();
  const [borderRadiusItemMask, setBorderRadiusItemMask] = useState<BorderRadiusItemMaskInterface>(
    {
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 0,
      bottomRightRadius: 0,
    }
  );
  const [selectedItemMask, setSelectedItemMask] = useState<ItemMaskInterface>();
  const [itemSize, setItemSize] = useState<{ width?: number, height?: number }>()





  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const __handleUpdatePart = useCallback((updatePart: any) => {
    console.log('Received updatePart from child: ', updatePart);
    setUpdatePartData(updatePart);
    setPartOfClothData(updatePart);
    // const result = updatePart?.find((item: PartOfDesignInterface) => item.partOfDesignID === selectedPartOfCloth?.partOfDesignID);
    // if (result) {
    //   console.log('selectedPartOfCloth change: ', result.itemMasks);
    //   setSelectedStamp(result.itemMasks)
    // }
    state.modelData = updatePart

  }, []);
  const divRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const snap = useSnapshot(state);
  // ---------------UseEffect---------------//


  // useEffect(() => {
  //   if (!partOfClothData) return;

  //   const executeFunction = () => {
  //     __handleGetMaterialInformation(partOfClothData).then((value) => {
  //       __handleUpdateDesign(true, value);
  //     });
  //   };

  //   // Execute immediately
  //   executeFunction();

  //   // Set interval to execute every 2 minutes (120000 ms)
  //   const intervalId = setInterval(executeFunction, 150000);

  //   // Cleanup function to clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);



  useEffect(() => {
    const getItemFromStorage = localStorage.getItem('collection')
    if (getItemFromStorage) {
      const savedCollection = JSON.parse(getItemFromStorage);
      setCollection(savedCollection);
    }

    __handleFetchSystemItemData();
    __handleFetchDesignModelData();
    __handleGetDesignDatabyId(id);


    const userCookie = Cookies.get('userAuth');
    if (userCookie) {
      const userParse: UserInterface = JSON.parse(userCookie);
      setUserAuth(userParse);
    }



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
    // setSelectedPartOfCloth(selectedPartOfCloth);
    const result = partOfClothData?.find((item: PartOfDesignInterface) => item.partOfDesignName === selectedPartOfCloth?.partOfDesignName);
    if (result) {
      console.log('selectedPartOfCloth change: ', result.itemMasks);
      setSelectedStamp(result.itemMasks)
    }

  }, [selectedPartOfCloth]);


  useEffect(() => {
    setSelectedItem(selectedItem)
  }, [selectedItem]);

  useEffect(() => {

    setPartOfClothData(partOfClothData);
    // state.modelData = partOfClothData;

  }, [partOfClothData])


  useEffect(() => {
    if (typeOfModel === 'shirtModel') {
      setPartOfClothData(PartOfShirtDesignData);
      // __handleGetDesignDatabyId(id);
      setSelectedPartOfCloth(PartOfShirtDesignData[0]);
    }

    if (typeOfModel === 'hoodieModel') {
      setPartOfClothData(PartOfHoodieDesignData);
      setSelectedPartOfCloth(PartOfHoodieDesignData[0]);
    }
  }, [typeOfModel]);

  useEffect(() => {
    if (selectedStamp) {
      const result = partOfClothData?.filter((item: PartOfDesignInterface) => item.partOfDesignName === selectedPartOfCloth?.partOfDesignName);
      if (result) {
        const updatedPartOfClothData = partOfClothData?.map(part =>
          part.partOfDesignID === selectedPartOfCloth?.partOfDesignID
            ? { ...part, itemMasks: selectedStamp }
            : part
        );

        setPartOfClothData(updatedPartOfClothData);
      }
    }
  }, [selectedStamp, selectedPartOfCloth]);


  // useEffect(() => {
  //   setSelectedStamp(selectedStamp);
  // }, [selectedStamp])

  useEffect(() => {
    __handleGetAllSystemImageStamps()
  }, [])

  // useEffect(() => {
  //   // console.log('vào đâyyyyyyyyyyyyyyyyyyyyyyyyyyy');
  //   if (!partOfClothData) return;

  //   const newPartOfClothData = partOfClothData?.map((part) => {
  //     if (part.partOfDesignID === selectedPartOfCloth.partOfDesignID) {
  //       return {
  //         ...part,
  //         itemMasks: part.itemMasks?.map((item) => {
  //           if (item.itemMaskID === selectedItemMask?.itemMaskID) {
  //             return {
  //               ...item,
  //               bottomLeftRadius: borderRadiusItemMask.bottomLeftRadius || 0,
  //               bottomRightRadius: borderRadiusItemMask.bottomRightRadius || 0,
  //               topLeftRadius: borderRadiusItemMask.topLeftRadius || 0,
  //               topRightRadius: borderRadiusItemMask.topRightRadius || 0,
  //               rotate: angle || 0
  //             };
  //           }
  //           return item;
  //         })
  //       };
  //     }
  //     return part;
  //   });

  //   // setPartOfClothData(newPartOfClothData)

  //   console.log('+++++++++++++++++++++++++++++++++++++++++++++++++: ', newPartOfClothData);




  // }, [angle, borderRadiusItemMask, partOfClothData]);

  // ---------------FunctionHandler---------------//

  //+++++ FETCH API +++++//

  const transformData = (data: ImageSystemData[]): ItemMaskInterface[] => {
    return data.map((item, index) => ({
      partOfDesignID: '',
      itemMaskName: item.imageName,
      typeOfItem: item.imageType,
      isSystemItem: false,
      isPremium: item.isPremium,
      position: {
        x: 150,
        y: 170
      },
      positionX: 150,
      positionY: 170,
      scaleX: 230,
      scaleY: 230,
      imageUrl: item.imageURL,
      print_type: '',
      createDate: '',
      lastModifiedDate: '',
      zIndex: 1,
      itemMaskID: item.imageID,
      rotate: 0,
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 0,
      bottomRightRadius: 0,
    }));
  }


  /**
   * Get all system item stamps
   * @returns 
   */
  const __handleGetAllSystemImageStamps = async () => {
    try {
      const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.systemImage + functionEndpoints.systemImage.getAllSystemIamge}`);
      if (response.status === 200) {
        console.log(transformData(response.data));
        setCurrentItemList(transformData(response.data));
        setIsCurrentItemListLoading(false);
      }
      else {
        toast.error(`${response.message}`, { autoClose: 4000 });
        return;
      }
    } catch (error) {
      toast.error(`${error}`, { autoClose: 4000 });
      console.log('error: ', error);
    }
  }

  /**
   * Handle get design by ID
   * @returns 
   */
  const __handleGetDesignDatabyId = async (id: any) => {
    setIsLoadingPage(true);
    try {
      const response = await api.get(`${versionEndpoints.v1 + `/` + featuresEndpoints.design + functionEndpoints.design.getDesignByID}/${id}`);
      if (response.status === 200) {
        setPartOfClothData(response.data.partOfDesign);
        console.log(response.data);
        const order = ["LOGO_PART", "FRONT_CLOTH_PART", "BACK_CLOTH_PART", "SLEEVE_CLOTH_PART"];
        const sortedParts = response.data.partOfDesign.sort((a: PartOfDesignInterface, b: PartOfDesignInterface) => order.indexOf(a.partOfDesignName) - order.indexOf(b.partOfDesignName));
        console.log(sortedParts);
        setSelectedPartOfCloth(response.data.partOfDesign[0]);
        setTypeOfModelID(response.data.expertTailoring.expertTailoringID);
        setColorModel(response.data.color);
        setTitleDesign(response.data.titleDesign);
        // state.color = response.data.color;
        // state.modelData = response.data.partOfDesign
        setIsLoadingPage(false);

      }
      else {
        toast.error(`${response.message}`, { autoClose: 4000 });
        return;
      }
    } catch (error) {
      toast.error(`${error}`, { autoClose: 4000 });
      console.log('error: ', error);
    }
  }

  const __handleSetNewPartOfDesignData = (items: PartOfDesignInterface[] | undefined) => {
    setNewPartOfDeignData(items);
    setPartOfClothData(partOfClothData);
  }

  const __handleRemoveStamp = (itemId: string) => {
    setSelectedStamp((prev) => prev?.filter((stamp: ItemMaskInterface) => stamp.itemMaskID !== itemId));
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

  const imageDraggableRef = useRef<any>(null);

  const __handleUndoFlow = () => {
    if (imageDraggableRef.current) {
      imageDraggableRef.current.undo();
    }
  };

  const __handleRedoFlow = () => {
    if (imageDraggableRef.current) {
      imageDraggableRef.current.redo();
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
    setIsLoadingPage(true);
    try {
      // const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.design.systemItem}`);
      const response = await api.get(`https://665dc0c3e88051d604081de3.mockapi.io/api/v1/stamps`);

      if (response) {
        // setCurrentItemList(response);
        setIsCurrentItemListLoading(false);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      setIsCurrentItemListLoading(false);
      setIsLoadingPage(false);
    }
  }

  const __handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const __handleSetSelectedItem = (item: PartOfDesignInterface) => {

    setSelectedPartOfCloth(item);
    const result: PartOfDesignInterface | undefined = partOfClothData?.find((itemFounded: PartOfDesignInterface) => itemFounded.partOfDesignName === item.partOfDesignName)
    if (result) {
      setSelectedItem(result.partOfDesignName);
    }
  };


  const __handleReadFile = (type: any) => {
    reader(file)
      .then((result) => {
        setSelectedStamp((prev) => {
          const newItem: ItemMaskInterface = {
            itemMaskID: __handleGenerateItemId(),
            typeOfItem: 'IMAGE',
            imageUrl: result,
            zIndex: 1,
            indexZ: 1,
            position: {
              x: 150,
              y: 170
            },
            positionX: 150,
            positionY: 170,
            scaleX: 230,
            scaleY: 230,
            topLeftRadius: 0,
            topRightRadius: 0,
            bottomLeftRadius: 0,
            bottomRightRadius: 0,
          };

          if (prev && prev.length > 0) {
            return [...prev, { ...prev[prev.length - 1], ...newItem }];
          } else {
            return [newItem];
          }
        });
      })
  }

  const __handleReadFileUploadImageTool = (type: any) => {

    reader(file)
      .then((result) => {
        const newUploadPart = partOfClothData?.map((part) => {
          if (selectedPartOfCloth?.partOfDesignID === part.partOfDesignID) {
            return {
              ...part,
              realpartImageUrl: result
            };
          }
          setSelectedPartOfCloth(part)
          return part;
        });

        setPartOfClothData(newUploadPart);
      }
      )
  };


  const __handleAddTextToDesign = (txtBase64: any) => {
    setSelectedStamp((prev) => {
      const newItem: ItemMaskInterface = {
        itemMaskID: __handleGenerateItemId(),
        typeOfItem: 'TEXT',
        imageUrl: txtBase64,
        position: { x: 150, y: 170 },
        positionX: 150,
        positionY: 170,
        zIndex: 1,
        indexZ: 1,
        topLeftRadius: 0,
        topRightRadius: 0,
        bottomLeftRadius: 0,
        bottomRightRadius: 0,
      };

      if (prev && prev.length > 0) {
        return [...prev, { ...prev[prev.length - 1], ...newItem }];
      } else {
        return [newItem];
      }
    });
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
    if (!collection.some((collectionItem) => collectionItem.itemMaskID === item.itemMaskID)) {
      const updatedCollection = [...collection, item];
      setCollection(updatedCollection);
      localStorage.setItem('collection', JSON.stringify(updatedCollection));
    }
  };

  const __handleRemoveFromCollection = (itemId: string) => {
    const updatedCollection = collection.filter((collectionItem) => collectionItem.itemMaskID !== itemId);
    setCollection(updatedCollection);
    localStorage.setItem('collection', JSON.stringify(updatedCollection));
  };

  const __toggleCollectionItem = (item: ItemMaskInterface) => {
    const itemId = item.itemMaskID;
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
      (itemFounded: ItemMaskInterface) => itemFounded.itemMaskID === item.itemMaskID
    );

    if (result) {
      const imgBase64 = await __handleChangeImageToBase64(result.imageUrl);
      result.imageUrl = imgBase64; // Update the imageUrl with base64 string
      result.partOfDesignID = selectedPartOfCloth?.partOfDesignID;
      result.indexZ = 1;
      result.zIndex = 1;
      console.log('adddddddd   before: ', selectedStamp);

      // setSelectedPartOfCloth(selectedPartOfCloth);

      setSelectedStamp((prevSelectedStamp = []) => {
        const existingItemIndex = prevSelectedStamp.findIndex(
          (existingItem: ItemMaskInterface) => existingItem.itemMaskID === item.itemMaskID
        );

        if (existingItemIndex > -1) {
          // Remove existing item
          const updatedStamps = prevSelectedStamp.filter(
            (existingItem: ItemMaskInterface) => existingItem.itemMaskID !== item.itemMaskID
          );
          return updatedStamps;
        } else {
          // Add new item

          const addItemArr = [...prevSelectedStamp, { ...result, partOfDesignID: selectedPartOfCloth?.partOfDesignID }];
          console.log('adddddddd   after: ', addItemArr);
          return addItemArr;
        }
      });
    }
  };

  const __handleCloseDialog = () => {
    setIsOpenProductDialog(false); // Close the dialog
  };

  const __handleItemSelect = (item: string, id: any) => {
    setTypeOfModel(item);
    setTypeOfModelID(id);

  };

  const __handleOnSetIsOtherItemSelected = (itemId: any) => {
    setItemIdToChangeRotate(itemId);
  }

  const __handleOpenMaterialDialog = () => {
    setIsOpenMaterialDiaglog(true);
  }

  const __handleCloseMaterialDialog = () => {
    setIsOpenMaterialDiaglog(false);
  }

  const __handleChangeUploadPartOfDesignTool = (isUploadImage: boolean) => {
    setChangeUploadPartOfDesignTool(isUploadImage);
    setSelectedStamp([]);
    setIsOpenNotiChangeUpdateImageDesignTool(false);

  }

  /**
   * Change body response
   * @param itemMasks 
   * @returns 
   */
  const transformItemMasks = (itemMasks: any[]): ItemMask[] => {
    return itemMasks.map(mask => ({
      itemMaskName: mask.itemMaskName || "",
      typeOfItem: mask.typeOfItem || "",
      materialID: mask.materialID,
      isSystemItem: mask.isSystemItem || false,
      positionX: mask.positionX || 0,
      positionY: mask.positionY || 0,
      scaleX: mask.scaleX || 1,
      scaleY: mask.scaleY || 1,
      indexZ: mask.zIndex || 0,
      imageUrl: mask.imageUrl || "",
      printType: mask.printType || "EMBROIDER",
      topLeftRadius: mask.topLeftRadius || 0,
      topRightRadius: mask.topRightRadius || 0,
      bottomLeftRadius: mask.bottomLeftRadius || 0,
      bottomRightRadius: mask.bottomRightRadius || 0,
      rotate: mask.rotate || 0,

    }));
  };

  /**
   * Change body response
   * @param parts 
   * @returns 
   */
  const transformPartOfDesign = (parts: PartOfDesignInterface[]): PartOfDesign[] => {
    return parts.map(part => ({
      partOfDesignName: part.partOfDesignName || "",
      imageUrl: part.imageUrl || "",
      successImageUrl: part.successImageUrl || "",
      materialID: part.materialID,
      width: 15,
      height: 20,
      itemMask: transformItemMasks(part.itemMasks || []),
      realPartImageUrl: part.realpartImageUrl || "",
    }));
  };

  /**
   * Get Design data after choose material
   * @param item 
   */
  const __handleGetMaterialInformation = async (item: PartOfDesignInterface[]) => {
    const successImaUrl = await __handleGetElementAsBase64('canvas3DElement')
    console.log(successImaUrl);
    const bodyRequest: Design = {
      userID: userAuth?.userID || '',
      expertTailoringID: typeOfModelID,
      titleDesign: titleDesign || "test TitleDesign",
      publicStatus: true,
      imageUrl: successImaUrl ? successImaUrl : '',
      color: snap.color || '#FFFFFF',
      partOfDesign: transformPartOfDesign(item)
    };
    console.log(bodyRequest);
    setMainDesign(bodyRequest);
    return bodyRequest
  }

  /**
   * 
   */
  const __handleSaveDesign = () => {
    if (partOfClothData) {

      __handleGetMaterialInformation(partOfClothData).then((value) => {
        __handleUpdateDesign(true, value);
      })
    }
  }

  /**
  * Handle Create design
  * @param item 
  */
  const __handleUpdateDesign = async (isLickSaveButton: boolean, mainDesign: DesignInterface | undefined) => {

    if (!mainDesign) {
      __handleGetMaterialInformation
    };
    if (!isLickSaveButton) {
      setIsLoadingPage(true);
    }
    try {
      const response = await api.put(`${versionEndpoints.v1 + `/` + featuresEndpoints.design + functionEndpoints.design.updateDesign}/${id}`, mainDesign);
      if (response.status === 200) {
        // toast.success(`${response.message}`, { autoClose: 4000 });

        if (!isLickSaveButton) {
          setTimeout(() => {
            setIsLoadingPage(false);
            navigate(`/design_detail/${response.data.designID}`);
          }, 3000)
        } else {
          setIsLoadingPage(false);
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
          }, 5000);

        }
      } else {
        toast.error(`${response.message}`, { autoClose: 4000 });
        setIsLoadingPage(false);
      }
    } catch (error) {
      toast.error(`${error}`, { autoClose: 3000 });
      console.log('error: ', error);
      setIsLoadingPage(false);


    }


  }

  // const __handleClickOutside = () => {
  //   if (!isClickOutSide)
  //     setIsClickOutSize(true);
  //   console.log('click outside');
  // }

  // const __handleGetStateOutside = (state: boolean) => {
  //   if (!state) setIsClickOutSize(false);
  // }

  return (
    <div ref={divRef} className={styles.customDesign__container}>

      {/* Loading page */}
      <LoadingComponent isLoading={isLoadingPage}></LoadingComponent>
      <ToastContainer></ToastContainer>
      {/* Dialog area */}

      {/* Prouct list dialog */}
      <ProductDialogComponent onItemSelect={__handleItemSelect} isOpen={isOpenProductDialog} onClose={() => __handleCloseDialog()} />

      {/* Choose Material Dialog */}
      <ChooseMaterialDialogComponent
        typeOfModel={typeOfModel}
        isOpen={isOpenMaterialDialog}
        onClose={() => __handleCloseMaterialDialog()}
        child={(
          <MaterialDetailComponent expertID={typeOfModelID} primaryKey={'DIALOG'} partOfDesigndata={partOfClothData} onGetMaterial={(item) => __handleGetMaterialInformation(item)}></MaterialDetailComponent>
        )}
        model={(
          <CanvasModel typeOfModel={typeOfModel} isDefault={true} is3D={true} />
        )}
        onCreateDesign={() => __handleUpdateDesign(false, mainDesign)}
      ></ChooseMaterialDialogComponent>

      {/* Update design tool Dialog */}
      <Dialog open={isOpenNotiChangeUpdateImageDesignTool} style={{ position: 'absolute', top: 0 }}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your design will be lost. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenNotiChangeUpdateImageDesignTool(false)} style={{ color: primaryColor }}  >
            No
          </Button>
          <Button onClick={() => __handleChangeUploadPartOfDesignTool(!changeUploadPartOfDesignTool)} style={{ backgroundColor: redColor, color: whiteColor }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>


      {/* Header */}
      <div className={styles.customDesign__container__header}>
        <div className={styles.customDesign__container__header__logo}>
          <img src={systemLogo}></img>
          <div >
            <h3>{t(codeLanguage + '000001')}</h3>
          </div>
          <UploadCloud size={20} style={{ marginTop: 5, marginLeft: 15 }} color={isSaved ? greenColor : blackColor}> </UploadCloud>
          <div>
            <div className="relative rounded-md shadow-sm ml-20">
              <input
                type="text"
                name="price"
                id="price"
                className="block h-7 rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300"
                value={titleDesign}
                onChange={(e) => setTitleDesign(e.target.value)}
                placeholder={titleDesign ? titleDesign : 'Design title'}
                style={{ outline: 'none', fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        <div className={styles.customDesign__container__header__buttonGroup}>
          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__downloadBtn} `} onClick={() => __downloadCanvasToImage()}>
            <HiOutlineDownload size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.downloadIcon}></HiOutlineDownload>
            <span>{t(codeLanguage + '000104')}</span>
          </button>

          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__saveBtn} `} onClick={() => __handleSaveDesign()}>
            <FaSave size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.saveIcon}></FaSave>
            <span>{t(codeLanguage + '000105')}</span>
          </button>

          <button className={` py-1 px-4 rounded inline-flex items-center ${styles.customDesign__container__header__buttonGroup__orderBtn} `} onClick={() => __handleOpenMaterialDialog()}>
            <HiShoppingCart size={20} style={{ marginRight: 5, backgroundColor: 'transparent', border: 'none' }} className={styles.orderIcon}></HiShoppingCart>
            <span>{t(codeLanguage + '000106')}</span>
          </button>

        </div>

      </div>

      <div className={styles.customDesign__container__editorArea}>

        {/* Part of cloth of Model */}
        <div className={styles.customDesign__container__editorArea__partOfCloth}>
          {partOfClothData?.map((item: PartOfDesignInterface, key: any) => (
            <Tooltip key={key} title={item.partOfDesignName} placement="bottom" arrow style={{ marginTop: -10 }}>
              <div key={key} className={styles.partOfClothSellector} style={selectedItem === item.partOfDesignName ? { border: `2px solid ${primaryColor}` } : {}} onClick={() => __handleSetSelectedItem(item)}>
                <img src={item.imageUrl} className={styles.partOfClothSellector__img}></img>
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Monitor of editor area */}
        <div className={`${styles.customDesign__container__editorArea__display} editorArea__display `}>

          {/* Menu Bar of editor area */}
          <div className={styles.customDesign__container__editorArea__display__menuBar} >
            <div className={styles.customDesign__container__editorArea__display__menuBar__buttonGroup}>
              {/* TODO */}
              <button onClick={() => setIsOpenNotiChangeUpdateImageDesignTool(true)}>
                {changeUploadPartOfDesignTool ? (
                  <>
                    <FaRegEdit size={20} style={{ float: 'left' }} />
                    <span>
                      Editor
                    </span>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt size={20} style={{ float: 'left' }} />
                    <span>
                      Upload image
                    </span>
                  </>
                )}

              </button>

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

          {/* MONITOR EDITER */}
          {selectedPartOfCloth && !changeUploadPartOfDesignTool && (
            <>
              <div

                className={`${styles.customDesign__container__editorArea__display__displayDesign} editorArea__display__displayDesign`}

              >
                <ImageDraggableComponent
                  partOfCloth={selectedPartOfCloth}
                  partOfClothData={partOfClothData}
                  itemPositions={itemPositions}
                  itemZIndices={itemZIndices}
                  onDeleteItem={__handleRemoveStamp}
                  onUpdatePart={__handleUpdatePart}
                  stamps={selectedStamp}
                  rotate={angle}
                  onSetIsOtherItemSelected={(itemId) => __handleOnSetIsOtherItemSelected(itemId)}
                  onUndo={__handleUndoFlow}
                  onRedo={__handleRedoFlow}
                  isOutSideClick={isClickOutSide}
                  borderRadiusItemMask={borderRadiusItemMask}
                  onGetSelectedItemDrag={setSelectedItemMask}
                  itemSize={itemSize}
                ></ImageDraggableComponent>
              </div>
            </>
          )}

          {selectedPartOfCloth && changeUploadPartOfDesignTool && (
            <>
              <div className={`${styles.customDesign__container__editorArea__display__displayDesign}`} style={{ pointerEvents: 'auto' }} >
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 light:hover:bg-bray-800 light:bg-gray-700 hover:bg-gray-100 light:border-gray-600 light:hover:border-gray-500 light:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 light:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 light:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 light:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <FilePicker file={file} setFile={setFile} readFile={__handleReadFileUploadImageTool} partOfCloth={selectedItem} />
                  </label>
                </div>
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
                  onClick={() => __handleSelectToolDesign('textEditorTool')}
                  style={toolSelected === 'textEditorTool' ? { backgroundColor: whiteColor, borderRadius: 0 } : {}}
                >
                  <IoText color={toolSelected === 'textEditorTool' ? primaryColor : blackColor} size={25} className={`${styles.menuEditor__icon}`}></IoText>
                </button>
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
                          key={item.itemMaskID}
                          style={
                            selectedStamp?.some((selectedItem) => selectedItem.itemMaskID === item.itemMaskID)
                              ? { border: `2px solid ${primaryColor}`, position: 'relative' }
                              : { position: 'relative' }
                          }
                          className={styles.sampleItemCard}
                          onClick={() => __handleSetSelectedStamp(item)}
                        >
                          {item.isPremium && (
                            <div style={{ position: 'absolute', top: 5, left: 5, zIndex: 90 }}>
                              <FaCrown color={yellowColor} size={20} />
                            </div>
                          )}
                          <img src={item.imageUrl} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
                          <button onClick={() => __toggleCollectionItem(item)}>
                            {collection.some((collectionItem: ItemMaskInterface) => collectionItem.itemMaskID === item.itemMaskID) ? (
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
                            key={item.itemMaskID}
                            style={
                              selectedStamp?.some((selectedItem) => selectedItem.itemMaskID === item.itemMaskID)
                                ? { border: `2px solid ${primaryColor}` }
                                : {}
                            }
                            className={`${styles.sampleItemCard}`}
                            onClick={() => __handleSetSelectedStamp(item)}
                          >
                            {item.isPremium && (
                              <div style={{ position: 'absolute', top: 5, left: 5, zIndex: 90 }}>
                                <FaCrown color={yellowColor} size={20} />
                              </div>
                            )}
                            <img src={item.imageUrl} style={{ width: '100%', height: '100%', borderRadius: 4 }}></img>
                            <button onClick={() => __toggleCollectionItem(item)}>
                              {collection.some((collectionItem: ItemMaskInterface) => collectionItem.itemMaskID === item.itemMaskID) ? (
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
                  <ColorPicker colorDefault={colorModel}></ColorPicker>
                </div>
              )}

              {toolSelected === 'filePicker' && (
                <div
                  className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}
                >
                  <FilePicker file={file} setFile={setFile} readFile={__handleReadFile} partOfCloth={selectedItem} />
                </div>
              )}

              {toolSelected === 'textEditorTool' && (
                <div
                  className={styles.customDesign__container__editorArea__itemSelector__itemGroup__sampleItemList}
                  style={{ position: 'relative' }}
                >
                  <TextEditor onSetText={(txtBase64) => __handleAddTextToDesign(txtBase64)}></TextEditor>
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
                    <MaterialDetailComponent primaryKey={2468} partOfDesigndata={partOfClothData}></MaterialDetailComponent>
                  </div> */}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Designer />

      {/* Canvas 3d display area */}
      <main id='canvas3DElement' className={styles.customDesign__container__canvas}>
        {!changeUploadPartOfDesignTool ? (
          <CanvasModel typeOfModel={typeOfModel} isDefault={false} is3D={true} />
        ) : (
          <div style={{ backgroundColor: grayColor, opacity: 0.7, width: '100%', height: '100%' }}>
            <img src={selectedPartOfCloth?.realpartImageUrl} style={{ width: '100%', height: '100%' }}></img>
          </div>
        )}
      </main>

      {/* Editor tools */}
      <div className={styles.customDesign__container__itemEditor}>
        <ItemEditorToolsComponent
          partOfDesignData={partOfClothData}
          selectedPartOfDesign={selectedPartOfCloth}
          selectedItemMask={selectedItemMask}
          targetRef={divRef}
          itemIdSelected={itemIdToChangeRotate}
          onValueChange={setAngle}
          onGetBorderRadiusValueChange={setBorderRadiusItemMask}
          onGetSizeValueChange={setItemSize}
        />

      </div>


      {/* DIALOG */}

      {/* Choose Material Dialog */}
      {/* <CanvasModel typeOfModel={typeOfModel} isDefault={false} is3D={true} /> */}


    </div >
  )
}

export default CustomDesignScreen