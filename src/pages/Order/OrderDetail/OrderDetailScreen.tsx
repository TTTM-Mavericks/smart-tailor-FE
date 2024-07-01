import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import { IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { primaryColor } from '../../../root/ColorSystem';
import VerticalLinearStepperComponent from '../Components/ProgressBar/VerticalStepperComponent';
import style from './OrderDetailStyles.module.scss'

const OrderDetailScreen: React.FC = () => {

    // ---------------UseState---------------//
    const orderDetails = {
        orderNumber: 'W086438695',
        date: '2021-03-22',
        items: [
            {
                name: 'Distant Mountains Artwork Tee',
                price: '$36.00',
                description: 'You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?',
                imageUrl: 'https://via.placeholder.com/600',
                status: 'Processing'
            }
        ],
        billingAddress: 'Floyd Miles\n7363 Cynthia Pass\nToronto, ON N3Y 4H8',
        paymentInfo: {
            method: 'Credit Card',
            ending: '4242',
            expires: '02/24'
        },
        shippingUpdates: {
            email: 'tammt@gmail.com',
            phone: '9999999999'
        },
        progressSteps: [
            'Order placed',
            'Processing',
            'Shipped',
            'Delivered'
        ],
        currentStep: 1,
        currentStep1: 2,
        progressDate: 'March 24, 2021'
    };

    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

    // ---------------UseEffect---------------//

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // ---------------FunctionHandler---------------//

    /**
     * Scrolls the window to the top smoothly.
     */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /**
     * Handle cancel order click
     */
    const _handleCancelOrder = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to cancel the order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Cancelled!',
                    'Your order has been cancelled.',
                    'success'
                )
            }
        })
    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <div className={`${style.orderDetail__container}`} >
            <HeaderComponent />
            <div className={`${style.orderDetail__container__group}`} style={{marginTop: '2%', marginBottom: '10%'}}>
                <div className={`${style.orderDetail__container__group__stepper}`}>
                    <VerticalLinearStepperComponent></VerticalLinearStepperComponent>
                </div>
                <div className={`${style.orderDetail__container__detail} px-12 bg-white`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h6 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">{t(codeLanguage + '000191')}</h6>
                        <a href="/order_history" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200">{t(codeLanguage + '000192')} &rarr;</a>
                    </div>
                    <div className="border-b pb-4 mb-6">
                        <p className="text-sm text-gray-700">
                            <span className="font-normal text-gray-600">{t(codeLanguage + '000193')}:</span> <span style={{ fontWeight: "bolder" }}>{orderDetails.orderNumber}</span> &middot; {orderDetails.date}
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start mb-6">
                        <img src='https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg' alt={orderDetails.items[0].name} className="w-40 h-50 object-cover rounded-md shadow-md mb-4 md:mb-0" />
                        <div className="md:ml-6">
                            <h2 className="text-1xl font-semibold text-gray-900">{orderDetails.items[0].name}</h2>
                            <p className="text-sm text-gray-700">{orderDetails.items[0].price}</p>
                            <p className="text-sm text-gray-600 mb-4">{orderDetails.items[0].description}</p>
                            <div className="flex flex-col md:flex-row md:space-x-10 mt-4">
                                <div className="md:w-1/2">
                                    <p className="font-medium text-gray-600">{t(codeLanguage + '000194')}</p>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{orderDetails.billingAddress}</p>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <p className="font-medium text-gray-600">Shipping updates</p>
                                    <p className="text-sm text-gray-600">{orderDetails.shippingUpdates.email}</p>
                                    <p className="text-sm text-gray-600">{orderDetails.shippingUpdates.phone}</p>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-800 transition duration-200">Edit</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="border-t pt-4 mb-20">
                        <p className="text-sm text-gray-600 mb-2">{t(codeLanguage + '000195')} {orderDetails.progressDate}</p>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                            <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${(orderDetails.currentStep / (orderDetails.progressSteps.length - 1)) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            {orderDetails.progressSteps.map((step, index) => (
                                <p key={index} className={`text-center ${index <= orderDetails.currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>{step}</p>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start mb-6">
                        <img src='https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg' alt={orderDetails.items[0].name} className="w-40 h-50 object-cover rounded-md shadow-md mb-4 md:mb-0" />
                        <div className="md:ml-6">
                            <h2 className="text-2xl font-semibold text-gray-900">{orderDetails.items[0].name}</h2>
                            <p className="text-lg text-gray-700">{orderDetails.items[0].price}</p>
                            <p className="text-gray-600 mb-4">{orderDetails.items[0].description}</p>
                            <div className="flex flex-col md:flex-row md:space-x-10 mt-4">
                                <div className="md:w-1/2">
                                    <p className="font-medium text-gray-600">Delivery address</p>
                                    <p className="text-gray-600 whitespace-pre-line">{orderDetails.billingAddress}</p>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <p className="font-medium text-gray-600">Shipping updates</p>
                                    <p className="text-gray-600">{orderDetails.shippingUpdates.email}</p>
                                    <p className="text-gray-600">{orderDetails.shippingUpdates.phone}</p>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-800 transition duration-200">Edit</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="border-t pt-4 mb-20">
                        <p className="text-sm text-gray-600 mb-2">Processing on {orderDetails.progressDate}</p>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                            <div className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" style={{ width: `${(orderDetails.currentStep1 / (orderDetails.progressSteps.length - 1)) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            {orderDetails.progressSteps.map((step, index) => (
                                <p key={index} className={`text-center ${index <= orderDetails.currentStep1 ? 'text-indigo-600' : 'text-gray-400'}`}>{step}</p>
                            ))}
                        </div>
                    </div>

                    {/* Billing and Payment Information Section */}
                    <div className="mt-10 border-t pt-4">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="w-full md:w-2/5 pr-0 md:pr-4 mb-4 md:mb-0">
                                <p className="font-medium text-gray-600">{t(codeLanguage + '000210')}</p>
                                <p className="text-gray-600 whitespace-pre-line">{orderDetails.billingAddress}</p>
                            </div>
                            <div className="w-full md:w-2/5 pl-0 md:pl-4 mb-4 md:mb-0">
                                <p className="font-medium text-gray-600">{t(codeLanguage + '000211')}</p>
                                <div className="flex items-center">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAfCAMAAACF8f6iAAAAdVBMVEX///8UNMsAJMkAKspca9YALMoAJskAD8cIL8oAIMgAHcioreYAFMextumiqOUAAMaMlN9GV9G+wuxLXNLv8Pp7hdxlctf6+/7Cxu3f4fbm6PiVnOLO0fHV1/PZ3PSco+RWZtU5TdCBit0tRM5vetkfOswnP839FUl8AAAB00lEQVQ4je1TW4KDIAwkIIKIj/q2rda27t7/iJsE63KE/dj5aIlJJiQThPjHn8KjbbcEkQfzjkY7ihZ/ZzS7R+uMf/YLO+chSbbikzlOQ6W1ria2EqnlIGajtSFWk1oAsL5kp1RayySqelUAqqZT5wH8IgoJ9iLEDS0rM6n8Ss4iQxJQ8X1rBbbli6dgn0L0ioi6CkBfiql4GY56UnXw1yjx7vADHdCRYRNvC1nDFexv0Oopjxy/GH1gmpAgPc2HxLD7GbQrJJVHTx+0XEJsGtI6XEAjDZXwfRdCsH27jebo6RQlhfTGTfmOLT3g10tKwzCPTwhyf2GFOHFxSCduR8KgQbIAiad5uI3OOHk30n39HGc6mrNlLQT9u9Db9E0SONyOxoHqBQklizgxwSI5qvcmWbG3ajwcJVJSWxcLab6uNJ0+TsQkOLQQTRYIAlBTlHamQaXOYVjkQ8xBJElnXAdibXhdSHa1U/qJ8zYMzevEGuGtqI/WfO2vXWHDZiFlrSHIs/8DO1F61swATw5DtCI+/xJlWF4RplPGiYWR0vHmL5WUuJzXKsPHoJWj6lkmTXh4c3WEfdCVeV6yQiueaEZdU+/JXtNzu5Lz2CA85uIffws/lusXjWNFJpAAAAAASUVORK5CYII=" alt="Visa" className="inline-block mr-2" />
                                    <div>
                                        <p className="text-gray-600">Ending with {orderDetails.paymentInfo.ending}</p>
                                        <p className="text-gray-600">Expires {orderDetails.paymentInfo.expires}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-3/5 mt-6 md:mt-0">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600">{t(codeLanguage + '000209')}</p>
                                        <p className="text-gray-600">$72</p>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600">{t(codeLanguage + '000208')}</p>
                                        <p className="text-gray-600">$5</p>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-600">{t(codeLanguage + '000207')}</p>
                                        <p className="text-gray-600">$6.16</p>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-900">
                                        <p>{t(codeLanguage + '000206')}</p>
                                        <p>$83.16</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Order Button */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={_handleCancelOrder}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                        >
                            {t(codeLanguage + '000205')}
                        </button>
                    </div>

                    {showScrollButton && (
                        <IconButton
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                backgroundColor: primaryColor,
                                color: "white"
                            }}
                            onClick={_handleScrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default OrderDetailScreen;
