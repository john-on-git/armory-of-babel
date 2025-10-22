import { Patchable, VersionController } from "$lib/util/VersionController";

describe('VersionController', () => {
    it('should correctly apply the updates in this simple example', () => {
        class Animal extends Patchable {
            species: string;

            atk: number;
            def: number;

            constructor(UUID: string, species: string, atk: number, def: number) {
                super(UUID);

                this.species = species;
                this.atk = atk;
                this.def = def;
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
        }

        const myVersionController = new VersionController<Plant | Animal, DeltaType>([{
            plants: {
                add: [
                    new Plant('sea-plant', 'sponge')
                ]
            },
            animals: {
                add: [
                    new Animal('sea-carnivore', 'anomalocaris', 10, 5),
                    new Animal('sea-herbivore', 'trilobite', 0, 20),
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
                    new Animal('land-carnivore', 'tiktaalik', 5, 5)
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
                    'sea-herbivore': { def: 30 }
                }
            }
        }]);

        expect(myVersionController.getVersion(0)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge')],
            animals: [
                new Animal('sea-carnivore', 'anomalocaris', 10, 5),
                new Animal('sea-herbivore', 'trilobite', 0, 20)
            ]
        });

        expect(myVersionController.getVersion(1)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge'),
                new Plant('land-plant', 'fern')
            ],
            animals: [
                new Animal('sea-herbivore', 'trilobite', 0, 20),
                new Animal('land-carnivore', 'tiktaalik', 5, 5)
            ]
        });

        expect(myVersionController.getVersion(2)).toEqual({
            plants: [
                new Plant('sea-plant', 'sponge'),
                new Plant('land-plant', 'neuropteris')
            ],
            animals: [
                new Animal('sea-herbivore', 'trilobite', 0, 30),
                new Animal('land-carnivore', 'tiktaalik', 5, 5)
            ]
        });

    })
})