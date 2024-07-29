import { useState, useMemo, Fragment, useEffect } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { DesignInterface } from '../../../models/DesignModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import axios from 'axios';
import './FilterProductStyles.scss'
import { FaArrowUp, FaComments, FaEdit, FaImage } from 'react-icons/fa';

const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
];

const subCategories = [
    { name: 'T-shirts', href: '#' },
    { name: 'Jackets', href: '#' },
];

const filters = [
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: '#506027', label: '#506027', checked: false },
            { value: 'beige', label: 'Beige', checked: false },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'New Arrivals', checked: false },
            { value: 'sale', label: 'Sale', checked: false }
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: '2l', label: '2L', checked: false },
            { value: '40l', label: '40L', checked: true },
        ],
    },
];

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function FilterProductScreen() {
    const navigate = useNavigate();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>([]);
    const [selectedColors, setSelectedColors] = useState<any>([]);
    const [selectedSortOption, setSelectedSortOption] = useState('Most Popular');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(8);
    const [productData, setProductData] = useState<any>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [goToPage, setGoToPage] = useState(currentPage);

    useEffect(() => {
        setGoToPage(currentPage.toString());
    }, [currentPage]);

    useEffect(() => {
        const apiUrl = `${baseURL}${versionEndpoints.v1}/${featuresEndpoints.design}${functionEndpoints.design.getAllDesign}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    setProductData(responseData.data);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const _handleCheckboxChange = (setState: any, value: any) => {
        setState((prevSelected: any) =>
            prevSelected.includes(value) ? prevSelected.filter((item: any) => item !== value) : [...prevSelected, value]
        );
    };



    const filteredProducts = useMemo(() => {
        return productData.filter(
            (product: any) =>
                (selectedSubCategory.length === 0 || selectedSubCategory.includes(product.expertTailoring.expertTailoringName)) &&
                (selectedColors.length === 0 || selectedColors.includes(product.color))
        );
    }, [selectedSubCategory, selectedColors, productData]);

    function getBasePricesForDesign(data: any, designID: any) {
        const design = data.find((item: any) => item.designID === designID);
        if (!design) return [];
        return design.partOfDesign.map((part: any) => part.material.basePrice);
    }

    function sumBasePrices(prices: any) {
        return prices.reduce((sum: any, price: any) => sum + (typeof price === 'number' ? price : 0), 0);
    }

    const getAllPrice = (product: any) => {
        const basePrices = getBasePricesForDesign(productData, product.designID);
        const totalBasePrice = sumBasePrices(basePrices);
        return totalBasePrice;
    };

    const sortedProducts = useMemo(() => {
        switch (selectedSortOption) {
            case 'Most Popular':
                return [...filteredProducts].sort((a, b) => b.popularity - a.popularity);
            case 'Best Rating':
                return [...filteredProducts].sort((a, b) => b.rating - a.rating);
            case 'Newest':
                return [...filteredProducts].sort((a, b) => new Date(b.expertTailoring.createDate).getTime() - new Date(a.expertTailoring.createDate).getTime());
            case 'Price: Low to High':
                return [...filteredProducts].sort((a, b) => {
                    const aPrice = getAllPrice(a);
                    const bPrice = getAllPrice(b);
                    return aPrice - bPrice;
                });
            case 'Price: High to Low':
                return [...filteredProducts].sort((a, b) => {
                    const aPrice = getAllPrice(a);
                    const bPrice = getAllPrice(b);
                    return bPrice - aPrice;
                });
            default:
                return filteredProducts;
        }
    }, [filteredProducts, selectedSortOption, productData]);

    useEffect(() => {
        setTotalPages(Math.ceil(sortedProducts.length / productsPerPage));
    }, [sortedProducts, productsPerPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: any) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages));
        setCurrentPage(newPage);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = () => {
        console.log('Edit functionality triggered');
        // Implement edit functionality
    };

    const handleImageUpload = () => {
        console.log('Image upload functionality triggered');
        // Implement image upload functionality
    };

    const handleComments = () => {
        console.log('Comments functionality triggered');
        // Implement comments functionality
    };

    const handleStartDesign = () => {
        navigate('/design_create'); // Replace '/home' with the actual path to your home page
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredProducts]);

    return (
        <div className="bg-white" style={{ marginTop: "0" }}>
            <HeaderComponent />
            <div style={{ marginTop: "-3%" }}>
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <form className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Categories</h3>
                                        <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                                            {subCategories.map((category) => (
                                                <li key={category.name}>
                                                    <a href={category.href} className="block px-2 py-3">
                                                        {category.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        {filters.map((section) => (
                                            <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400">
                                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                                <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    ) : (
                                                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6">
                                                            <div className="space-y-6">
                                                                {section.options.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <input
                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            checked={selectedColors.includes(option.value)}
                                                                            onChange={() => _handleCheckboxChange(setSelectedColors, option.value)}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 min-w-0 flex-1 text-gray-500"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={option.href}
                                                            className={classNames(
                                                                option.current ? 'text-gray-500' : 'text-gray-500',
                                                                active ? 'bg-gray-100' : '',
                                                                selectedSortOption === option.name ? 'text-gray-900' : '',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedSortOption(option.name);
                                                            }}
                                                        >
                                                            {option.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <button
                                type="button"
                                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>

                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">Products</h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            <form className="hidden lg:block">
                                <h3 className="sr-only">Categories</h3>
                                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                                    {subCategories.map((category) => (
                                        <li key={category.name}>
                                            <a href={category.href}>{category.name}</a>
                                        </li>
                                    ))}
                                </ul>

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    defaultValue={option.value}
                                                                    type="checkbox"
                                                                    checked={selectedColors.includes(option.value)}
                                                                    onChange={() => _handleCheckboxChange(setSelectedColors, option.value)}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow-md">
                                <div className="border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                                    Showing <span className="font-semibold">{filteredProducts.length}</span> results
                                </div>
                                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 mt-6">
                                    {currentProducts.map((product: any) => {
                                        const basePrices = getBasePricesForDesign(productData, product.designID);
                                        const totalBasePrice = sumBasePrices(basePrices);

                                        return (
                                            <div key={product.designID} className="product-card">
                                                <div className="image-container">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.imageAlt}
                                                        className="product-image"
                                                    />
                                                    <button className="start-design-btn" onClick={handleStartDesign}>Start Design</button>
                                                </div>

                                                <div className="product-info" style={{ height: "150px" }}>
                                                    <p className="price" style={{ color: "#FF5800", fontFamily: "monospace" }}>{totalBasePrice} VND</p>
                                                    <p className="size">{product.titleDesign}</p>
                                                    <p className="color">Color: {product.color}</p>
                                                    <p className="color">Size: {product.size}</p>
                                                </div>

                                                <div className="hover-details">
                                                    <p className="price" style={{ color: "#FF5800", fontFamily: "monospace" }}>{totalBasePrice} VND</p>
                                                    <br></br>
                                                    <p className="color">Size: {product.size}</p>
                                                    <p className="color">Color: {product.color}</p>
                                                    <p>97% polyester & 3% Spandex</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-wrap items-center justify-center space-x-2 mt-8">
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        value={productsPerPage}
                                        onChange={(e) => {
                                            setProductsPerPage(Number(e.target.value));
                                            paginate(1);
                                        }}
                                    >
                                        <option value="10">10 per page</option>
                                        <option value="20">20 per page</option>
                                        <option value="50">50 per page</option>
                                    </select>

                                    <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                                        <button
                                            className={`px-3 py-2 rounded-md ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                                }`}
                                            onClick={() => { if (currentPage > 1) paginate(currentPage - 1); }}
                                            disabled={currentPage === 1}
                                        >
                                            &laquo;
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`px-3 py-2 rounded-md ${currentPage === number
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                                    }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        <button
                                            className={`px-3 py-2 rounded-md ${currentPage === Math.ceil(sortedProducts.length / productsPerPage)
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                                }`}
                                            onClick={() => {
                                                if (currentPage < Math.ceil(sortedProducts.length / productsPerPage)) paginate(currentPage + 1);
                                            }}
                                            disabled={currentPage === Math.ceil(sortedProducts.length / productsPerPage)}
                                        >
                                            &raquo;
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                        <span className="text-gray-600">Go to</span>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-md w-16 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            value={goToPage}
                                            onChange={(e: any) => setGoToPage(e.target.value)}
                                            onKeyPress={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    const page = Math.max(1, Math.min(parseInt(goToPage), totalPages));
                                                    if (!isNaN(page)) {
                                                        paginate(page);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="fixed bottom-4 right-4 z-50">
                                {isOpen && (
                                    <div className="flex flex-col-reverse mb-2 space-y-2 space-y-reverse">
                                        <button onClick={handleScrollToTop} className="p-3 bg-white rounded-full shadow-lg">
                                            <FaArrowUp />
                                        </button>
                                        <button onClick={handleEdit} className="p-3 bg-white rounded-full shadow-lg">
                                            <FaEdit />
                                        </button>
                                        <button onClick={handleImageUpload} className="p-3 bg-white rounded-full shadow-lg">
                                            <FaImage />
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={toggleMenu}
                                    className="p-4 text-white bg-orange-500 rounded-full shadow-lg"
                                >
                                    <FaComments />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <FooterComponent />
        </div>
    );
}