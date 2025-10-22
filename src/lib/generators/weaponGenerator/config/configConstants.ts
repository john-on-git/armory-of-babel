import type { WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

const edgedWeaponShapeFamiliesArr = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[];
export const edgedWeaponShapeFamilies = new Set(edgedWeaponShapeFamiliesArr);

const bluntWeaponShapeFamiliesArr = ['club', 'mace', 'staff'] as const satisfies WeaponShapeGroup[];
export const bluntWeaponShapeFamilies = new Set(bluntWeaponShapeFamiliesArr);

const pointedWeaponShapeFamiliesArr = ['spear', 'lance'] as const satisfies WeaponShapeGroup[];
export const pointedWeaponShapeFamilies = new Set(pointedWeaponShapeFamiliesArr);

const sharpWeaponShapeFamiliesArr = [...edgedWeaponShapeFamiliesArr, ...pointedWeaponShapeFamiliesArr];
export const sharpWeaponShapeFamilies = new Set(sharpWeaponShapeFamiliesArr);

export const swordlikeWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)'] satisfies WeaponShapeGroup[];