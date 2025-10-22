import { weaponRarities, type WeaponRarity, type WeaponViewModel } from '$lib/generators/weaponGenerator/weaponGeneratorTypes';
import { StatusCodes } from 'http-status-codes';

describe("Weapon Generator Main Page", () => {
    beforeEach(() => {
        cy.intercept('/api/generate-weapon*', (req) => {
            if (!('id' in req.query) || !('v' in req.query)) {
                throw new Error(`Frontend violated API contract\n${JSON.stringify(req.query)}`);
            }
            req.reply({
                statusCode: StatusCodes.OK,
                body: {
                    weapons: weaponRarities.reduce((acc, rarity) => {
                        acc[rarity] = {
                            id: `Mock#${req.query['id']}`,
                            themes: [],
                            rarity: rarity,
                            name: `Lighbrandt the Luminous #${req.query['id']}`,
                            shape: {
                                particular: "sword",
                                group: "sword"
                            },
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
                                chanceOfMakingDemands: 7
                            }
                        };
                        return acc;
                    }, {} as Record<WeaponRarity, WeaponViewModel>),
                    n: 0.5
                }
            })
        }).as('generate-weapon');

    });

    it("When the user refreshes the page, it should always display the same weapon as before.", () => {

        // visit the page
        cy.visit("/");

        // wait for the weapon to load for the first time
        cy.getByTestId('weapon-display').should('be.visible').invoke('html').then(($weapon) => {

            // refresh, and the HTML representation should not have changed
            cy.reload();
            cy.getByTestId('weapon-display').should('be.visible').and('have.html', $weapon);
        });
    });


    it("It should always generate a different weapon each time the user clicks the generate button", () => {

        // visit the page
        cy.visit("/");

        // wait for the weapon to load for the first time
        cy.getByTestId('weapon-display').should('be.visible').invoke('html').then(($weapon) => {

            // generate a new weapon, and the HTML representation of the weapon should have changed
            cy.getByTestId("weapon-generator-generate-button").should("be.visible").click();

            cy.getByTestId('weapon-display').should('be.visible').and('not.have.html', $weapon);
        });
    });


    it("The app should add weapons to the users browser history.", () => {

        // visit the page
        cy.visit("/");

        // wait for the weapon to load for the first time
        cy.getByTestId('weapon-display').should('be.visible').invoke('html').then(($firstWeapon) => {

            // generate a new weapon, and the HTML representation of the weapon should have changed
            cy.getByTestId("weapon-generator-generate-button").should("be.visible").click();
            cy.getByTestId('weapon-display').should('be.visible').and('not.have.html', $firstWeapon).invoke('html').then(($secondWeapon) => {

                // then go backwards to the original weapon, and the HTML represenation should be back to what it was before 
                cy.go('back');
                cy.getByTestId('weapon-display').should('be.visible').and('have.html', $firstWeapon);

                // then go forwards, and we should be back to the second weapon again
                cy.go('forward');
                cy.getByTestId('weapon-display').should('be.visible').and('have.html', $secondWeapon);
            })

        });
    });



    it("The app should replace the current entry in the user's browser history if (and only if) this is the first time it is loaded. Otherwise, it should push to history.", () => {
        // keep track of the initial location for assertions later
        cy.location().then((initialLocation) => {

            // visit the page, then wait for the weapon to load for the first time
            cy.visit("/");
            cy.getByTestId('weapon-display').should('be.visible');

            // keep track of that location too
            cy.location().then((firstWeaponLoc) => {

                // generate a new weapon, then wait for that to load. this should add another history entry
                cy.getByTestId("weapon-generator-generate-button").should("be.visible").click();
                cy.getByTestId('weapon-display').should('be.visible');

                // navigate backwards in history, which should send us back to the first weapon
                cy.go('back').location().should((loc) => expect(loc.href).to.be.eq(firstWeaponLoc.href));

                // then do it again, which should send us to the initial location (i.e. about:blank on FireFox)
                cy.go('back').location().should((loc) => expect(loc.href).to.be.eq(initialLocation.href));
            })
        })
    });
});