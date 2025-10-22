import { getPlurality } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { type DescriptorType, type Pronouns, type PronounsLoc, type Weapon, type WeaponPart, type WeaponPartName } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";


function isAre(name: WeaponPartName) {
    switch (getPlurality(name)) {
        case 'singular':
            return ' is';
        case 'plural':
            return ' are';
    }
}
function isOrPossessionFor(name: WeaponPartName, type: DescriptorType) {
    const plurality = getPlurality(name);
    switch (plurality) {
        case 'singular':
            switch (type) {
                case 'possession':
                    return ' has ';
                case 'property':
                    return "";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        case 'plural':
            switch (type) {
                case 'possession':
                    return ' have ';
                case 'property':
                    return "";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        default:
            return plurality satisfies never;
    }
}

function linkingIsOrPossessionFor(name: WeaponPartName, type: DescriptorType) {
    const plurality = getPlurality(name);
    switch (plurality) {
        case 'singular':
            switch (type) {
                case 'possession':
                    return 'it has ';
                case 'property':
                    return "it";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        case 'plural':
            switch (type) {
                case 'possession':
                    return 'they each have ';
                case 'property':
                    return "they";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        default:
            return plurality satisfies never;
    }
}


export const pronounLoc = {
    object: {
        singular: {
            subject: "it",
            possessive: "its"
        }
    },
    enby: {
        singular: {
            subject: "they",
            possessive: "their"
        }
    },
    masc: {
        singular: {
            subject: "he",
            possessive: "his"
        }
    },
    femm: {
        singular: {
            subject: "she",
            possessive: "her"
        }
    }
} as const satisfies Record<Pronouns, PronounsLoc>;

/**
 * 
 * @param _locale locale to generator the weapon for (not currently implemented)
 * @param weapon A weapon that has a description. If its description is null the behaviour is undefined. 
 */
export function structuredDescToString(_locale: string, weapon: Weapon) {

    if (weapon.description === null) {
        throw new Error('cannot generate description for a weapon with null description');
    }
    else {
        const parts = Object.values(weapon.description).map(xs => Object.entries(xs)).flat().filter(([_, part]) => part.material !== undefined || part.descriptors.length > 0) as [WeaponPartName, WeaponPart][];

        function usesAnd(desc: WeaponPart) {
            return (desc.material !== undefined && desc.descriptors.length > 0) || desc.descriptors.length > 1;
        }

        let description = '';
        let i = 0;
        let usedAndThisSentence: boolean = false;
        for (const [partName, part] of parts) {
            const start = i === 0
                ? pronounLoc[weapon.pronouns].singular.possessive.toTitleCase()
                : usedAndThisSentence
                    ? weapon.pronouns === 'object'
                        ? 'the'
                        : pronounLoc[weapon.pronouns].singular.possessive
                    : weapon.pronouns === 'object'
                        ? 'The'
                        : pronounLoc[weapon.pronouns].singular.possessive.toTitleCase();


            // get all the descriptors, merging together any chains of 'has' / 'have' etc
            let hasChain = false;
            const descriptors: string[] = [];
            if (part.descriptors.length > 0) {
                // handle the first one separately if there's no material
                if (part.material === undefined) {
                    descriptors.push(`${isOrPossessionFor(partName, part.descriptors[0].descType)}${part.descriptors[0].desc}`);
                    hasChain = part.descriptors[0].descType === 'possession';
                }
                for (const descriptor of part.material === undefined ? part.descriptors.slice(1) : part.descriptors) {
                    // if this is possessive and the previous one was too, omit the possessiveness prefix
                    descriptors.push(descriptor.descType === 'possession' && hasChain ? descriptor.desc : `${linkingIsOrPossessionFor(partName, descriptor.descType)}${descriptor.desc}`);

                    hasChain = descriptor.descType === 'possession';
                }
            }

            // if (dev) {
            //     for (const atom of [part.material, ...part.descriptors]) {
            //         if (atom !== undefined && /^\s*$/.test(atom.desc)) {
            //             console.error(`\x1b[31mSaw empty description atom: "${atom.desc}" (${atom.UUID})`);
            //         }
            //     }
            // }

            const materialStr = part.material === undefined ? '' : `${isAre(partName)} made of ${part.material.desc}${descriptors.length > 1
                ? ', '
                : descriptors.length === 1
                    ? `, and `
                    : ''
                }`

            // join the descriptors together in a grammatical list: with commas and the word 'and' before the last element
            const descriptorsStr = descriptors.length > 1
                ? `${descriptors.slice(0, -1).join(', ')}, and ${descriptors[descriptors.length - 1]}`
                : descriptors.length === 1
                    ? `${descriptors[0]}`
                    : '';

            usedAndThisSentence = usedAndThisSentence || usesAnd(parts[i][1]);

            const partStr = `${start} ${partName}${materialStr}${descriptorsStr}`;

            // if there's another part after this one, and it will not use the word 'and', merge it into this sentence
            // but don't merge more than two
            // otherwise end the current sentence
            let sentence: string;
            if (!usedAndThisSentence && (i < parts.length - 1) && !usesAnd(parts[i + 1][1])) {
                sentence = `${partStr}, and `
                usedAndThisSentence = true;
            }
            else {
                sentence = `${partStr}.${i === parts.length - 1 ? '' : ' '}`;
                usedAndThisSentence = false;
            }

            description += sentence;

            i++;
        }
        return description;
    }
}