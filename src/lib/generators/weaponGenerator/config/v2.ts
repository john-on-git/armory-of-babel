import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { type ActivePower, type PassivePower, type WeaponFeaturesTypes, type WeaponPowerCond } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";

export default {
    shapes: {},
    descriptors: {
    },
    actives: {
        add: [
            new ProviderElement<ActivePower, WeaponPowerCond>('frostbound', {
                desc: 'Bind',
                cost: 1,
                additionalNotes: [
                    'Lock a mechanism in place with magical ice as strong as steel.',
                    'It stays frozen for 2d6 × 10 minutes.'
                ]
            }, {
                themes: {
                    any: new Set(['ice'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('rally-person', {
                desc: 'Rally',
                cost: 1,
                additionalNotes: [
                    'Targets one non-hostile character.',
                    'For the rest of the day, their morale cannot break.'
                ]
            }, {
                themes: {
                    any: new Set(['light', 'steampunk'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('homing-shot', {
                desc: 'Homing Shot',
                cost: 1,
                additionalNotes: [
                    'Fire an enchanted shot, which always hits.'
                ]
            }, {
                shapeFamily: {
                    any: new Set(['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('binding-shot', {
                desc: 'Binding Shot',
                cost: 2,
                additionalNotes: [
                    'Fire an enchanted shot, which anchors the target to a nearby surface.',
                    'They are stuck in place until they use their turn to successfully save and escape.'
                ]
            }, {
                themes: { any: new Set(['nature', 'ice']) },
                shapeFamily: {
                    any: new Set(['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('black-flame-blast', {
                desc: 'Black Flame Blast',
                cost: 3,
                additionalNotes: [
                    'Summon a 20-ft cone of black flame, which deals 4d6 damage.',
                    'Damage inflicted by black flames can only be healed by magic.'
                ]
            }, {
                themes: { all: new Set(['dark', 'fire']) }
            })
        ]
    },
    passives: {
        add: [
            new ProviderElement<PassivePower, WeaponPowerCond>('weapon-permanently-invisible',
                {
                    miscPower: true,
                    desc: 'The weapon is completely invisible, except to its wielder.'
                },
                {
                    themes: {
                        any: new Set(['light'])
                    },
                    rarity: {
                        gte: 'epic'
                    },
                    isSentient: true // If it can't call out to you, how will you know it's there?
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('instant-recall',
                {
                    miscPower: true,
                    desc: "The wielder can summon the weapon into their hand at will, so long as it's on the same plane."
                },
                {
                    rarity: {
                        gte: 'uncommon'
                    },
                }
            )
        ]
    },
    languages: {},
    themes: {},
    personalities: {},
    rechargeMethods: {},
} satisfies DeltaCollection<WeaponFeaturesTypes>;