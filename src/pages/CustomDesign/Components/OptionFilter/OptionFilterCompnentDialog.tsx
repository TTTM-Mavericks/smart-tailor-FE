import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import styles from './OptionFilterDialogStyle.module.scss'
import { primaryColor } from '../../../../root/ColorSystem';
interface Options {
    id: string;
    label: string;
}

const optionals: Options[] = [
    { id: 'vue', label: 'Vue JS' },
    { id: 'react', label: 'React' },
    { id: 'angular', label: 'Angular' },
    { id: 'laravel', label: 'Laravel' },
];
const subCategories = [
    { name: 'All', value: 'all' },
    { name: 'T-shirts', value: 'shirtModel' },
    { name: 'Hoodie', value: 'hoodieModel' },
    { name: 'Skirt', value: 'skirtFullModel' },
    { name: 'Top skirt', value: 'womenSkirtTopModel' },
    { name: 'Bottom skirt', value: 'womenSkirtBottomModel' },
    { name: 'Long skirt', value: 'longSkirtModel' },
    { name: 'Vest', value: 'vestModel' },
    { name: 'pant', value: 'pantModel' },

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

type OptionFilterProps = {
    onClickSelect: (option: string) => void;
    style?: React.CSSProperties;
    navbarOption?: string
}

const OptionFilterCompnentDialog: React.FC<OptionFilterProps> = ({ onClickSelect, style, navbarOption }) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<any>([]);
    const [selectedModel, setSelectedModel] = useState<string>('all');



    const handleCheckboxChange = (id: string) => {
        setCheckedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

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

    const __handleSetSelectedModel = (model: string) => {
        setSelectedModel(model);
        if (model) onClickSelect(model);
    }

    return (
        <form className={`${styles.filter__container} mt-0, ml-2`} style={{ height: '100%' }}>
            <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                {subCategories.map((category) => (
                    <li onClick={() => __handleSetSelectedModel(category.value)} key={category.name} style={{ textDecorationLine: selectedModel === category.value ? `underline` : 'none', cursor: 'pointer', textDecorationColor: primaryColor }}>
                        <span className="block px-2 py-3">
                            {category.name}
                        </span>
                    </li>
                ))}
            </ul>

            {filters.map((section) => (
                <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                    {({ open }) => (
                        <>
                            <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between  px-2 py-3 text-gray-400">
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
    );
};

export default OptionFilterCompnentDialog;
