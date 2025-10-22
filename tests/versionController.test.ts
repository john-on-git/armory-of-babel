import { Patchable, VersionController } from "$lib/util/versionController";

describe('VersionController', () => {
    it('It should correctly apply the updates in this simple example.', () => {
        interface Stats {
            atk: number;
            def: number;
        }

        class Animal extends Patchable {
            species: string;
            stats: Stats | null;

            constructor(UUID: string, species: string, stats: Stats | null) {
                super(UUID);

                this.species = species;
                this.stats = stats;
            }
        }

        class Plant extends Patchable {
            species: string;

            constructor(UUID: string, species: string) {
                super(UUID);

                this.species = species;
            }
        }

        type DeltaType = {
            plants: Plant;
            animals: Animal;
        } | {
            plants: Plant;
        } | {
            animals: Animal;
        }

        const myVersionController = new VersionController<DeltaType>([{
            plants: {
                add: [
                    new Plant('sea-plant', 'sponge')
                ]
            },
            animals: {
                add: [
                    new Animal('sea-carnivore', 'anomalocaris', { atk: 10, def: 5 }),
                    new Animal('sea-herbivore', 'trilobite', { atk: 0, def: 20 }),
                ]
            }
        }, {
            plants: {
                add: [
                    new Plant('land-plant', 'fern')
                ]
            },
            animals: {
                add: [
                    new Animal('land-carnivore', 'tiktaalik', { atk: 5, def: 5 })
                ],
                remove: new Set(['sea-carnivore'])
            }
        }, {
            plants: {
                modify: {
                    'land-plant': { species: 'neuropteris' },
                }
            },
            animals: {
                modify: {
                    'not-a-key': { species: 'seaweed' },
                    'sea-herbivore': { stats: { def: 30 } }
                }
            }
        }, {
            animals: {
                modify: {
                    'sea-herbivore': { stats: null }
                }
            }
        }], (x) => x);

        expect(myVersionController.getVersion(0)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge')],
            animals: [
                new Animal('sea-carnivore', 'anomalocaris', { atk: 10, def: 5 }),
                new Animal('sea-herbivore', 'trilobite', { atk: 0, def: 20 })
            ]
        });

        expect(myVersionController.getVersion(1)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge'),
                new Plant('land-plant', 'fern')
            ],
            animals: [
                new Animal('sea-herbivore', 'trilobite', { atk: 0, def: 20 }),
                new Animal('land-carnivore', 'tiktaalik', { atk: 5, def: 5 })
            ]
        });

        expect(myVersionController.getVersion(2)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge'),
                new Plant('land-plant', 'neuropteris')
            ],
            animals: [
                new Animal('sea-herbivore', 'trilobite', { atk: 0, def: 30 }),
                new Animal('land-carnivore', 'tiktaalik', { atk: 5, def: 5 })
            ]
        });

        expect(myVersionController.getVersion(3)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge'),
                new Plant('land-plant', 'neuropteris')
            ],
            animals: [
                new Animal('sea-herbivore', 'trilobite', null),
                new Animal('land-carnivore', 'tiktaalik', { atk: 5, def: 5 })
            ]
        });


        expect(myVersionController.getVersion(4)).toBeUndefined();
        expect(myVersionController.getVersion(-1)).toBeUndefined();
        expect(myVersionController.getVersion(NaN)).toBeUndefined();
    })
})