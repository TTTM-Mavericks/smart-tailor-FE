import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CustomerProfile, District, Location, Ward } from '../../../models/CustomerProfileModel';
import style from './OrderProductStyle.module.scss'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
const sampleAddressData = [
    {
        id: 1,
        email: "john.doe@example.com",
        fullName: "John Doe",
        phoneNumber: "0987654321",
        imageUrl: "https://example.com/images/johndoe.jpg",
        gender: true,
        dateOfBirth: "15-05-1995",
        address: "123 Main St",
        province: "Province A",
        district: "District B",
        ward: "Ward C"
    },
    {
        id: 2,
        email: "jane.smith@example.com",
        fullName: "Jane Smith",
        phoneNumber: "0123456789",
        imageUrl: "https://example.com/images/janesmith.jpg",
        gender: false,
        dateOfBirth: "20-08-1990",
        address: "456 Elm St",
        province: "Province X",
        district: "District Y",
        ward: "Ward Z"
    },
    {
        id: 3,
        email: "alice.wonderland@example.com",
        fullName: "Alice Wonderland",
        phoneNumber: "0223344556",
        imageUrl: "https://example.com/images/alice.jpg",
        gender: false,
        dateOfBirth: "05-12-1988",
        address: "789 Oak St",
        province: "Province M",
        district: "District N",
        ward: "Ward O"
    },
    {
        id: 4,
        email: "bob.builder@example.com",
        fullName: "Bob Builder",
        phoneNumber: "0556677889",
        imageUrl: "https://example.com/images/bob.jpg",
        gender: true,
        dateOfBirth: "10-02-1985",
        address: "101 Pine St",
        province: "Province J",
        district: "District K",
        ward: "Ward L"
    }
]


type ChangeAddressDialogComponentProps = {
    isOpen: boolean;
    onClose: () => void;
}

