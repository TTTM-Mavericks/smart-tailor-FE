import React, { useEffect, useRef, useState } from 'react';
import styles from './DesignCollectionStyle.module.scss';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import { Listbox, Transition } from '@headlessui/react';
import { FaAngleDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserInterface } from '../../../models/UserModel';
import Cookies from 'js-cookie';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { DesignInterface } from '../../../models/DesignModel';
import { toast, ToastContainer } from 'react-toastify';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { primaryColor } from '../../../root/ColorSystem';
import FooterComponent from '../../../components/Footer/FooterComponent';





const CardDesignComponent: React.FC<{ design: DesignInterface }> = ({ design }) => {
    return (
        <div key={design.designID} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" style={{width: 200, height: 250}}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden" style={{width: 200, height: 250}}>
                <img src={design.imageUrl} alt={design.titleDesign} className="w-full h-32 sm:h-48 object-cover" />
                <div className="p-4">
                    <h3 className="text-gray-900 font-bold text-lg">{design.titleDesign}</h3>
                    {/* <p className="text-gray-600">{design}</p> */}
                </div>
            </div>
        </div>
    );
}


const DesignCollectionScreen = () => {

    // TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [selectedOwner, setSelectedOwner] = React.useState('Owner');
    const [selectedCategory, setSelectedCategory] = React.useState('Category');
    const [selectedDate, setSelectedDate] = React.useState('Modify date');
    const [selectedRelevance, setSelectedRelevance] = React.useState('Liên quan nhất');
    const [activeTab, setActiveTab] = useState('All');
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [designList, setDesignList] = useState<DesignInterface[]>();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isEnd, setIsEnd] = useState(false)

    // ---------------Usable Variable---------------//
    const tabs = ['All', 'Folder', 'Design'];
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // ---------------UseEffect---------------//

    ;

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setIsScrolled(scrollLeft > 0);
            setIsEnd(scrollLeft + clientWidth >= scrollWidth);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    useEffect(() => {
        const userCookie = Cookies.get('userAuth');
        if (userCookie) {
            const userParse: UserInterface = JSON.parse(userCookie);
            setUserAuth(userParse);
        }
    }, []);

    useEffect(() => {
        if (userAuth) {
            __handleFetchDesignListByUserId();

        }
    }, [userAuth])

    // ---------------FunctionHandler---------------//

    const __handleFetchDesignListByUserId = async () => {
        setIsloading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + '/' + featuresEndpoints.design + functionEndpoints.design.getAllDesignByUserID}/${userAuth?.userID}`);
            if (response.status === 200) {
                setDesignList(response.data)
                setIsloading(false);
            } else {
                toast.error(`${response.message}`, { autoClose: 4000 })
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            setIsloading(false);
            toast.error(`${error}`, { autoClose: 4000 })
        }
    }



    const renderDropdown = (selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>) => (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
                <Listbox.Button className={`${styles.button} flex items-center`}>
                    {selected}
                    <FaAngleDown className="ml-2 w-4 h-4" aria-hidden="true" />
                </Listbox.Button>
                <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {options.map((option, idx) => (
                            <Listbox.Option
                                key={idx}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}`
                                }
                                value={option}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-amber-600' : 'text-amber-600'}`}>
                                                {/* <CheckIcon className="w-5 h-5" aria-hidden="true" /> */}
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );


    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <ToastContainer></ToastContainer>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            <div className={`${styles.designCollection__container}`}>
                <aside className={`${styles.designCollection__container__menuBer}`}>
                    <div className="sticky top-20 p-4 text-sm border-r border-gray-200 h-full mt-10">
                        <nav className="flex flex-col gap-3">
                            <a href="/auth/profilesetting" className="px-4 py-3 font-semibold text-orange-900 bg-white border border-orange-100 rounded-lg hover:bg-orange-50">
                                Account Settings
                            </a>
                            <a href="#" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Notifications
                            </a>
                            <a href="/order_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Order History
                            </a>
                        </nav>
                    </div>
                </aside>
                <div className={`${styles.designCollection__container__groupItem}`}>

                    <div className={`${styles.designCollection__container__gradientBackground}`}>
                        <p className={styles.textStyle}>Designs</p>
                    </div>

                    <div className='mt-10'>
                        <div className="flex space-x-4">
                            {renderDropdown(selectedOwner, setSelectedOwner)}
                            {renderDropdown(selectedCategory, setSelectedCategory)}
                            {renderDropdown(selectedDate, setSelectedDate)}
                            <div className="flex space-x-2">
                                {renderDropdown(selectedRelevance, setSelectedRelevance)}
                                <div className={`${styles.button} flex items-center`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                            </div>
                            <div className={`${styles.button} flex items-center`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="ml-2">Add new</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-5">
                        {tabs.map(tab => (
                            <div
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-5" style={{width:'fit-content'}}>
                        <h2 className="text-2xl font-bold mb-4">Recent design</h2>
                    </div>
                    <div className="relative mt-5 w-full" >
                        <div className={`flex space-x-4 overflow-x-auto ${styles.scroll__container}`} ref={scrollContainerRef}>
                            {designList?.map((design, index) => (
                                <CardDesignComponent key={design.designID} design={design} />
                            ))}
                        </div>
                        {!isEnd && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                <button
                                    onClick={scrollRight}
                                >
                                    <FaArrowRight color={primaryColor} size={25} />
                                </button>
                            </div>
                        )}
                        {isScrolled && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                                <button
                                    onClick={scrollLeft}
                                >
                                    <FaArrowLeft color={primaryColor} size={25} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div>

    );
};

export default DesignCollectionScreen;
