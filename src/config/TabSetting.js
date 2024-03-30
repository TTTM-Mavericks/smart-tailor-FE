import { swatch, fileIcon, ai, logoShirt, stylishShirt, download } from "../assets";

const EditorTabs = [
    {
        name: "colorpicker",
        icon: swatch
    },
    {
        name: "filepicker",
        icon: fileIcon
    },
    {
        name: "aipicker",
        icon: ai
    },
    {
        name: 'download',
        icon: download
    }
]

const FilterTabs = [
    {
        name: "logoShirt",
        icon: logoShirt,
    },
    {
        name: "stylishShirt",
        icon: stylishShirt,
    },
];

const DecalTypes = {
    logo: {
        stateProperty: "logoDecal",
        filterTab: "logoShirt",
    },
    full: {
        stateProperty: "fullDecal",
        filterTab: "stylishShirt",
    },
};

export { EditorTabs, FilterTabs, DecalTypes  }