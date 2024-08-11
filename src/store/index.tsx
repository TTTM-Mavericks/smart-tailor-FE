import { proxy } from 'valtio';
import { PartOfDesignInterface } from '../models/DesignModel'
type StateType = {
  modelData: PartOfDesignInterface[] | undefined;
  intro: boolean,
  color: string,
  isLogoTexture: boolean;
  logoDecal: string;
  logoDecalPositionX: number;
  logoDecalPositionY: number;
  imageLogoUrl: string | undefined;

  isFullTexture: boolean;
  fullDecal: string;

  isFrontClothTexture: boolean;
  frontClothDecal: string[];
  frontDecalPositionX: number;
  frontDecalPositionY: number;
  imageFrontClothUrl: string[];

  isBackClothTexture: boolean;
  backClothDecal: string;
  backDecalPositionX: number;
  backDecalPositionY: number;
  imageBackClothUrl: string | undefined;

  isSleeveClothTexture: boolean;
  sleeveClothDecal: string;
  sleeveDecalPositionX: number;
  sleeveDecalPositionY: number;
  imagesleeveClothUrl: string | undefined;
};

const state = proxy<StateType>({

  modelData: [] as PartOfDesignInterface[],

  intro: true,
  color: '#FFFFFF',

  isLogoTexture: false,
  logoDecal: './threejs.png',
  logoDecalPositionX: 0,
  logoDecalPositionY: 0,
  imageLogoUrl: undefined,

  isFullTexture: false,
  fullDecal: './threejs.png',

  isFrontClothTexture: false,
  frontClothDecal: [],
  frontDecalPositionX: 0,
  frontDecalPositionY: 0,
  imageFrontClothUrl: [],

  isBackClothTexture: false,
  backClothDecal: './threejs.png',
  backDecalPositionX: 0,
  backDecalPositionY: 0,
  imageBackClothUrl: undefined,

  isSleeveClothTexture: false,
  sleeveClothDecal: './threejs.png',
  sleeveDecalPositionX: 0,
  sleeveDecalPositionY: 0,
  imagesleeveClothUrl: undefined,





});

export default state;