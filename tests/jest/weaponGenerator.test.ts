import { weaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { mkWeapon } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { FeatureProviderCollection } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

const nRuns = 10e1;


describe('Weapon Generator', () => {
    let weaponFeaturesByVersion: FeatureProviderCollection[];

    beforeAll(() => {
        weaponFeaturesByVersion = new Array(weaponFeatureVersionController.getLatestVersionNum() + 1).fill(null).map((_, i) => weaponFeatureVersionController.getVersion(i));
    });

    it('1. Always generates a weapon with a number of active abilities matching its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

            expect(weapon.active.powers.length).toBe(params.nActive + params.nUnlimitedActive);
        }
    });

    it('2. Always generates a weapon with a number of passive abilities matching its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

            // number of languages (excluding the standard option, common). languages are a kind of passive powers
            const nAdditionalLanguages = (weapon.sentient ? weapon.sentient.languages.length - 1 : 0);

            expect(weapon.passivePowers.length + nAdditionalLanguages).toBe(params.nPassive);
        }
    });

    it('3. Always generates a weapon with a number of charges matching its params, or its most expensive ability, whichever is higher.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

            const expected = weapon.active.powers.reduce<number>((acc, x) => Math.max(acc, typeof x.cost === 'string' ? 0 : x.cost), params.nCharges);

            expect(weapon.active.maxCharges).toBe(expected);
        }
    });

    it('4. Always generates a weapon with enough charges to use any of its actives at least once.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

            weapon.active.powers.map(x => expect(typeof x.cost === 'string' ? 0 : x.cost).toBeLessThanOrEqual(weapon.active.maxCharges));
        }
    });

    it('5. Always generates a weapon that deals damage.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(i.toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]);

            expect((Object.values(weapon.damage) as (string | number)[]).some((x) => typeof (x) === 'string' || x > 0)).toBe(true);
        }
    });

    it('6. The weapon that corresponds to a particular set of args is fixed and never changes, even when the software is updated.', () => {
        expect(mkWeapon('test1', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
            { id: "test1", themes: ["nature"], rarity: "uncommon", name: "Oak Epee", damage: { as: "sword", const: 1 }, toHit: 1, active: { maxCharges: 4, rechargeMethod: "all charges when its wielder drives a poacher to bankruptcy", powers: [] }, passivePowers: [{ desc: "Can transform into a bouquet of flowers." }], sentient: false }
        );
        expect(mkWeapon('test2', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
            { id: "test2", themes: ["steampunk"], rarity: "common", name: "Pine Longsword", damage: { as: "sword", const: 0 }, toHit: 0, active: { maxCharges: 0, rechargeMethod: "all charges when its wielder throws a tea party", powers: [] }, passivePowers: [{ desc: "A widget on the weapon displays the time." }], sentient: false }
        );
        expect(mkWeapon('test3', weaponFeaturesByVersion[0]).weaponViewModel).toEqual(
            { id: "test3", themes: ["ice", "light", "dark"], rarity: "legendary", name: "Moronius, Lumensteel Flail", damage: { as: "mace", const: 3 }, toHit: 3, active: { maxCharges: 6, rechargeMethod: "one charge each time you defeat an orc", powers: [{ desc: "Summon Ice Elemental", cost: 6, additionalNotes: ["Dissipates after 1 hour."] }, { desc: "Commune With Divinity", cost: 4 }, { desc: "Commune With Demon", cost: "at will" }] }, passivePowers: [{ desc: "Wielder is immune to the harmful effects of rays & beams." }, { desc: "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape." }, { desc: "Menacing aura. Bonus to saves to frighten & intimidate." }], sentient: { personality: ["Pitiless.", "Tries to act mysterious."], languages: ["Common."], chanceOfMakingDemands: 8 } }
        );
    });

    // it('Manual utility / find a weapon with a particular feature', () => {
    //     function cond(weapon: WeaponViewModel): boolean {
    //         return (
    //             weapon.passivePowers.some(x => x.desc.includes('pocket plane')) &&
    //             weapon.passivePowers.some(x => x.desc.includes('into their hand at will'))
    //         );
    //     }
    //     const start = 0;
    //     const attempts = 10000;

    //     const end = start + attempts;
    //     let i = start;
    //     let weapon: WeaponViewModel;

    //     do {
    //         weapon = mkWeapon((++i).toString(), weaponFeaturesByVersion[weaponFeaturesByVersion.length - 1]).weaponViewModel;
    //     } while (i <= end && !cond(weapon));

    //     if (cond(weapon)) {
    //         console.log(JSON.stringify(weapon, undefined, 1));
    //     }
    //     else {
    //         console.error(JSON.stringify(weapon, undefined, 1));
    //     }
    //     expect(cond(weapon)).toBe(false);
    // })
})