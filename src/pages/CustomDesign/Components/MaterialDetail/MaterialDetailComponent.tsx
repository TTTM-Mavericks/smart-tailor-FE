import React, { useEffect, useState } from 'react';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../../models/DesignModel';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import style from './MaterialDetailStyle.module.scss'
import { useTranslation } from 'react-i18next';
import { Autocomplete, Popper, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { grayColor1, primaryColor, redColor, secondaryColor, whiteColor } from '../../../../root/ColorSystem';
import { ToastContainer, toast } from 'react-toastify';


type materialDetailProps = {
    partOfDesigndata?: PartOfDesignInterface[];
    primaryKey?: any
}

interface PrinTypeInterface {
    lable: string,
    value: string,
}

interface ItemMaskMaterial {
    itemMaskID: any;
    printType: {
        printTypeValue: string;
        material: string;
    }
}

const names = [
    'chỉ đỏ',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const CustomPaper = styled('div')(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
        backgroundColor: whiteColor,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: '100%',
        border: `1px solid ${grayColor1}`,
        fontSize: '12px',
        '&::-webkit-scrollbar': {
            width: '0.3em',
            borderRadius: '5px',
            backgroundColor: grayColor1
        },
        '&::-webkit-scrollbar-track': {
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
            borderRadius: '5px',
            backGroundColor: grayColor1
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#7b7b7b',
            borderRadius: '5px'
        },
    },
}));

const CustomPopper = (props: any) => {
    return <Popper {...props} placement="bottom-start" />;
};

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '35px',
        width: '250px',
        borderRadius: '8px',
        outline: 'none',
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px', // Adjust font size of the label
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: primaryColor, // Label color when focused
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: `1.5px solid ${primaryColor}`, // Initial border color
        },
        '&:hover fieldset': {
            border: `1.5px solid ${primaryColor}`, // Border color on hover,
            color: primaryColor
        },
        '&.Mui-focused fieldset': {
            border: `1.5px solid ${primaryColor}`, // Border color when focused
        },
    },
}));


