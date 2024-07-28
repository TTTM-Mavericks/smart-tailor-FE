import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DesignInterface, ExpertTailoringInterface, PartOfDesignInterface } from '../../../../models/DesignModel';
import { __handleGetElementAsBase64 } from '../../../../utils/CanvasUtils';
import { UserInterface } from '../../../../models/UserModel';
import Cookies from 'js-cookie';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { useNavigate } from 'react-router-dom';
import SettingDesignLoadingComponent from '../../../../components/Loading/SettingDesignLoadingComponent';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import { whiteColor } from '../../../../root/ColorSystem';

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
}

interface PartOfDesign {
    partOfDesignName: string;
    imageUrl: string;
    successImageUrl: string;
    materialID: string;
    width?: number,
    height?: number,
    itemMask: ItemMask[];
}

interface Design {
    userID: string;
    expertTailoringID?: string;
    titleDesign: string;
    publicStatus: boolean;
    imageUrl: string;
    color: string;
    partOfDesign: PartOfDesign[];
    minWeight: number,
    maxWeight: number
}


const CreateDesignComponent = () => {
    // ---------------UseState Variable---------------// 
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [typeOfModelID, setTypeOfModelID] = useState<string>('');
    const [mainDesign, setMainDesign] = useState<DesignInterface>();
    const [expertTailoringList, setExpertTailoringList] = useState<ExpertTailoringInterface[]>();





    // ---------------Usable Variable---------------//
    const navigate = useNavigate();

    // ---------------UseEffect---------------//
    useEffect(() => {
        __handleGetExpertTailoringList();

    }, []);
    // ---------------FunctionHandler---------------//

    /**
     * Handle get expertTailoring list
     * @returns 
     */
    const __handleGetExpertTailoringList = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.expertTailoring + functionEndpoints.expertTailoring.getAllExpertTailoring}`);
            if (response.status === 200) {
                setExpertTailoringList(response.data);
                __handleGetMaterialInformation(response.data);
            }
            else {
                return;
            }
        } catch (error) {
            console.log('error: ', error);
        }
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
            printType: mask.printType || "EMBROIDER"
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
            itemMask: transformItemMasks(part.itemMasks || [])
        }));
    };

    /**
     * Get Design data after choose material
     * @param item 
     */
    const __handleGetMaterialInformation = async (epxertList: ExpertTailoringInterface[]) => {

        const userCookie = Cookies.get('userAuth');
        if (userCookie) {
            const userParse: UserInterface = JSON.parse(userCookie);
            setUserAuth(userParse);

            const exertTailoring = epxertList?.find((item) => item.expertTailoringName === 'shirtModel')
            const bodyRequest: Design = {
                userID: userParse?.userID || '',
                expertTailoringID: exertTailoring?.expertTailoringID,
                titleDesign: "test TitleDesign",
                publicStatus: true,
                imageUrl: '',
                color: "",
                minWeight: 0.2,
                maxWeight: 0.4,
                partOfDesign: [
                    {
                        partOfDesignName: "LOGO_PART",
                        imageUrl: "/src/assets/clothes/shirt-front-design.png",
                        successImageUrl: "",
                        materialID: "",
                        width: 60,
                        height: 80,
                        itemMask: []
                    },
                    {
                        partOfDesignName: "FRONT_CLOTH_PART",
                        imageUrl: "/src/assets/clothes/shirt-front-design.png",
                        successImageUrl: "",
                        materialID: "",
                        width: 60,
                        height: 80,
                        itemMask: []
                    },
                    {
                        partOfDesignName: "BACK_CLOTH_PART",
                        imageUrl: "/src/assets/clothes/shirt-back-design.png",
                        successImageUrl: "",
                        materialID: "",
                        width: 60,
                        height: 80,
                        itemMask: []
                    },
                    {
                        partOfDesignName: "SLEEVE_CLOTH_PART",
                        imageUrl: "/src/assets/clothes/shirt-front-design.png",
                        successImageUrl: "",
                        materialID: "",
                        width: 15,
                        height: 20,
                        itemMask: []
                    }
                ]
            };

            console.log('bodyRequest: ', bodyRequest);
            __handleCreateDesign(bodyRequest);
        }
    }

    /**
* Handle Create design
* @param item 
*/
    const __handleCreateDesign = async (mainDesign: DesignInterface) => {

        if (!mainDesign) return;
        setIsLoadingPage(true);
        try {
            const response = await api.post(`${versionEndpoints.v1 + `/` + featuresEndpoints.design + functionEndpoints.design.addNewDesign}`, mainDesign);
            if (response.status === 200) {
                setTimeout(() => {
                    setIsLoadingPage(false);
                    navigate(`/design/${response.data.designID}`)
                }, 3000);

            } else {
                setIsLoadingPage(false);
            }
        } catch (error) {
            console.log('error: ', error);
            setIsLoadingPage(false);


        }


    }

    return (
        <div>
            <LoadingComponent isLoading={true} title='Setting' containerStyle={{ backgroundColor: whiteColor }}></LoadingComponent>
        </div>
    );
};



export default CreateDesignComponent;