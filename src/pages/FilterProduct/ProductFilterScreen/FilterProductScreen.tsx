import { useState, useMemo, Fragment, useEffect } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { ArrowUpward } from '@mui/icons-material';
import { IconButton } from "@mui/material";
import { DesignInterface } from '../../../models/DesignModel';

// Fake Data to test
const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
];

const subCategories = [
    { name: 'T-shirts', href: '#' },
    { name: 'Pants', href: '#' },
    { name: 'Sweaters', href: '#' },
    { name: 'Jackets', href: '#' },
];

const filters = [
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: 'white', label: 'White', checked: false },
            { value: 'beige', label: 'Beige', checked: false },
            { value: 'blue', label: 'Blue', checked: true },
            { value: 'brown', label: 'Brown', checked: false },
            { value: 'green', label: 'Green', checked: false },
            { value: 'purple', label: 'Purple', checked: false },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'New Arrivals', checked: false },
            { value: 'sale', label: 'Sale', checked: false },
            { value: 'travel', label: 'Travel', checked: true },
            { value: 'organization', label: 'Organization', checked: false },
            { value: 'accessories', label: 'Accessories', checked: false },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: '2l', label: '2L', checked: false },
            { value: '6l', label: '6L', checked: false },
            { value: '12l', label: '12L', checked: false },
            { value: '18l', label: '18L', checked: false },
            { value: '20l', label: '20L', checked: false },
            { value: '40l', label: '40L', checked: true },
        ],
    },
];

const products = [
    {
        id: 1,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'totes',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-14',
    },
    {
        id: 2,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'sale',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-13',
    },
    {
        id: 3,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'totes',
        color: 'white',
        popularity: 2.5,
        rating: 3.7,
        dateAdded: '2023-05-12',
    },
    {
        id: 4,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'sale',
        color: 'white',
        popularity: 2.5,
        rating: 3,
        dateAdded: '2023-05-10',
    },
    {
        id: 5,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'totes',
        color: 'white',
        popularity: 4.5,
        rating: 3,
        dateAdded: '2023-05-20',
    },
    {
        id: 6,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'totes',
        color: 'white',
        popularity: 4.5,
        rating: 5,
        dateAdded: '2023-05-02',
    },
    {
        id: 7,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'new-arrivals',
        color: 'white',
        popularity: 4.5,
        rating: 5,
        dateAdded: '2023-05-10',
    },
    {
        id: 8,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'totes',
        color: 'new-arrivals',
        popularity: 4.5,
        rating: 4,
        dateAdded: '2023-05-22',
    },
    {
        id: 9,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'new-arrivals',
        color: 'beige',
        popularity: 4.5,
        rating: 4,
        dateAdded: '2023-05-21',
    },
    {
        id: 10,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'new-arrivals',
        color: 'white',
        popularity: 4.5,
        rating: 5,
        dateAdded: '2023-05-10',
    },
    {
        id: 11,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'totes',
        color: 'new-arrivals',
        popularity: 4.5,
        rating: 4,
        dateAdded: '2023-05-22',
    },
    {
        id: 12,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'new-arrivals',
        color: 'beige',
        popularity: 4.5,
        rating: 4,
        dateAdded: '2023-05-21',
    },
    {
        id: 13,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'totes',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-14',
    },
    {
        id: 14,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'sale',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-13',
    },
    {
        id: 15,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'totes',
        color: 'white',
        popularity: 2.5,
        rating: 3.7,
        dateAdded: '2023-05-12',
    },
    {
        id: 16,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'sale',
        color: 'white',
        popularity: 2.5,
        rating: 3,
        dateAdded: '2023-05-10',
    },
    {
        id: 17,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'totes',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-14',
    },
    {
        id: 18,
        name: 'Basic Sweatshirt',
        price: '$65',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain grey sweatshirt',
        category: 'sale',
        color: 'white',
        popularity: 4.5,
        rating: 4.7,
        dateAdded: '2023-05-13',
    },
    {
        id: 19,
        name: 'Basic Pants',
        price: '$50',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        imageAlt: 'A pair of plain black pants',
        category: 'totes',
        color: 'white',
        popularity: 2.5,
        rating: 3.7,
        dateAdded: '2023-05-12',
    },
    {
        id: 20,
        name: 'Basic Tee',
        price: '$35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: 'A plain white t-shirt',
        category: 'sale',
        color: 'white',
        popularity: 2.5,
        rating: 3,
        dateAdded: '2023-05-10',
    },
];

// End Fake data to test

/**
 * Combines an array of CSS class names into a single string.
 * @param {...string[]} classes - Array of CSS class names to combine.
 * @returns {string} - A string containing all the non-falsy class names separated by a space.
 */
function classNames(...classes: string[]): string {
    // Filter out falsy values from classes array
    return classes.filter(Boolean)
        // Join remaining classes with a space separator
        .join(' ');
}

