
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './3DModelDialogStyle.module.scss';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Tooltip,
} from '@mui/material';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud } from 'react-feather';
import { useSnapshot } from 'valtio';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { DesignInterface, ItemMaskInterface, MaterialInterface, PartOfDesignInterface, PartOfHoodieDesignData, PartOfShirtDesignData } from '../../../models/DesignModel';
import { UserInterface } from '../../../models/UserModel';
import CanvasModel from '../../../canvas/CanvasModel';
import { grayColor, redColor } from '../../../root/ColorSystem';
import { useTranslation } from 'react-i18next';
import state from '../../../store';
import LoadingComponent from '../../Loading/LoadingComponent';
import { IoIosOpen, IoMdCloseCircleOutline } from 'react-icons/io';


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
  minWeight: number
  maxWeight: number
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



const ThreeDModelDialog: React.FC<{ designID?: any, isOpen: boolean, onClose: () => void }> = ({ designID, isOpen, onClose }) => {
  // TODO MUTIL LANGUAGE

  // ---------------UseState Variable---------------//
  const [selectedPartOfCloth, setSelectedPartOfCloth] = useState<PartOfDesignInterface>();
  const [partOfClothData, setPartOfClothData] = useState<PartOfDesignInterface[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<ItemMaskInterface[]>();
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
  const [itemSize, setItemSize] = useState<{ width?: number, height?: number }>();
  const [isFullStepActive, setIsFullStepActive] = useState<boolean>(false);
  const [isOpenComingSoonDialog, setIsOpenComingSoonDialog] = useState<boolean>(false);







  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const __handleUpdatePart = useCallback((updatePart: any) => {
    console.log('Received updatePart from child: ', updatePart);
    setUpdatePartData(updatePart);
    setPartOfClothData(updatePart);
    const result = updatePart?.find((item: PartOfDesignInterface) => item.partOfDesignID === selectedPartOfCloth?.partOfDesignID);
    if (result) {
      console.log('-----------------------------------------');
      setSelectedStamp(result.itemMasks)
    }
    state.modelData = updatePart

  }, []);
  const divRef = useRef<HTMLDivElement>(null);
  const snap = useSnapshot(state);
  // ---------------UseEffect---------------//
  useEffect(() => {
    const getItemFromStorage = localStorage.getItem('collection')
    if (getItemFromStorage) {
      const savedCollection = JSON.parse(getItemFromStorage);
      setCollection(savedCollection);
    }

    if (designID) {
      console.log('designID: ', designID);
      __handleGetDesignDatabyId(designID);
    }


    const userCookie = Cookies.get('userAuth');
    if (userCookie) {
      const userParse: UserInterface = JSON.parse(userCookie);
      setUserAuth(userParse);
    }



  }, [isOpen]);

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
    setSelectedPartOfCloth(selectedPartOfCloth);
    const result = partOfClothData?.find((item: PartOfDesignInterface) => item.partOfDesignName === selectedPartOfCloth?.partOfDesignName);
    if (result) {
      console.log('selectedPartOfCloth change: ', result.itemMasks);
      setSelectedStamp(result.itemMasks)
    }

  }, [selectedPartOfCloth]);



  useEffect(() => {

    setPartOfClothData(partOfClothData);
    state.modelData = partOfClothData;

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
  // }, [selectedStamp]);

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
        // setPartOfClothData(response.data.partOfDesign)
        setTypeOfModelID(response.data.expertTailoring.expertTailoringID);
        setColorModel(response.data.color);
        setTitleDesign(response.data.titleDesign);
        state.color = response.data.color;
        state.modelData = response.data.partOfDesign
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



  return (
    <Dialog open={isOpen} maxWidth='lg' fullWidth onClose={onClose}>
      <DialogTitle>
        <IoMdCloseCircleOutline
          cursor="pointer"
          size={20}
          color={redColor}
          onClick={onClose}
          style={{ position: 'absolute', right: 20, top: 20 }}
        />
      </DialogTitle>
      <div ref={divRef} className={styles.customDesign__container}>

        {/* Loading page */}
        <LoadingComponent isLoading={isLoadingPage}></LoadingComponent>
        <ToastContainer></ToastContainer>
        <main id='canvas3DElement' className={styles.customDesign__container__canvas}>
          {!changeUploadPartOfDesignTool ? (
            <CanvasModel typeOfModel={typeOfModel} isDefault={false} is3D={true} />
          ) : (
            <div style={{ backgroundColor: grayColor, opacity: 0.7, width: '100%', height: '100%' }}>
              <img src={selectedPartOfCloth?.realpartImageUrl} style={{ width: '100%', height: '100%' }}></img>
            </div>
          )}
        </main>

        {/* <Dialog maxWidth={'lg'} fullWidth >
          <DialogContent>
            <main id='canvas3DElement' style={{ height: 550 }}>
              {!changeUploadPartOfDesignTool ? (
                <CanvasModel typeOfModel={typeOfModel} isDefault={false} is3D={true} />
              ) : (
                <div style={{ backgroundColor: grayColor, opacity: 0.7, width: '100%', height: '100%' }}>
                  <img src={selectedPartOfCloth?.realpartImageUrl} style={{ width: '100%', height: '100%' }}></img>
                </div>
              )}
            </main>
          </DialogContent>

        </Dialog> */}


      </div >
    </Dialog>
  )
}

export default ThreeDModelDialog