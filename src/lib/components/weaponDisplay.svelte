<script lang="ts">
    import Flasher, {
        type FlasherInterface,
    } from "$lib/components/Flasher.svelte";
    import WeaponDemandsGenerator from "$lib/components/weaponDemandsGenerator.svelte";
    import { pronounLoc } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
    import { textForDamage } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
    import type { WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

    interface Props {
        weapon: WeaponViewModel;
        fadeLock: boolean;
    }

    let { weapon, fadeLock }: Props = $props();

    let flasher: FlasherInterface;

    /** Text for the weapon's damage. i.e. "as sword + d6 + 1"
     */
    const damageString = $derived(textForDamage(weapon.damage));

    const toHitString = $derived(
        weapon.toHit > 0 ? ` (+${weapon.toHit} to hit)` : "",
    );

    function textForCharges(c: number | string | "at will") {
        if (typeof c === "string") {
            return c;
        } else {
            if (c == 1) {
                return "1 charge";
            } else {
                return `${c} charges`;
            }
        }
    }

    function copyWeaponLink() {
        navigator.clipboard.writeText(window.location.href);

        if (flasher !== undefined) {
            flasher.flash();
        }
    }
</script>

<svelte:head>
    <title>Library of Babel - {weapon.name}</title>
</svelte:head>

<div
    class={`weapon-display fade-in-${fadeLock ? "1" : "2"}`}
    data-testid="weapon-display"
>
    <div class="weapon-generator-title-flex">
        <h2
            class={`weapon-class weapon-display-title weapon-rarity-${weapon.rarity}`}
            data-testid="weapon-display-title"
        >
            {weapon?.name?.toTitleCase() ?? ""}
        </h2>
        <div class="link-container">
            <button
                class="inline-button copy-weapon-link"
                onclick={copyWeaponLink}
                aria-label="copy to clipboard"
            >
                <i class={`fa-solid fa-link weapon-rarity-${weapon.rarity}`}
                ></i>
            </button>
            <Flasher bind:this={flasher} text={"copied to clipboard"} />
        </div>
    </div>
    <div class="weapon-display-body" data-test>
        <div class="weapon-display-nonsentient">
            <div class="weapon-generator-row-flex">
                <p class="weapon-desc">
                    {weapon.description}
                </p>
            </div>
            <div class="weapon-generator-row-flex">
                <p class="weapon-damage">
                    <span class="weapon-damage-title">Damage:</span>
                    {damageString}
                    {toHitString}
                </p>
            </div>
            {#if weapon.active.powers.length !== 0}
                <div>
                    <h2>Active Powers</h2>
                    <div class="weapon-generator-row-flex">
                        <p>
                            {textForCharges(weapon.active.maxCharges)}. Regains
                            {#if weapon.sentient}
                                charges when {pronounLoc[weapon.pronouns]
                                    .singular.possessive} demands are fulfilled,
                                and
                            {/if}
                            {weapon.active.rechargeMethod}.
                        </p>
                    </div>
                    <div class="weapon-active-powers-root">
                        {#each weapon.active.powers as power}
                            <div class="weapon-generator-list-item">
                                <p>
                                    <span class="bold"
                                        >{(
                                            power.desc as string
                                        ).toTitleCase()}</span
                                    >
                                    <span
                                        >{`(${textForCharges(
                                            power.cost,
                                        )})`}</span
                                    >
                                </p>
                                {#if power.additionalNotes}
                                    <div>
                                        {#each power.additionalNotes as additionalNote}
                                            <div
                                                class="weapon-generator-list-item"
                                            >
                                                <p>
                                                    {additionalNote}
                                                </p>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if weapon.passivePowers.length !== 0}
                <div>
                    <h2>Passive Powers</h2>
                    <div class="weapon-passive-powers-root">
                        {#each weapon.passivePowers as power}
                            <div class="weapon-generator-list-item">
                                <p>
                                    {power.desc}
                                </p>
                                {#if power.additionalNotes}
                                    <div>
                                        {#each power.additionalNotes as additionalNote}
                                            <div
                                                class="weapon-generator-list-item"
                                            >
                                                <p>
                                                    {additionalNote}
                                                </p>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        {#if weapon.sentient !== false}
            <div class="weapon-display-sentient-info">
                <p class="weapon-display-sentient-info-title">
                    This is a sentient weapon.
                </p>
                <div class="weapon-display-sentient-info-top-half">
                    <div>
                        <h2>Personality</h2>
                        <div class="weapon-personality-root">
                            {#each weapon.sentient.personality as personality}
                                <div class="weapon-generator-list-item">
                                    <p>
                                        {personality}
                                    </p>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <h2>Languages</h2>
                        <div class="weapon-languages-root">
                            {#each weapon.sentient.languages as language}
                                <div class="weapon-generator-list-item">
                                    <p>
                                        {language}
                                    </p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
                {#if weapon.active.powers.length !== 0}
                    <WeaponDemandsGenerator
                        weapon={{
                            // unfortunately we have to spread it like this for the type of 'sentient' to be picked up
                            ...weapon,
                            sentient: weapon.sentient,
                        }}
                    />
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .weapon-display-body > * {
        flex-basis: 0;
    }

    .weapon-display {
        width: 100%;

        flex-grow: 1;

        padding-bottom: 10pt;
    }

    .weapon-display-body {
        display: flex;
        gap: 20pt;
    }

    @media (orientation: landscape) {
        .weapon-display-sentient-info-top-half {
            display: flex;
            justify-content: space-around;
            gap: 1rem;
        }
    }

    @media (orientation: portrait) {
        .weapon-display-body {
            flex-direction: column;
        }
    }

    .weapon-display-nonsentient {
        flex-grow: 2;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .weapon-display-nonsentient h2 {
        margin: 0;
    }
    .weapon-desc {
        margin-left: auto;
        margin-right: auto;
    }

    .weapon-display-sentient-info {
        padding: 10pt;
        flex-grow: 1;
        border-radius: 8px;
    }
    @media (prefers-color-scheme: light) {
        .weapon-display-sentient-info {
            background-color: #d6d6d621;
        }
    }

    @media (prefers-color-scheme: dark) {
        .weapon-display-sentient-info {
            background-color: #31313586;
        }
    }

    .weapon-generator-list-item {
        margin-left: 20pt;
        margin-top: 10pt;
        margin-bottom: 10pt;
        white-space: pre-line;
    }
    .weapon-generator-list-item > p {
        display: inline;
    }
    .weapon-generator-list-item::before {
        content: "•";
        display: inline-block;
        width: 10pt;
        height: 10pt;
    }
    .weapon-display-title {
        font-size: 2rem;
    }
    .weapon-damage-title {
        font-weight: bold;
        text-decoration: underline;
    }
    .weapon-display-sentient-info-title {
        text-align: center;
    }

    .weapon-generator-row-flex {
        padding: 0;
        margin: 0;

        display: flex;
        align-items: center;
        gap: 6pt;
    }
    .weapon-generator-row-flex > * {
        padding: 0;
        margin: 0;
    }

    .weapon-generator-title-flex {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .weapon-damage {
        flex-grow: 1;
        text-wrap: nowrap;
    }

    .copy-weapon-link {
        font-size: 2.5rem;
    }

    .link-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 1rem;
        position: relative;
    }
</style>
