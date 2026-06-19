<script lang="ts">
    import { type WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

    interface Props {
        /**
         *  A WeaponViewModel, which is guaranteed to be sentient.
         */
        weapon: Omit<WeaponViewModel, "sentient"> & {
            sentient: Exclude<WeaponViewModel["sentient"], false>;
        };
    }

    let { weapon }: Props = $props();
</script>

<div class="weapon-demands-main">
    <h2 class="weapon-demands-header">Demands</h2>
    <div
        class="weapon-demands-generator"
        id="main-weapon-generator-weapon-demands-generator"
    >
        <p>
            Sentient weapons should issue a new demand each session if one isn't
            pending. The referee has final say over the details of demands, and
            when they are issued.
        </p>
        <p>
            Fulfilling a demand restores charges. If the wielder works against
            the demand, the weapon loses charges instead. This can reduce
            charges below zero. A weapon with negative charges will resist its
            wielder, and can only regain charges by having its demands met.
        </p>
        <div class="weapon-demands-generator-output-container">
            <p class="weapon-demands-generator-output-header">Today's Demand</p>
            <p>
                {weapon.sentient.demands.currentDemand}
            </p>
        </div>
    </div>
</div>

<style>
    .weapon-demands-header {
        margin-bottom: 0;
    }

    .weapon-demands-generator {
        padding: 5pt;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        margin-left: auto;
        margin-right: auto;
    }

    .weapon-demands-generator-output-header {
        font-weight: bold;
    }

    .weapon-demands-generator-output-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