const ChangeAddressDialogComponent: React.FC<ChangeAddressDialogComponentProps> = ({ isOpen, onClose }) => {
    // TODO MUTIL LANGUAGE
    // ---------------UseState Variable---------------//
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = React.useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [selectedProvince, setSelectedProvince] = React.useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
    const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null);
    const [locations, setLocations] = React.useState<any[]>([]);
    const [selectedAddressEditor, setSelectedAddressEditor] = React.useState<any>();
    const [selectedAddress, setSelectedAddress] = React.useState<any>();
    const [addressList, setAddressList] = React.useState<any>([]);
    const [selectAddIcon, setSelectAddicon] = React.useState<boolean>(false);
    const [profileData, setProfileData] = React.useState<CustomerProfile>({
        email: "tammtse161087@fpt.edu.vn",
        fullName: 'Tam',
        phoneNumber: '0919477712',
        imageUrl: '',
        gender: true,
        dateOfBirth: '14-01-2002',
        address: '',
        province: '',
        district: '',
        ward: ''
    });
    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//

    React.useEffect(() => {
        setAddressList(sampleAddressData);
    }, [sampleAddressData])

    React.useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])


    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Tracking the fields to update
     */
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldValue = name === 'gender' ? (value === 'true') : name === 'dateOfBirth' ? formatDateString(value) : value;
        setProfileData({ ...profileData, [name]: fieldValue });
    };

    /**
     * 
     * @param e 
     * Make a change in the code
     */
    const _handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };


    /**
     * @param dateString
     * Format the date string from dd-MM-yyyy to yyyy-MM-dd
     */
    const formatDateString = (dateString: any): any => {
        const [dd, MM, yyyy] = dateString.split('-');
        return `${yyyy}-${MM}-${dd}`;
    };

    /**
     * 
     * @param event 
     * Update The province change
     */
    const _handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find((location) => location.Name === provinceName);
        setSelectedProvince(selectedProvince || null);
        setSelectedDistrict(null);
        setSelectedWard(null);

        setProfileData((prevFormData) => ({
            ...prevFormData,
            province: provinceName,
        }));
    };

    /**
     * 
     * @param event 
     * Update the District change
     * The district display when the province sellected
     */
    const _handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince?.Districts.find((district) => district.Name === districtName);
        setSelectedDistrict(selectedDistrict || null);
        setSelectedWard(null);

        setProfileData((prevFormData) => ({
            ...prevFormData,
            district: districtName,
        }));
    };

    /**
     * 
     * @param event 
     * Update the ward change
     * The ward display when the province and district sellected
     */
    const _handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = event.target.value;
        if (selectedDistrict) {
            const selectedWard = selectedDistrict.Wards.find((ward) => ward.Name === wardName);
            setSelectedWard(selectedWard || null);

            setProfileData((prevFormData) => ({
                ...prevFormData,
                ward: wardName,
            }));
        }
    };

    const __handleEditAddress = (id: any) => {
        setSelectedAddressEditor(id);
    }

    const __handleClearSelected = () => {
    }

    const __handleSelectedAddress = (id: any) => {
        setSelectedAddress(id);
    }

    const __handleRemoveOutAddressList = (id: any) => {
        const updatedList = addressList.filter((address: any) => address.id !== id);
        setAddressList(updatedList);
    }

    const __handleClose = () => {
        setOpen(false);
    };

    return (

        <Dialog
            open={open}
            onClose={() => onClose()}
            className={`${style.changeAddressDialogContainer}`}
        >

            <DialogTitle>
                Choose address
            </DialogTitle>
            <DialogContent onClick={() => __handleClearSelected()} className={`${style.changeAddressDialogContent}`}>
                {addressList.map((address: any, index: number) => (
                    <div onClick={() => __handleSelectedAddress(address.id)} key={index} className={`${style.changeAddressDialogContent__adressItem} `}>
                        <div>
                            {selectedAddress === address.id && (
                                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                    <FaCheckCircle size={20} color={greenColor}></FaCheckCircle>
                                </div>
                            )}
                            <div>
                                <span className={`${style.changeAddressDialogContent__adressItem__title}`}>Name: </span>
                                <span>{address.fullName}</span>
                            </div>
                            <div>
                                <span className={`${style.changeAddressDialogContent__adressItem__title}`}>Phone: </span>
                                <span>{address.phoneNumber}</span>
                            </div>

                            <div>
                                <span className={`${style.changeAddressDialogContent__adressItem__title}`}>Address: </span>
                                <span>{address.address}, {address.ward}, {address.district}, {address.province}</span>
                            </div>
                        </div>

                        <div className={`${style.changeAddressDialogContent__adressItem__iconGroup} `}>
                            <div onClick={() => __handleEditAddress(address.id)} className={`${style.changeAddressDialogContent__adressItem__iconGroup__icon}`} style={{ backgroundColor: greenColor }}>
                                <MdEdit color={whiteColor} size={20} />
                            </div>
                            <div onClick={() => __handleRemoveOutAddressList(address.id)} className={`${style.changeAddressDialogContent__adressItem__iconGroup__icon}`} style={{ backgroundColor: redColor }}>
                                <MdDelete color={whiteColor} size={20} />
                            </div>
                        </div>

                        {selectedAddressEditor === address.id && (
                            <div className={`${style.changeAddressDialogContent}`}>
                                <form className="mt-8 ">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                                Your first name
                                            </label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                placeholder="Your first name"
                                                name="fullName"
                                                value={profileData.fullName}
                                                onChange={_handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                                Your Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                id="phone_number"
                                                className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                                placeholder="Your phone number"
                                                name="phoneNumber"
                                                value={profileData.phoneNumber}
                                                onChange={_handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                                            placeholder="your.email@mail.com"
                                            name="email"
                                            value={profileData.email}
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Your address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Your address"
                                            name="address"
                                            value={profileData.address}
                                            onChange={_handleChange}
                                        />
                                    </div>
                                    <div>
                                        <select
                                            onChange={_handleProvinceChange}
                                            value={selectedProvince?.Name || ''}
                                            style={{
                                                padding: '10px',
                                                marginTop: '10px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                            }}
                                        >
                                            <option value="">Select Province</option>
                                            {locations.map((location) => (
                                                <option key={location.Name} value={location.Name}>
                                                    {location.Name}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedProvince && (
                                            <select
                                                onChange={_handleDistrictChange}
                                                value={selectedDistrict?.Name || ''}
                                                style={{
                                                    padding: '10px',
                                                    marginTop: '10px',
                                                    width: '100%',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                }}
                                            >
                                                <option value="">Select District</option>
                                                {selectedProvince.Districts.map((district) => (
                                                    <option key={district.Name} value={district.Name}>
                                                        {district.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {selectedDistrict && (
                                            <select
                                                onChange={_handleWardChange}
                                                value={selectedWard?.Name || ''}
                                                style={{
                                                    padding: '10px',
                                                    marginTop: '10px',
                                                    width: '100%',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                }}
                                            >
                                                <option value="">Select Ward</option>
                                                {selectedDistrict.Wards.map((ward) => (
                                                    <option key={ward.Name} value={ward.Name}>
                                                        {ward.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>


                                </form>
                            </div>
                        )}
                    </div>
                ))}
                <div onClick={() => setSelectAddicon(!selectAddIcon)} className={`${style.changeAddressDialogContent__addAddressBtn} `}>
                    {!selectAddIcon && (
                        <div className={`${style.changeAddressDialogContent__addAddressBtn__iconAdd}`}>
                            <span>
                                Add new
                            </span>
                        </div>
                    )}
                    {selectAddIcon && (
                        <div >
                            <form className="mb-4" style={{ backgroundColor: 'transparent' }}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                            Your first name
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Your first name"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={_handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                            Your Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Your phone number"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber}
                                            onChange={_handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                                        placeholder="your.email@mail.com"
                                        name="email"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Your address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Your address"
                                        name="address"
                                        value={profileData.address}
                                        onChange={_handleChange}
                                    />
                                </div>
                                <div>
                                    <select
                                        onChange={_handleProvinceChange}
                                        value={selectedProvince?.Name || ''}
                                        style={{
                                            padding: '10px',
                                            marginTop: '10px',
                                            width: '100%',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <option value="">Select Province</option>
                                        {locations.map((location) => (
                                            <option key={location.Name} value={location.Name}>
                                                {location.Name}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedProvince && (
                                        <select
                                            onChange={_handleDistrictChange}
                                            value={selectedDistrict?.Name || ''}
                                            style={{
                                                padding: '10px',
                                                marginTop: '10px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                            }}
                                        >
                                            <option value="">Select District</option>
                                            {selectedProvince.Districts.map((district) => (
                                                <option key={district.Name} value={district.Name}>
                                                    {district.Name}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {selectedDistrict && (
                                        <select
                                            onChange={_handleWardChange}
                                            value={selectedWard?.Name || ''}
                                            style={{
                                                padding: '10px',
                                                marginTop: '10px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                            }}
                                        >
                                            <option value="">Select Ward</option>
                                            {selectedDistrict.Wards.map((ward) => (
                                                <option key={ward.Name} value={ward.Name}>
                                                    {ward.Name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>


                            </form>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white"
                                style={{ backgroundColor: primaryColor, borderRadius: 8, alignItems: 'flex-end' }}
                            >
                                Accept
                            </button>
                        </div>
                    )}
                </div>


            </DialogContent>
            <DialogActions>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        style={{ color: redColor }}
                        onClick={() => onClose()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor, borderRadius: 8 }}
                    >
                        Accept
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default ChangeAddressDialogComponent