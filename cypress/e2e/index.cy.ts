import { StatusCodes } from 'http-status-codes';
import { type WeaponViewModel } from '../../src/lib/generators/weaponGenerator/weaponGeneratorTypes';

describe("Weapon Generator Main Page", () => {
    beforeEach(() => {
        cy.intercept('/api/generate-weapon*', (req) => {
            req.reply({
                statusCode: StatusCodes.OK,
                body: {
                    id: `Mock#${req.query['id']}`,
                    themes: [],
                    rarity: "rare",
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
                        rechargeMethod: "",
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
                } satisfies WeaponViewModel
            })
        }).as('generate-weapon');

    });

    it("Should always display the same weapon as before when the user refreshes the page", () => {

        // visit the page
        cy.visit("/");

        // wait for the weapon to load for the first time
        cy.getByTestId('weapon-display').should('be.visible').invoke('html').then((weaponName) => {

            // refresh, and the HTML representation should not have changed
            cy.reload();
            cy.getByTestId('weapon-display').should('be.visible').and('have.html', weaponName);
        });
    });
});