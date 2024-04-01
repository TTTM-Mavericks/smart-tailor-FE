import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  
  isLogoTexture: false,
  logoDecal: './threejs.png',
  logoDecalPositionX: 0,
  logoDecalPositionY: 0,
  imageLogoUrl: undefined,

  isFullTexture: false,
  fullDecal: './threejs.png',
  
  isFrontClothTexture: false,
  frontClothDecal: './threejs.png',
  frontDecalPositionX: 0,
  frontDecalPositionY: 0,
  imageFrontClothUrl: undefined,
  
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