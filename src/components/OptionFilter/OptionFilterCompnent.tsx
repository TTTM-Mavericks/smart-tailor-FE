import React, { useState } from 'react';

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

type OptionFilterProps = {
    onClick?: () => void;
    style?: React.CSSProperties;
}

const OptionFilterCompnent: React.FC<OptionFilterProps> = ({ onClick, style }) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const handleCheckboxChange = (id: string) => {
        setCheckedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div>
            <h3 className="mb-4 font-semibold text-gray-900">Filter</h3>
            <ul className="w-48 text-sm font-medium text-gray-900 bg-white  rounded-lg">
                {optionals.map((options) => (
                    <li key={options.id} className="w-full  rounded-t-lg">
                        <div className="flex items-center pl-3">
                            <input
                                id={`${options.id}-checkbox`}
                                type="checkbox"
                                checked={checkedItems.includes(options.id)}
                                onChange={() => handleCheckboxChange(options.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor={`${options.id}-checkbox`}
                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                            >
                                {options.label}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OptionFilterCompnent;
