import { mkGen } from "$lib/generators/recursiveGenerator";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import type { ActivePower, PassivePower, Theme, WeaponFeaturesTypes, WeaponPowerCond } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";

export default {
    themes: {},
    descriptors: {},
    personalities: {},
    rechargeMethods: {},
    actives: {
        add: [
            new ProviderElement<ActivePower, WeaponPowerCond>('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            light: 'The weapon emits a tether of luminous energy.',
                            fire: 'The weapon emit a fiery whip.',
                            nature: "A sturdy vine grows from the weapon's tip.",
                            cloud: "The weapon emits a vortex of air."
                        } satisfies Partial<Record<Theme, string>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];

                        const tetherTheme = effects[supportedThemesOfWeapon.choice(rng)];
                        //const tetherTheme = typeof chosen === "string" ? chosen : chosen(rng)

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            })
        ]
    },
    passives: {
        add: [
            new ProviderElement<PassivePower, WeaponPowerCond>('the-horn',
                {
                    miscPower: true,
                    desc: "The weapon is also a horn. Your musical skill is doubled when you play it."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        any: ['club']
                    },
                }
            )
        ],
        modify: {
            'instant-recall': {
                cond: {
                    UUIDs: {
                        none: ['magic-pocket']
                    }
                }
            }
        }
    },
    languages: {},
    shapes: {}
} satisfies DeltaCollection<WeaponFeaturesTypes>;