import React, { useEffect, useRef } from 'react';
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/Footer/FooterComponent';
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Switch } from '@headlessui/react'
import { primaryColor } from '../../root/ColorSystem';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import { motion, useInView } from 'framer-motion';
import { TokenRefreshDialogComponent } from '../Authentication';

const products = [
    {
        id: 1,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
    {
        id: 2,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
    {
        id: 3,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
    {
        id: 4,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
    {
        id: 5,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
    {
        id: 6,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    },
]

const HomeScreen = () => {

    // ---------------UseState Variable---------------//
    const [agreed, setAgreed] = useState<boolean>(false)

    const titleRef = useRef(null);
    const isTitleVisible = useInView(titleRef, { once: true });

    const teamRef = useRef(null);
    const isTeamVisible = useInView(teamRef, { once: true });

    const testimonialsRef = useRef(null);
    const isTestimonialsVisible = useInView(testimonialsRef, { once: true });

    const servicesRef = useRef(null);
    const isServicesVisible = useInView(servicesRef, { once: true });

    const containerRef = useRef(null);
    const isContainerVisible = useInView(containerRef, { once: true });

    const productRef = useRef(null)
    const idProductVisible = useInView(productRef, { once: true })

    const titleTextRef = useRef(null);
    const isTitleTextVisible = useInView(titleTextRef, { once: true })

    const upgradeRef = useRef(null);
    const isUpgradeVisible = useInView(upgradeRef, { once: true })

    const numbericRef = useRef(null);
    const isNumbericVisible = useInView(numbericRef, { once: true })

    const contactRef = useRef(null);
    const isContactInvisible = useInView(contactRef, { once: true })
    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//
    useEffect(() => {
        console.log('hostname: ', window.location.href);
        // getHeaders(window.location.host)
        __getHeaders(window.location.href)
    }, []);

    const __getHeaders = async (url: string) => {
        try {
            const response = await axios.head(url);
            return response;
        } catch (error) {
            console.error('Error fetching headers:', error);
        }
    };
    // ---------------FunctionHandler---------------//
    const classNames = (...classes: any[]) => {
        return classes.filter(Boolean).join(' ')
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
        <div>
            {/* Header */}
            <HeaderComponent></HeaderComponent>

            {/* Slider */}
            <div className="relative overflow-hidden bg-white mt-20 ">
                <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
                    <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                        <motion.div
                            ref={teamRef}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isTeamVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                        >
                            <div className="sm:max-w-lg">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    {t(codeLanguage + '000081')}
                                </h1>
                                <p className="mt-4 text-xl text-gray-500">
                                    {t(codeLanguage + '000082')}
                                </p>
                            </div>
                            <div>
                                <div className="mt-10">
                                    {/* Decorative image grid */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                                    >
                                        <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                            <div className="flex items-center space-x-6 lg:space-x-8">
                                                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                        <img
                                                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
                                                            alt=""
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href="#"
                                        style={{ backgroundColor: primaryColor }}
                                        className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                                    >
                                        {t(codeLanguage + '000102')}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Product */}
            <div className="bg-white py-24 sm:py-32" style={{ marginTop: "-4%" }}>
                <motion.div
                    ref={productRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={idProductVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {t(codeLanguage + '000135')}
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                {t(codeLanguage + '000136')}
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-6xl">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg shadow-lg transform transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70 rounded-lg"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-2xl font-bold text-white" style={{ marginBottom: "10%" }}>
                                                {t(codeLanguage + '000130')} {index + 1}
                                            </h3>
                                            <a
                                                href="/design"
                                                className="text-indigo-400 underline"
                                                style={{
                                                    textDecoration: "none",
                                                    backgroundColor: primaryColor,
                                                    color: "white",
                                                    padding: "5px",
                                                    borderRadius: "6%",
                                                }}
                                            >
                                                Design Now
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <div className="bg-white animate-fadeIn py-24 sm:py-32" style={{ marginTop: "-10%" }}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <motion.div
                            ref={titleRef}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isTitleVisible ? { opacity: 1, y: 0, transition: { duration: 1 } } : {}}
                        >
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-slideIn">
                                {t(codeLanguage + '000145')}
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 animate-fadeIn">
                                {t(codeLanguage + '000146')}
                            </p>
                        </motion.div>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <motion.div
                            ref={servicesRef}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isServicesVisible ? { opacity: 1, y: 0, transition: { duration: 1 } } : {}}
                        >
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                <div className="relative pl-16 animate-fadeInUp">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 transform transition-transform duration-500 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                                            <ArrowPathIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {t(codeLanguage + '000137')}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">{t(codeLanguage + '000141')}</dd>
                                </div>
                                <div className="relative pl-16 animate-fadeInUp">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 transform transition-transform duration-500 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                                            <CloudArrowUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {t(codeLanguage + '000138')}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">{t(codeLanguage + '000142')}</dd>
                                </div>
                                <div className="relative pl-16 animate-fadeInUp">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 transform transition-transform duration-500 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                                            <FingerPrintIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {t(codeLanguage + '000139')}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">{t(codeLanguage + '000143')}</dd>
                                </div>
                                <div className="relative pl-16 animate-fadeInUp">
                                    <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 transform transition-transform duration-500 hover:scale-110" style={{ backgroundColor: primaryColor }}>
                                            <LockClosedIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {t(codeLanguage + '000140')}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">{t(codeLanguage + '000144')}</dd>
                                </div>
                            </dl>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Products */}

            <div className="bg-white" style={{ marginTop: "-8%" }}>
                <motion.div
                    ref={testimonialsRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isTestimonialsVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                >
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-slideIn" style={{ textAlign: "center" }}>
                            {t(codeLanguage + '000179')}
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600" style={{ textAlign: "center" }}>
                            {t(codeLanguage + '000180')}
                        </p>
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">

                            {products.map((product) => (

                                <div key={product.id} className="group relative overflow-hidden bg-gray-200 rounded-md hover:shadow-lg transition duration-300 ease-in-out">
                                    <div className="aspect-w-1 aspect-h-1 w-full">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="object-cover object-center w-full h-full"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-gray-900 truncate">{product.name}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{product.color}</p>
                                        <Rating
                                            name="half-rating"
                                            defaultValue={2.5}
                                            precision={0.5}
                                            readOnly
                                        />
                                        <p className="mt-2 text-lg font-bold text-gray-900">{product.price}</p>
                                    </div>

                                    <a href={product.href} className="absolute inset-0 z-10"></a>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Companies */}
            <div className="bg-white py-24 sm:py-32" style={{ marginTop: "-8%" }}>
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isContainerVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-slideIn" style={{ textAlign: "center" }}>
                            {t(codeLanguage + '000147')}
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600" style={{ textAlign: "center" }}>
                            {t(codeLanguage + '000148')}
                        </p>
                        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
                                alt="Transistor"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
                                alt="Reform"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
                                alt="Tuple"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                                src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
                                alt="SavvyCal"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Upgrade detail */}
            <div className="bg-white py-24 sm:py-32" style={{ marginTop: "-9%" }}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <motion.div
                            ref={titleTextRef}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isTitleTextVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"> {t(codeLanguage + '000149')}</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                {t(codeLanguage + '000150')}
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        ref={upgradeRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isUpgradeVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                    >
                        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{t(codeLanguage + '000151')}</h3>
                                <p className="mt-6 text-base leading-7 text-gray-600">
                                    {t(codeLanguage + '000152')}
                                </p>
                                <div className="mt-10 flex items-center gap-x-4">
                                    <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">{t(codeLanguage + '000153')}</h4>
                                    <div className="h-px flex-auto bg-gray-100" />
                                </div>
                                <ul
                                    role="list"
                                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                                >
                                    <li className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                        {t(codeLanguage + '000157')}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                        {t(codeLanguage + '000158')}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                        {t(codeLanguage + '000159')}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                        {t(codeLanguage + '000160')}
                                    </li>
                                </ul>
                            </div>
                            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                    <div className="mx-auto max-w-xs px-8">
                                        <p className="text-base font-semibold text-gray-600">{t(codeLanguage + '000154')}</p>
                                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                            <span className="text-5xl font-bold tracking-tight text-gray-900">999.999</span>
                                            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">VND</span>
                                        </p>
                                        <a
                                            href="#"
                                            style={{ backgroundColor: primaryColor }}
                                            className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >

                                            {t(codeLanguage + '000155')}
                                        </a>
                                        <p className="mt-6 text-xs leading-5 text-gray-600">
                                            {t(codeLanguage + '000156')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Numberic */}
            <div className="bg-white py-24 sm:py-32" style={{ marginTop: "-12%" }} >
                <motion.div
                    ref={numbericRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isNumbericVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                >
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-slideIn" style={{ textAlign: "center", marginBottom: "5%" }}>
                        {t(codeLanguage + '000161')}
                    </p>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-600">{t(codeLanguage + '000162')}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                    {t(codeLanguage + '000165')}
                                </dd>
                            </div>
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-600">{t(codeLanguage + '000163')}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                    {t(codeLanguage + '000166')}
                                </dd>
                            </div>
                            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base leading-7 text-gray-600">{t(codeLanguage + '000164')}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                    {t(codeLanguage + '000167')}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </motion.div>
            </div>

            {/* Contact form */}
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8" style={{ marginTop: "-10%" }}>
                <motion.div
                    ref={contactRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isContactInvisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                >
                    <div
                        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t(codeLanguage + '000168')}</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            {t(codeLanguage + '000169')}
                        </p>
                    </div>
                    <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000170')}
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000171')}
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000172')}
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="company"
                                        id="company"
                                        autoComplete="organization"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000173')}
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000174')}
                                </label>
                                <div className="relative mt-2.5">
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                        <label htmlFor="country" className="sr-only">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        >
                                            <option>US</option>
                                            <option>VN</option>
                                        </select>
                                        <ChevronDownIcon
                                            className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="tel"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                    {t(codeLanguage + '000175')}
                                </label>
                                <div className="mt-2.5">
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                    />
                                </div>
                            </div>
                            <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
                                <div className="flex h-6 items-center">
                                    <Switch
                                        checked={agreed}
                                        onChange={setAgreed}
                                        style={{ backgroundColor: primaryColor }}
                                        className={classNames(
                                            agreed ? 'bg-indigo-600' : 'bg-gray-200',
                                            'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                        )}
                                    >
                                        <span className="sr-only">Agree to policies</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                agreed ? 'translate-x-3.5' : 'translate-x-0',
                                                'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                                            )}
                                        />
                                    </Switch>
                                </div>
                                <Switch.Label className="text-sm leading-6 text-gray-600">
                                    {t(codeLanguage + '000176')}{' '}
                                    <a href="#" className="font-semibold text-indigo-600">
                                        {t(codeLanguage + '000177')}
                                    </a>
                                    .
                                </Switch.Label>
                            </Switch.Group>
                        </div>
                        <div className="mt-10">
                            <button
                                type="submit"
                                style={{ backgroundColor: primaryColor }}
                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {t(codeLanguage + '000178')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Footer */}
            <FooterComponent></FooterComponent>
        </div >
    );
};



export default HomeScreen;