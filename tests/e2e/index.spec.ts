import { expect, test } from '@playwright/test';
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

test("When the user refreshes the page, it should always display the same weapon as before.", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(`${baseURL}/`);
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // refresh, and the HTML representation should not have changed
    const htmlBefore = await page.getByTestId('weapon-display').innerHTML();
    await page.reload();

    // wait for the weapon to reload for the first time
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // the HTML should be identical
    expect(htmlBefore === await page.getByTestId('weapon-display').innerHTML());
});


test("It should always generate a different weapon each time the user clicks the generate button", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(`${baseURL}/`);
    await expect(page.getByTestId('weapon-display')).toBeVisible();


    // generate a new weapon, and the HTML representation of the weapon should have changed
    const htmlBefore = await page.getByTestId('weapon-display').innerHTML();

    await page.getByTestId("weapon-generator-generate-button").click();
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // the HTML should be different
    expect(htmlBefore !== await page.getByTestId('weapon-display').innerHTML());
});


test("The app should add weapons to the users browser history.", async ({ page }) => {

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(`${baseURL}/`);
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // generate a new weapon, and the HTML representation of the weapon should have changed
    const firstWeapon = await page.getByTestId('weapon-display').innerHTML();
    await page.getByTestId("weapon-generator-generate-button").click();
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // the HTML should be different
    expect(firstWeapon !== await page.getByTestId('weapon-display').innerHTML());
    const secondWeapon = await page.getByTestId('weapon-display').innerHTML();

    // then go back, and we should be back to the first weapon
    await page.goBack();

    // wait for the weapon to reload
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // the HTML should reset back to match the original
    expect(firstWeapon === await page.getByTestId('weapon-display').innerHTML());

    // then go forward, and we should be back to the second weapon
    await page.goForward();

    expect(secondWeapon === await page.getByTestId('weapon-display').innerHTML());
});



test("The app should replace the current entry in the user's browser history if (and only if) this is the first time it is loaded. Otherwise, it should push to history.", async ({ page }) => {
    // keep track of the initial location for assertions later
    const initialLocation = page.url();

    // visit the page, then wait for the weapon to load for the first time
    await page.goto(`${baseURL}/`);
    await expect(page.getByTestId('weapon-display')).toBeVisible();

    // keep track of that location too
    const firstWeaponLocation = page.url();

    // generate a new weapon, then wait for that to load. this should add another history entry
    await page.getByTestId("weapon-generator-generate-button").click();
    await expect(page.getByTestId('weapon-display')).toBeVisible();
    const secondWeaponLocation = page.url();


    // navigate backwards in history, which should send us back to the first weapon
    await page.goBack();
    expect(firstWeaponLocation === page.url());
    // navigate forwards, which should send us back to the second weapon
    await page.goForward();
    expect(secondWeaponLocation === page.url());
    // navigate backwards, which should send us back to the first weapon again
    await page.goBack();
    expect(firstWeaponLocation === page.url());
    // then navigate backwards again, which should send us to the initial location (i.e. about:blank on FireFox)
    await page.goBack();
    expect(initialLocation === page.url());
});