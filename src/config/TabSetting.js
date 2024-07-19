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
        name: 'download',
        icon: download
    }
]

const FilterTabs = [
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
    front: {
        stateProperty: "frontClothDecal",
        filterTab: "stylishShirt",
    },
    back: {
        stateProperty: "backClothDecal",
        filterTab: "stylishShirt",
    },
    sleeve: {
        stateProperty: "sleeveClothDecal",
        filterTab: "stylishShirt",
    },
};

export { EditorTabs, FilterTabs, DecalTypes  }