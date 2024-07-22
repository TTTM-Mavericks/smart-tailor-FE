import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CustomerProfile, District, Location, Ward } from '../../../models/CustomerProfileModel';
import style from './OrderProductStyle.module.scss'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import { FaCheckCircle } from "react-icons/fa";
import VNLocationData from '../../../locationData.json'
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../models/UserModel';

const isProfileDataComplete = (profileData: CustomerProfile): boolean => {
    // return Object.values(profileData).every(value => value !== '');
    return true;
}

type ChangeAddressDialogComponentProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelectedAddressData: (adress: any) => void;
}

const ChangeAddressDialogComponent: React.FC<ChangeAddressDialogComponentProps> = ({ isOpen, onClose, onSelectedAddressData }) => {
    // TODO MUTIL LANGUAGE
    // ---------------UseState Variable---------------//
    const user = Cookies.get('userAuth');
    let userParse: UserInterface | null = null;
    if (user) {
        userParse = JSON.parse(user);
    }
    const [open, setOpen] = React.useState(false);
    const [locations, setLocations] = React.useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = React.useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
    const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null);
    const [selectedAddressEditor, setSelectedAddressEditor] = React.useState<any>();
    const [selectedAddress, setSelectedAddress] = React.useState<any>(1);
    const [addressList, setAddressList] = React.useState<any>([]);
    const [selectAddIcon, setSelectAddicon] = React.useState<boolean>(false);
    const [profileData, setProfileData] = React.useState<CustomerProfile>({
        email: userParse ? userParse.email : '',
        fullName: userParse ? userParse.fullName : '',
        phoneNumber: userParse ? userParse.phoneNumber : '',
        imageUrl: '',
        gender: true,
        dateOfBirth: '',
        address: '',
        province: '',
        district: '',
        ward: ''
    });
    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//

    /**
     * Set default address when dialog init
     */
    React.useEffect(() => {
        const addressLocalHost = localStorage.getItem('addressList');
        if (addressLocalHost) {
            const addressLocalHostParse = JSON.parse(addressLocalHost)
            console.log(isOpen);
            setAddressList(addressLocalHostParse);

            const address = addressLocalHostParse.find((item: any) => item.id === selectedAddress);
            if (address) {
                setProfileData(address);
                onSelectedAddressData(address);
                console.log(address);
            }
        }
    }, [isOpen])

    /**
     * Binding selected address
     */
    React.useEffect(() => {
        if (!onSelectedAddressData) return;
        const address = addressList.find((item: any) => item.id === selectedAddress);
        if (address) {
            onSelectedAddressData(address);
        }
    }, [selectedAddress])

    /**
     * Set address list
     */
    // React.useEffect(() => {
    //     setAddressList(sampleAddressData);
    // }, [sampleAddressData]);

    /**
     * Set change open dialog state
     */
    React.useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    /**
     * Init adding address data
     */
    React.useEffect(() => {
        if (selectAddIcon) setProfileData({
            email: userParse ? userParse.email : 'example@gmail.com',
            fullName: '',
            phoneNumber: '',
            imageUrl: '',
            gender: true,
            dateOfBirth: '',
            address: '',
            province: '',
            district: '',
            ward: ''
        });
    }, [selectAddIcon])

    /**
     * Get the location of the api and set it to dropdown
     */
    React.useEffect(() => {
        if (VNLocationData) {
            setLocations(VNLocationData);
            const initialProvince = VNLocationData.find(location => location.Name === profileData.province) as Location;
            setSelectedProvince(initialProvince || null);

            if (initialProvince) {
                const initialDistrict = initialProvince.Districts.find(district => district.Name === profileData.district) as District;
                setSelectedDistrict(initialDistrict || null);

                if (initialDistrict) {
                    const initialWard = initialDistrict.Wards.find(ward => ward.Name === profileData.ward) as Ward;
                    setSelectedWard(initialWard || null);
                }
            }
        } else {
            console.error("Không tìm thấy dữ liệu địa chỉ");
        }
    }, [profileData]);

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Tracking the fields to update
     */
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldValue = name === 'gender' ? (value === 'true') : value;

        setProfileData({ ...profileData, [name]: fieldValue });
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

    /**
     * Handle edit address
     * @param id 
     */
    const __handleEditAddress = (id: any) => {
        setSelectedAddressEditor(id);
        if (selectedAddressEditor === id) {
            setSelectedAddressEditor(null);

        }
        setSelectAddicon(false);
        const address = addressList.find((item: any) => item.id === id);
        if (address) {
            setProfileData(address);
        }
    }

    const __handleClearSelected = () => {
    }

    /**
     * Handle selected address
     * @param id 
     */
    const __handleSelectedAddress = (id: any) => {
        setSelectedAddress(id);
    }

    /**
     * Handle remove a address from list
     * @param id 
     */
    const __handleRemoveOutAddressList = (id: any) => {
        const updatedList = addressList.filter((address: any) => address.id !== id);
        setAddressList(updatedList);
        localStorage.setItem('addressList', JSON.stringify(updatedList));

    }

    /**
     * Handle add new address into list
     */
    const __handleAddToAddressList = () => {
        if (isProfileDataComplete(profileData)) {
            const updatedList = [...addressList, { ...profileData, id: addressList.length + 1 }];
            setAddressList(updatedList);
            localStorage.setItem('addressList', JSON.stringify(updatedList));
            setSelectedAddress(addressList.length + 1);
            toast.success(`Add new successful`, { autoClose: 4000 });
            setSelectAddicon(false);
        } else {
            toast.error('Please fill in all fields before adding the address.', { autoClose: 4000 });
        }
    };

    /**
     * Handle update an address
     * @param id 
     */
    const __handleUpdateAddress = (id: any) => {
        console.log(id);

        const updatedList = addressList.map((address: any) =>
            id === address.id ? { ...profileData, id: id } : address
        );
        setAddressList(updatedList);
        localStorage.setItem('addressList', JSON.stringify(updatedList));
        toast.success(`Update successfull`, { autoClose: 4000 });
    }

    return (
        <>
            <Dialog
                open={open}
                className={`${style.changeAddressDialogContainer}`}
            >

                <DialogTitle style={{ width: 600 }}>
                    Choose address
                </DialogTitle>
                <DialogContent onClick={() => __handleClearSelected()} className={`${style.changeAddressDialogContent}`}>
                    {addressList.map((address: any, index: number) => (
                        <div onClick={() => __handleSelectedAddress(address.id)} key={index} className={`${style.changeAddressDialogContent__adressItem} `}>
                            <div>

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
                                <div onClick={() => __handleEditAddress(address.id)} className={`${style.changeAddressDialogContent__adressItem__iconGroup__icon}`} style={{ backgroundColor: secondaryColor }}>
                                    <MdEdit color={whiteColor} size={15} />
                                </div>
                                <div onClick={() => __handleRemoveOutAddressList(address.id)} className={`${style.changeAddressDialogContent__adressItem__iconGroup__icon}`} style={{ backgroundColor: redColor }}>
                                    <MdDelete color={whiteColor} size={15} />
                                </div>
                            </div>
                            {selectedAddress === address.id && (
                                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                    <FaCheckCircle size={20} color={greenColor}></FaCheckCircle>
                                </div>
                            )}

                            {selectedAddressEditor === address.id && (
                                <div className={`${style.changeAddressDialogContent}`}>
                                    <form className="mt-8 ">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                                    Your name
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
                                                    borderRadius: '4px',
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
                                                        borderRadius: '4px',
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
                                                        borderRadius: '4px',
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
                                        className="mt-3 px-5 py-2.5 text-sm font-medium text-white"
                                        style={{ backgroundColor: greenColor, borderRadius: 4, display: 'flex', }}
                                        onClick={() => __handleUpdateAddress(address.id)}
                                    >
                                        Update
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className={`${style.changeAddressDialogContent__addAddressBtn} `}>
                        {selectAddIcon === false && (
                            <div onClick={() => setSelectAddicon(true)} className={`${style.changeAddressDialogContent__addAddressBtn__iconAdd}`}>
                                <span>
                                    Add new
                                </span>
                            </div>
                        )}
                        {selectAddIcon === true && (
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
                                            onChange={_handleChange}
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
                                                borderRadius: '4px',
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
                                                    borderRadius: '4px',
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
                                                    borderRadius: '4px',
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
                                    style={{ backgroundColor: greenColor, borderRadius: 4, display: 'flex', }}
                                    onClick={() => __handleAddToAddressList()}
                                >
                                    Add new
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
                            style={{ backgroundColor: primaryColor, borderRadius: 4 }}
                            onClick={onClose}
                        >
                            Accept
                        </button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ChangeAddressDialogComponent