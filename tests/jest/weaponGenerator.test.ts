import { weaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { mkWeapon } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { FeatureProviderCollection } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

const nRuns = 10e1;


describe('Weapon Generator', () => {
    let weaponFeatures: FeatureProviderCollection;

    beforeAll(() => {
        const weaponFeaturesOrUndefined = weaponFeatureVersionController.getVersion(0);
        expect(weaponFeaturesOrUndefined).not.toBeUndefined();
        if (weaponFeaturesOrUndefined !== undefined) {
            weaponFeatures = weaponFeaturesOrUndefined;
        }
    })
    it('1. Always generates a weapon with a number of active abilities matching its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(weaponFeatures, i.toString());

            expect(weapon.active.powers.length).toBe(params.nActive + params.nUnlimitedActive);
        }
    });

    it('2. Always generates a weapon with a number of passive abilities matching its params.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(weaponFeatures, i.toString());

            // number of languages (excluding the standard option, common). languages are a kind of passive powers
            const nAdditionalLanguages = (weapon.sentient ? weapon.sentient.languages.length - 1 : 0);

            expect(weapon.passivePowers.length + nAdditionalLanguages).toBe(params.nPassive);
        }
    });

    it('3. Always generates a weapon with a number of charges matching its params, or its most expensive ability, whichever is higher.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon, params } = mkWeapon(weaponFeatures, i.toString());

            const expected = weapon.active.powers.reduce<number>((acc, x) => Math.max(acc, typeof x.cost === 'string' ? 0 : x.cost), params.nCharges);

            expect(weapon.active.maxCharges).toBe(expected);
        }
    });

    it('4. Always generates a weapon with enough charges to use any of its actives at least once.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(weaponFeatures, i.toString());

            weapon.active.powers.map(x => expect(typeof x.cost === 'string' ? 0 : x.cost).toBeLessThanOrEqual(weapon.active.maxCharges));
        }
    });

    it('5. Always generates a weapon that deals damage.', () => {
        for (let i = 0; i < nRuns; i++) {
            const { weaponViewModel: weapon } = mkWeapon(weaponFeatures, i.toString());

            expect((Object.values(weapon.damage) as (string | number)[]).some((x) => typeof (x) === 'string' || x > 0)).toBe(true);
        }
    })
})