const MaterialDetailComponent: React.FC<materialDetailProps> = ({ partOfDesigndata, primaryKey }) => {
    // TODO MUTIL LANGUAGE
    // ---------------UseState Variable---------------//
    const [selectedColors, setSelectedColors] = useState<any>([]);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
    const [itemMaskData, setItemMaskData] = useState<ItemMaskInterface[] | undefined>();
    const [selectedMaterials, setSelectedMaterials] = useState<ItemMaskMaterial[]>([]);
    const [materialItem, setMaterialItem] = useState<string>('');
    const [inputValueMaterialItem, setInputValueMaterialItem] = useState<string>('');
    const [data, setData] = useState<PartOfDesignInterface[]>();
    const [printTypeMaterial, setPrintTypeMaterial] = useState<{ itemId: string, partName: string, type: string, material: string }[]>([]);
    const [selectedItemMask, setSelectedItemMask] = useState<{ partOfDesignId: any, itemMask: ItemMaskInterface }>();
    const [selectedPartOfDesign, setSelectedPartOfDesign] = useState<PartOfDesignInterface | undefined>();
    const [inputValueFabric, setInputValueFabric] = React.useState<string>('');
    const [fabric, setFabric] = React.useState<{ partId: any, fabric: string }[]>([]);
    const [thread, setThread] = React.useState<string>('');
    const [inputValueThread, setInputValueThread] = React.useState<string>('');

    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();
    const printType: PrinTypeInterface[] = [
        {
            lable: t(codeLanguage + '000212'),
            value: 'MANUAL_PRINT'
        },
        {
            lable: t(codeLanguage + '000213'),
            value: 'HEAT_PRINT'
        },
        {
            lable: t(codeLanguage + '000214'),
            value: 'EMBORIDER'
        },


    ]
    // ---------------UseEffect---------------//

    React.useEffect(() => {
        console.log(selectedItemMask, ' - ', selectedPartOfDesign);
    }, [selectedItemMask, selectedPartOfDesign]);

    useEffect(() => {
        partOfDesigndata && setSelectedPartOfDesign(partOfDesigndata[0]);
    }, [partOfDesigndata])

    React.useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);

    }, [selectedLanguage, i18n]);

    React.useEffect(() => {
        if (selectedLanguage) {
            const uppercase = selectedLanguage.toUpperCase();
            setCodeLanguage(uppercase);
        }

    }, [selectedLanguage]);

    React.useEffect(() => {
        setData(partOfDesigndata);
    }, [partOfDesigndata]);

    useEffect(() => {
        if (!names.includes(inputValueMaterialItem)) return;
        setData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((partItem: PartOfDesignInterface) => {
                if (partItem.partOfDesignID === selectedPartOfDesign?.partOfDesignID) {
                    const itemData = partItem.itemMasks?.map((itemMask: ItemMaskInterface) => {
                        if (itemMask.itemMaskID === selectedItemMask?.itemMask.itemMaskID) {
                            return {
                                ...itemMask,
                                itemMaterial: {
                                    itemMaterialID: printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material
                                },
                                materialID: printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material
                            };
                        }
                        return itemMask;
                    });
                    setItemMaskData(itemData);
                    return {
                        ...partItem,
                        itemMasks: itemData,
                    };

                }
                return partItem;
            });
        });
    }, [inputValueMaterialItem, materialItem, selectedItemMask, selectedPartOfDesign]);

    useEffect(() => {
        console.log('11111111111111', data);
    }, [data]);

    useEffect(() => {
        if (!selectedPartOfDesign) return;

        setData((prevData) => {
            if (!prevData) return prevData;

            return prevData.map((partItem: PartOfDesignInterface) => {
                if (partItem.partOfDesignID === selectedPartOfDesign.partOfDesignID) {
                    return {
                        ...partItem,
                        materialID: fabric.find((item) => item.partId === selectedPartOfDesign.partOfDesignID)?.fabric || '',
                    };
                }
                return partItem;
            });
        });
    }, [selectedPartOfDesign, fabric]);

    useEffect(() => {
        setPrintTypeMaterial((prevFabric) => {
            const existingPart = prevFabric.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID);
            if (existingPart) {
                return prevFabric.map((item) =>
                    item.itemId === selectedItemMask?.itemMask.itemMaskID ? { ...item, material: materialItem } : item
                );
            } else {
                return [...prevFabric];
            }
        });
    }, [materialItem])

    // ---------------FunctionHandler---------------//

    /* Handles the change event for a checkbox, updating the state based on whether the value is currently selected.
    * @param {Function} setState - The state setter function for the selected values.
    * @param {any} value - The value of the checkbox that was changed.
    */
    const __handleCheckboxChange = (
        item: ItemMaskInterface,
        value: any,
        part: PartOfDesignInterface | undefined
    ) => {
        setData((prevData) => {
            if (!prevData) return prevData;

            return prevData.map((partItem: PartOfDesignInterface) => {
                if (partItem.partOfDesignID === part?.partOfDesignID) {
                    return {
                        ...partItem,
                        itemMasks: partItem.itemMasks?.map((itemMask: ItemMaskInterface) => {
                            if (itemMask.itemMaskID === item.itemMaskID) {
                                return {
                                    ...itemMask,
                                    printType: value
                                };
                            }
                            return itemMask;
                        })
                    };
                }
                return partItem;
            });
        });
        const prinTypeMaterialData = { itemId: item.itemMaskID, partName: part?.partOfDesignName, type: value, material: materialItem }
        __handleUpdatePrintTypeMaterial(prinTypeMaterialData);
    };

    const __handleUpdatePrintTypeMaterial = (printTypeData: any) => {
        setPrintTypeMaterial((prevFabric) => {
            const existingPart = prevFabric.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID);
            if (existingPart) {
                return prevFabric.map((item) =>
                    item.itemId === selectedItemMask?.itemMask.itemMaskID ? { ...item, type: printTypeData.type } : item
                );
            } else {
                return [...prevFabric, printTypeData];
            }
        });
    }

    const __handleSetlectedItemMask = (item: ItemMaskInterface, part: PartOfDesignInterface) => {
        setSelectedItemMask({ itemMask: item, partOfDesignId: part.partOfDesignID });
        setSelectedPartOfDesign(part);
    }

    const __handleApplyAllMaterialForItemMask = () => {
        try {
            setData((prevData) => {
                if (!prevData) return prevData;
                return prevData.map((partItem: PartOfDesignInterface) => {
                    return {
                        ...partItem,
                        itemMasks: partItem.itemMasks?.map((itemMask: ItemMaskInterface) => {
                            return {
                                ...itemMask,
                                printType: printTypeMaterial.find((item) => item.itemId === itemMask.itemMaskID)?.type || selectedItemMask?.itemMask.printType,
                                itemMaterial: {
                                    itemMaterialID: inputValueMaterialItem,
                                },
                            };
                        }),
                    };
                });
            });
            toast.success(`Apply all successfully`, { autoClose: 3000 });
        } catch (error) {
            toast.error(`Error: ${error}`, { autoClose: 3000 });
        }

    }

    const __handleApplyAllMaterialForPartOfDesign = () => {

    }

    const __handleChangeFabric = (value: string) => {
        setFabric((prevFabric) => {
            const existingPart = prevFabric.find((item) => item.partId === selectedPartOfDesign?.partOfDesignID);

            if (existingPart) {
                return prevFabric.map((item) =>
                    item.partId === selectedPartOfDesign?.partOfDesignID ? { ...item, fabric: value } : item
                );
            } else {
                return [...prevFabric, { partId: selectedPartOfDesign?.partOfDesignID, fabric: value }];
            }
        });
    }

    const __handleChangeMaterialPrintType = (value: string) => {
        setPrintTypeMaterial((prevFabric) => {
            const existingPart = prevFabric.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID);
            if (existingPart) {
                return prevFabric.map((item) =>
                    item.itemId === selectedItemMask?.itemMask.itemMaskID ? { ...item, material: value } : item
                );
            } else {
                return [...prevFabric];
            }
        });
    }
    return (
        <div>
            <ToastContainer />
            <form className={`${style.materialDetail__container}`} style={primaryKey === 'DIALOG' ? { display: 'flex' } : {}} >
                <div className={`${style.materialDetail__container__itemMaskArea}`} style={primaryKey === 'DIALOG' ? { paddingRight: '10px', height: 350, overflow: 'auto' } : {}}>
                    {data?.map((part: PartOfDesignInterface, key) => (
                        <Disclosure onClick={() => setSelectedPartOfDesign(part)} key={key} as="div" className={`border-t border-gray-200 px-4 py-6 ${style.materialDetail__content} `}>
                            {({ open }) => (
                                <>
                                    <h3 className="-mx-2 -my-6 flow-root">
                                        <Disclosure.Button className="flex w-full items-center  px-2 py-3 text-gray-400">
                                            <img src={part.imgUrl}></img>
                                            <div style={{ width: '90%', textAlign: 'left', marginLeft: 20 }}>
                                                <span className="font-medium text-gray-900">{part.partOfDesignName}</span>
                                            </div>
                                            <span>
                                                {open ? (
                                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                ) : (
                                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                )}
                                            </span>
                                        </Disclosure.Button>
                                    </h3>
                                    <Disclosure.Panel className="pt-6" >
                                        <div >
                                            {part?.itemMasks?.map((item, optionIdx) => (
                                                <Disclosure
                                                    key={optionIdx}
                                                    style={{ border: item.itemMaskID === selectedItemMask?.itemMask.itemMaskID && selectedItemMask?.partOfDesignId === selectedPartOfDesign?.partOfDesignID ? `1.5px solid ${primaryColor}` : 'none', borderRadius: 8 }}
                                                    onClick={() => __handleSetlectedItemMask(item, part)}
                                                    as="div"
                                                    className={`py-1 border-t border-gray-200 px-4 ${style.materialDetail__content}`}>
                                                    {({ open }) => (
                                                        <>
                                                            <h3 className="-mx-2 flow-root">
                                                                <Disclosure.Button
                                                                    className={`flex w-full items-center px-2 text-gray-400 ${style.materialDetail__content__button}`}
                                                                >
                                                                    <img src={item.imageUrl}></img>
                                                                    <div style={{ width: '90%', textAlign: 'left', marginLeft: 20 }}>
                                                                        <span className="font-medium text-gray-900">{item.itemMaskName}</span>
                                                                    </div>
                                                                    <span>
                                                                        {primaryKey !== 'DIALOG' && (
                                                                            <div>
                                                                                {open ? (
                                                                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                                ) : (
                                                                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </span>
                                                                </Disclosure.Button>
                                                            </h3>
                                                            {primaryKey !== 'DIALOG' && (
                                                                <Disclosure.Panel className="pt-6">
                                                                    {printType.map((type) => (
                                                                        <div className={`flex ${style.materialDetail__content__itemMask} `}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                                                                <input
                                                                                    id={`filter-mobile-${type.value}-${optionIdx}`}
                                                                                    name={`${type.lable}[]`}
                                                                                    defaultValue={type.value}
                                                                                    type="checkbox"
                                                                                    checked={selectedColors.includes(type.value)}
                                                                                // onChange={() => __handleCheckboxChange(item, type.value)}
                                                                                />
                                                                                <div style={{ width: 100, fontSize: 14 }}>
                                                                                    <label
                                                                                        htmlFor={`filter-mobile-${type.value}`}
                                                                                        className="ml-2 min-w-0 flex-1 text-gray-500"
                                                                                    >
                                                                                        {type.lable}
                                                                                    </label>
                                                                                </div>

                                                                                <div>
                                                                                    <Autocomplete
                                                                                        id="tags-outlined"
                                                                                        options={names}
                                                                                        getOptionLabel={(option) => option}
                                                                                        filterSelectedOptions
                                                                                        value={printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material === materialItem ? materialItem : 'Material'}
                                                                                        onChange={(event, newValue) => {
                                                                                            newValue && setMaterialItem(newValue);
                                                                                        }}
                                                                                        inputValue={printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material === materialItem ? materialItem : 'Material'}
                                                                                        onInputChange={(event, newValue) => {
                                                                                            setInputValueMaterialItem(newValue);
                                                                                        }}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                variant="outlined"
                                                                                                label="Material"
                                                                                                size='small'
                                                                                                InputLabelProps={{ size: 'small' }}
                                                                                            />
                                                                                        )}
                                                                                        PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
                                                                                        PopperComponent={CustomPopper}
                                                                                        style={{ width: '100%' }}

                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    ))}
                                                                </Disclosure.Panel>
                                                            )

                                                            }
                                                        </>
                                                    )}
                                                </Disclosure>
                                            ))}
                                        </div>
                                    </Disclosure.Panel>

                                </>
                            )}
                        </Disclosure>

                    ))}
                </div>

                <div style={{ marginTop: -20 }}>
                    {selectedPartOfDesign ? (
                        <div style={{ paddingLeft: 20 }}>
                            <span style={{ fontSize: 12, fontWeight: '500' }}>{selectedPartOfDesign.partOfDesignName}</span>
                            <a onClick={() => __handleApplyAllMaterialForItemMask()} style={{ fontSize: 11, fontWeight: '500', color: secondaryColor, cursor: 'pointer', float: 'right' }}>Apply all items</a>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
                                <div style={{ width: 100, fontSize: 14 }}>
                                    <label
                                        className="ml-2 min-w-0 flex-1 text-gray-500"
                                        style={{ fontSize: 11 }}
                                    >
                                        Fabric
                                    </label>
                                </div>
                                <Autocomplete
                                    id="tags-outlined"
                                    options={names}
                                    getOptionLabel={(option) => option}
                                    filterSelectedOptions
                                    value={fabric.find((item) => item.partId === selectedPartOfDesign.partOfDesignID)?.fabric || 'Fabric'}
                                    onChange={(event, newValue) => {
                                        newValue && __handleChangeFabric(newValue);
                                    }}
                                    inputValue={fabric?.find((item) => item.partId === selectedPartOfDesign.partOfDesignID)?.fabric}
                                    onInputChange={(event, newValue) => {
                                        setInputValueFabric(newValue);
                                    }}
                                    style={{ marginBottom: 10, marginTop: 5, marginLeft: 10 }}
                                    size='small'
                                    renderInput={(params) => (
                                        <CustomTextField
                                            {...params}
                                            variant="outlined"
                                            label="Fabric"
                                            size='small'
                                            className={`${style.dialog__content__modelMaterialArea__material__formControl__textField}`}
                                        />
                                    )}
                                    PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
                                    PopperComponent={CustomPopper}

                                />
                            </div>

                        </div>
                    ) : (
                        <div style={{ paddingLeft: 20, marginTop: 20 }}>
                            <span style={{ fontSize: 12, fontWeight: '500', textAlign: 'center', color: redColor }}>Select an item mask</span>
                        </div>
                    )}

                    {primaryKey === 'DIALOG' && selectedItemMask && (
                        <div style={{ paddingLeft: 20, marginTop: 20 }}>

                            <div style={{ marginBottom: 10, marginTop: 20 }} >
                                <span style={{ fontSize: 12, fontWeight: '500' }}>Print type</span>
                                <a onClick={() => __handleApplyAllMaterialForItemMask()} style={{ fontSize: 11, fontWeight: '500', float: 'right', color: secondaryColor, paddingLeft: 120, cursor: 'pointer' }}>Apply all items</a>
                            </div>
                            {printType.map((type) => (
                                <div className={`${style.materialDetail__content__itemMask} `}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                        <input
                                            id={`filter-mobile-${type.value}`}
                                            name={`${type.lable}[]`}
                                            defaultValue={type.value}
                                            type="checkbox"
                                            checked={printTypeMaterial.find((item) => item.itemId === selectedItemMask.itemMask.itemMaskID)?.type === type.value}
                                            onChange={() => __handleCheckboxChange(selectedItemMask.itemMask, type.value, selectedPartOfDesign)}
                                        />
                                        <div style={{ width: 100, fontSize: 14 }}>
                                            <label
                                                htmlFor={`filter-mobile-${type.value}`}
                                                className="ml-2 min-w-0 flex-1 text-gray-500"
                                                style={{ fontSize: 11 }}
                                            >
                                                {type.lable}
                                            </label>
                                        </div>

                                        <div>
                                            <Autocomplete
                                                id="tags-outlined"
                                                options={names}
                                                // hidden={printTypeMaterial?.type !== type.value}
                                                getOptionLabel={(option) => option}
                                                filterSelectedOptions
                                                value={printTypeMaterial.find((item) => item.itemId === selectedItemMask.itemMask.itemMaskID)?.type === type.value ? printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material : 'Material'}
                                                onChange={(event, newValue) => {
                                                    newValue && __handleChangeMaterialPrintType(newValue);
                                                }}
                                                inputValue={printTypeMaterial.find((item) => item.itemId === selectedItemMask.itemMask.itemMaskID)?.type === type.value ? printTypeMaterial?.find((item) => item.itemId === selectedItemMask?.itemMask.itemMaskID)?.material : 'Material'}
                                                onInputChange={(event, newValue) => {
                                                    setInputValueMaterialItem(newValue);
                                                }}
                                                disabled={printTypeMaterial.find((item) => item.itemId === selectedItemMask.itemMask.itemMaskID)?.type !== type.value}
                                                renderInput={(params) => (
                                                    <CustomTextField
                                                        {...params}
                                                        variant="outlined"
                                                        label="Material"
                                                        size='small'
                                                        InputLabelProps={{ size: 'small' }}
                                                        disabled={printTypeMaterial.find((item) => item.itemId === selectedItemMask.itemMask.itemMaskID)?.type !== type.value}
                                                    />
                                                )}
                                                PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
                                                PopperComponent={CustomPopper}

                                            />
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    )
                    }
                </div>
            </form>
        </div >
    );
};



export default MaterialDetailComponent;