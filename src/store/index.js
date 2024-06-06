import { proxy } from 'valtio';

const state = proxy({
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