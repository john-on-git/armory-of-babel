import { expect, test, type Page } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { weaponRarities, type WeaponRarity, type WeaponViewModel } from '../../src/lib/generators/weaponGenerator/weaponGeneratorTypes';

const baseURL = 'http://localhost:5173';

test.beforeEach(async ({ context }) => {
    context.route(`**/api/weapon*`, (route, req) => {

        const url = req.url()
        const weaponId = url.substring(url.indexOf('id=') + 3);

        route.fulfill({
            status: StatusCodes.OK,
            body: JSON.stringify({
                weapons: weaponRarities.reduce((acc, rarity) => {
                    acc[rarity] = {
                        id: `Mock#${weaponId}`,
                        themes: [],
                        rarity: rarity,
                        name: `Lighbrandt the Luminous #${weaponId}`,
                        pronouns: 'enby',
                        isNegative: false,
                        description: '',
                        damage: {
                            as: 'sword'
                        },
                        toHit: 2,
                        active: {
                            maxCharges: 999,
                            rechargeMethod: "a charge every morning",
                            powers: [
                                {
                                    desc: "Light Blast",
                                    cost: 2,
                                    additionalNotes: [
                                        'Summons a blast made of pure light'
                                    ]
                                },
                                {
                                    desc: "Light Slash",
                                    cost: 1,
                                    additionalNotes: [
                                        'Summons a blade made of pure light'
                                    ]
                                }
                            ]
                        },
                        passivePowers: [
                            {
                                desc: "Light Aura",
                                additionalNotes: [
                                    'creates an aura of pure light'
                                ]
                            }],
                        sentient: {
                            personality: ['pious', 'good', 'nice'],
                            languages: ['Common', 'Adamic', 'French'],
                            chanceOfMakingDemands: 6
                        }
                    };
                    return acc;
                }, {} as Record<WeaponRarity, WeaponViewModel>),
                n: 0.5
            })
        })
    })

});

async function expectWeaponVisible(page: Page) {
    // moved into a function so we can easily change the assertions
    return await expect(page.getByTestId('weapon-display')).toBeVisible({ timeout: 10000 });
}

test("When the user refreshes the page, it should always display the same weapon as before.", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(baseURL);
    await expectWeaponVisible(page);
    const htmlBefore = await page.getByTestId('weapon-display').innerHTML();

    // refresh, and the HTML representation should not have changed
    await page.reload();
    await expectWeaponVisible(page);
    await expect(page.getByTestId('weapon-display')).toHaveJSProperty('innerHTML', htmlBefore);
});


test("It should always generate a different weapon each time the user clicks the generate button", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(baseURL);
    await expectWeaponVisible(page);
    const htmlBefore = await page.getByTestId('weapon-display').innerHTML();

    // generate a new weapon, and the HTML representation of the weapon should have changed
    await page.getByTestId("weapon-generator-generate-button").click();
    await expectWeaponVisible(page);
    const htmlAfter = await page.getByTestId('weapon-display').innerHTML();

    // the HTML should be different
    expect(htmlAfter).not.toBe(htmlBefore);
});


test("The user should be able to navigate backwards and forwards using their native browser history functionality.", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(baseURL);
    await expectWeaponVisible(page);
    const firstWeapon = await page.getByTestId('weapon-display').innerHTML();

    // generate a new weapon, and the HTML representation of the weapon should have changed
    await page.getByTestId("weapon-generator-generate-button").click();
    await expectWeaponVisible(page);
    const secondWeapon = await page.getByTestId('weapon-display').innerHTML();

    // the HTML should be different
    expect(firstWeapon).not.toBe(secondWeapon);

    // then go back, and we should be back to the first weapon
    await page.goBack();
    await expectWeaponVisible(page);
    await expect(page.getByTestId('weapon-display')).toHaveJSProperty('innerHTML', firstWeapon);

    // then go forward, and we should be back to the second weapon
    await page.goForward();
    await expectWeaponVisible(page);
    await expect(page.getByTestId('weapon-display')).toHaveJSProperty('innerHTML', secondWeapon);
});



test("The app should store the weapon state in the URL.", async ({ page }) => {
    // visit the page, then wait for the weapon to load for the first time
    await page.goto(baseURL);
    await expectWeaponVisible(page);
    const firstWeaponLocation = page.url();
    await new Promise(resolve => setTimeout(resolve, 3000));

    // generate another weapon, then wait for that to load. this should add another history entry
    await page.getByTestId("weapon-generator-generate-button").click();
    await expectWeaponVisible(page);
    const secondWeaponLocation = page.url();

    // each weapon should have a unique URL
    expect(firstWeaponLocation).not.toBe(secondWeaponLocation);

    // navigate backwards in history, which should send us back to the first weapon
    await page.goBack();
    expect(page.url()).toBe(firstWeaponLocation);

    // navigate forwards, which should send us back to the second weapon
    await page.goForward();
    expect(page.url()).toBe(secondWeaponLocation);

    // navigate backwards, which should send us back to the first weapon again
    await page.goBack();
    expect(page.url()).toBe(firstWeaponLocation);

    // it should not be possible to navigate backwards any further
    expect(await page.goBack()).toBe(null);
});