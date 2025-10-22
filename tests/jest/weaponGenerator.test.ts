import { getWeaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { mkWeapon, mkWeaponsForAllRarities } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { FeatureProviderCollection, WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import _ from "lodash";

const nRuns = 1e2;


describe('Weapon Generator', () => {
    let weaponFeaturesByVersion: FeatureProviderCollection[];

    beforeAll(() => {
        const weaponFeatureVersionController = getWeaponFeatureVersionController();
        weaponFeaturesByVersion = new Array(weaponFeatureVersionController.getLatestVersionNum() + 1).fill(null).map((_, i) => weaponFeatureVersionController.getVersion(i));
    });

    it('1. Always generates a weapon with a number of active abilities matching its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            expect(weapon.active.powers.length).toBe(params.nActive + params.nUnlimitedActive);
        }
    });

    // Passives don't always create a bullepoint in the viewmodel, and sometimes increase the ability cap, 
    // but it shouldn't be wildly different. That might indicate a gracefully handled crash, or an infinite loop in the generation state space 
    it('2. Always generates a weapon with a number of passive abilities approximately equal to its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            // number of languages (excluding the standard option, common). languages are a kind of passive powers
            const nAdditionalLanguages = (weapon.sentient ? weapon.sentient.languages.length - 1 : 0);

            const absDifference = Math.abs(params.nPassive - (weapon.passivePowers.length + nAdditionalLanguages))
            expect(absDifference).toBeLessThanOrEqual(2);
        }
    });

    it('3. Always generates a weapon with a number of charges matching its params, or its most expensive ability, whichever is higher.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            const expected = weapon.active.powers.reduce<number>((acc, x) => Math.max(acc, typeof x.cost === 'string' ? 1 : x.cost), params.nCharges);

            expect(weapon.active.maxCharges).toBe(expected);
        }
    });

    it('4. Always generates a weapon with enough charges to use any of its actives at least once.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            weapon.active.powers.map(x => expect(typeof x.cost === 'string' ? 0 : x.cost).toBeLessThanOrEqual(weapon.active.maxCharges));
        }
    });

    it('5. Always generates a weapon that deals damage.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            expect((Object.values(weapon.damage) as (string | number)[]).some((x) => typeof (x) === 'string' || x > 0)).toBe(true);
        }
    });

    it('6. Always generates a weapon with a non-empty description.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            expect(weapon.description.length).toBeGreaterThan(0);
        }
    });


    it('7. Never generates a weapon with empty description bulletpoints.', () => {
        const notJustWhitespace = /\S+/;

        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, undefined, true);

            weapon.active.powers.forEach((active) => {
                expect(active.desc).toMatch(notJustWhitespace);
                if (active.additionalNotes !== undefined) {
                    active.additionalNotes.forEach(note => expect(note).toMatch(notJustWhitespace))
                }
            });
            weapon.passivePowers.forEach((passive) => expect(passive.desc.length).toBeGreaterThan(0));
        }
    });

    it('8. Never generates a weapon that contains text that is an indicator of broken functionality', () => {
        // i.e. "undefined", "[object ", "null"

        // TODO, will probably mean removing the joke names on the void core ephitets
    })

    it('9. TODO Weapons never contain two components with the same UUID, unless that component is marked non-unique.', () => {
        // for (let i = 0; i < nRuns; i++) {
        //     const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

        // }
    });

    it('10. The weapon that corresponds to a particular set of parameters is fixed and never changes, even when the software is updated.', () => {
        // expect(mkWeapon('test1', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
        //     { id: "test1", themes: ["nature"], rarity: "uncommon", name: "Oak Epee", damage: { as: "sword", const: 1 }, toHit: 1, active: { maxCharges: 4, rechargeMethod: "all charges when its wielder drives a poacher to bankruptcy", powers: [] }, passivePowers: [{ desc: "Can transform into a bouquet of flowers." }], sentient: false }
        // );
        // expect(mkWeapon('test2', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
        //     { id: "test2", themes: ["steampunk"], rarity: "common", name: "Pine Longsword", damage: { as: "sword", const: 0 }, toHit: 0, active: { maxCharges: 0, rechargeMethod: "all charges when its wielder throws a tea party", powers: [] }, passivePowers: [{ desc: "A widget on the weapon displays the time." }], sentient: false }
        // );
        // expect(mkWeapon('test3', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
        //     { id: "test3", themes: ["ice", "light", "dark"], rarity: "legendary", name: "Moronius, Lumensteel Flail", damage: { as: "mace", const: 3 }, toHit: 3, active: { maxCharges: 6, rechargeMethod: "one charge each time you defeat an orc", powers: [{ desc: "Summon Ice Elemental", cost: 6, additionalNotes: ["Dissipates after 1 hour."] }, { desc: "Commune With Divinity", cost: 4 }, { desc: "Commune With Demon", cost: "at will" }] }, passivePowers: [{ desc: "Wielder is immune to the harmful effects of rays & beams." }, { desc: "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape." }, { desc: "Menacing aura. Bonus to saves to frighten & intimidate." }], sentient: { personality: ["Pitiless.", "Tries to act mysterious."], languages: ["Common."], chanceOfMakingDemands: 8 } }
        // );
    });

    it('Manual utility / find a weapon with a particular feature', () => {
        function cond(weapon: WeaponViewModel): boolean {
            return weapon.damage.d6 !== undefined && weapon.damage.d6 >= 2 && weapon.description.includes("glows with arcane energy");
        }
        const start = 2000;
        const attempts = 10_000;

        const end = start + attempts;
        let i = start;
        let weapons: WeaponViewModel[];
        // let n: number;

        do {
            const {
                weapons: nextWeapons,
                //  n: nextN
            } = mkWeaponsForAllRarities((++i).toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1], undefined, undefined, true);
            weapons = _.toArray(nextWeapons);
            // n = nextN;
        } while (i <= end && (!weapons.some(cond)));

        const valid = weapons.filter(cond);

        if (valid.length !== 0) {
            console.log(`Found weapon @ ${i} (${valid.map(x => x.rarity).join(", ")})`);
        }
        else {
            console.error('\x1b[31mfailed to find weapon');
        }
        expect(weapons.some(cond)).toBe(true);
    })
})