export default function FilterProductScreen() {
    // ---------------UseState Variable---------------//
    const navigate = useNavigate();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>([]);
    const [selectedColors, setSelectedColors] = useState<any>([]);
    const [selectedSortOption, setSelectedSortOption] = useState('Most Popular');
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [designList, setDesignList] = useState<DesignInterface[]>();




    // ---------------FunctionHandler---------------//

    /**
     * Handles the change event for a checkbox, updating the state based on whether the value is currently selected.
     * @param {Function} setState - The state setter function for the selected values.
     * @param {any} value - The value of the checkbox that was changed.
     */
    const _handleCheckboxChange = (setState: any, value: any) => {
        setState((prevSelected: any) =>
            prevSelected.includes(value) ? prevSelected.filter((item: any) => item !== value) : [...prevSelected, value]
        );
    };

    /**
     * Filters the products based on selected subcategories and colors.
     * @param {Array} selectedSubCategory - Array of selected subcategories to filter the products by.
     * @param {Array} selectedColors - Array of selected colors to filter the products by.
     */

    const filteredProducts = useMemo(() => {
        return products.filter(
            (product) =>
                (selectedSubCategory.length === 0 || selectedSubCategory.includes(product.category)) &&
                (selectedColors.length === 0 || selectedColors.includes(product.color))
        );
    }, [selectedSubCategory, selectedColors]);


    /**
     * Sorts the filtered products based on the selected sorting option.
     * @param {string} selectedSortOption - The selected sorting criteria (e.g., 'Most Popular', 'Best Rating', 'Newest', 'Price: Low to High', 'Price: High to Low').
     * @returns {Array} sortedProducts - The products sorted according to the selected sorting criteria.
     */
    const sortedProducts = useMemo(() => {
        switch (selectedSortOption) {
            case 'Most Popular':
                return [...filteredProducts].sort((a, b) => b.popularity - a.popularity);
            case 'Best Rating':
                return [...filteredProducts].sort((a, b) => b.rating - a.rating);
            case 'Newest':
                return [...filteredProducts].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            case 'Price: Low to High':
                return [...filteredProducts].sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
            case 'Price: High to Low':
                return [...filteredProducts].sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
            default:
                return filteredProducts;
        }
    }, [filteredProducts, selectedSortOption]);



    /**
     * Scrolls the window to the top smoothly.
     */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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


    /**
    * Call again the Number when sorting
    */
    useEffect(() => {
        // Calculate the new total number of pages after filtering
        const newTotalPages = Math.ceil(sortedProducts.length / productsPerPage);

        // If the current page exceeds the new total number of pages, update the current page
        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
        }
    }, [sortedProducts, productsPerPage]);

    // ---------------Usable Variable---------------//
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber: any) => setCurrentPage(pageNumber);


    return (
        <div className="bg-white" style={{ marginTop: "0" }}>
            <HeaderComponent />
            <div>
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
                                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
                                    {currentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                                        >
                                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                                <img
                                                    src={product.imageSrc}
                                                    alt={product.imageAlt}
                                                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                                                />
                                            </div>
                                            <h3 className="mt-4 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                                {product.name}
                                            </h3>
                                            <p className="mt-1 text-lg font-medium text-gray-900">{product.color}</p>
                                            <div className="flex items-center mt-2">
                                                <Rating name="half-rating" value={product.rating} readOnly />
                                                <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                                            </div>
                                            <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
                                            <div className="flex space-x-4 mt-4">
                                                <button
                                                    className="flex-1 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                                                    onClick={() => navigate(`/detail_product/${product.id}`)}
                                                    style={{ backgroundColor: "#ACC8E5" }}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() => navigate('/design')}
                                                    className="flex-1 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                                    style={{ backgroundColor: "#E96208" }}>
                                                    Design
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-sm" style={{ marginTop: "5%" }}>
                                    <div className="flex justify-center">
                                        <nav className="flex space-x-2" aria-label="Pagination">
                                            <a
                                                href="#"
                                                className={`relative inline-flex items-center px-4 py-2 text-sm ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-violet-300 to-indigo-300'} border border-fuchsia-100 hover:border-violet-100 text-white font-semibold leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10`}
                                                onClick={() => {
                                                    if (currentPage > 1) paginate(currentPage - 1);
                                                }}
                                            >
                                                Previous
                                            </a>
                                            {Array.from(Array(Math.ceil(sortedProducts.length / productsPerPage)).keys()).map((number) => (
                                                <a
                                                    href="#"
                                                    key={number + 1}
                                                    onClick={() => paginate(number + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === number + 1 ? 'text-white bg-indigo-600 border-indigo-600' : 'text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer'} rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10`}
                                                >
                                                    {number + 1}
                                                </a>
                                            ))}
                                            <a
                                                href="#"
                                                onClick={() => {
                                                    if (currentPage < Math.ceil(sortedProducts.length / productsPerPage)) paginate(currentPage + 1);
                                                }}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm ${currentPage === Math.ceil(sortedProducts.length / productsPerPage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-violet-300 to-indigo-300'} border border-fuchsia-100 hover:border-violet-100 text-white font-semibold leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10`}
                                            >
                                                Next
                                            </a>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showScrollButton && (
                            <IconButton
                                style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    zIndex: 100,
                                    backgroundColor: "#E96208",
                                    color: "white"
                                }}
                                onClick={_handleScrollToTop}
                            >
                                <ArrowUpward />
                            </IconButton>
                        )}
                    </section>
                </main>
            </div>
            <FooterComponent />
        </div>
    );
}