<script lang="ts">
    import WeaponDemandsGenerator from "$lib/components/weaponDemandsGenerator.svelte";
    import { textForDamage } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
    import type { WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";

    interface Props {
        weapon: WeaponViewModel;
        fadeLock: boolean;
    }

    let { weapon, fadeLock }: Props = $props();

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
</script>

<div
    class={`weapon-display fade-in-${fadeLock ? "1" : "2"}`}
    data-testid="weapon-display"
>
    <h2
        class={`weapon-class weapon-display-title weapon-rarity-${weapon.rarity}`}
        data-testid="weapon-display-title"
    >
        {weapon?.name ?? ""}
    </h2>
    <div class="weapon-display-body" data-test>
        <div class="weapon-display-powers">
            <div class="weapon-generator-row-flex">
                <p class="weapon-damage">
                    <span class="weapon-damage-title">Damage:</span>
                    {damageString}
                    {toHitString}
                </p>
                <p class="weapon-desc">
                    {weapon.description}
                </p>
            </div>
            {#if weapon.active.powers.length !== 0}
                <div>
                    <h2>Active Powers</h2>
                    <div class="weapon-generator-row-flex">
                        <p>
                            {textForCharges(weapon.active.maxCharges)}. Regains
                            {#if weapon.sentient}
                                charges when its demands are fulfilled, and
                            {/if}
                            {weapon.active.rechargeMethod}.
                        </p>
                    </div>
                    <div class="weapon-active-powers-root">
                        {#each weapon.active.powers as power}
                            <div class="weapon-generator-list-item">
                                <p>
                                    {`${(power.desc as string).capFirst()} (${textForCharges(power.cost)}).`}
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
        overflow-y: auto;

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

    .weapon-display-powers {
        flex-grow: 2;
    }
    .weapon-display-sentient-info {
        padding: 10pt;
        flex-grow: 1;
        border-radius: 8px;

        background-color: hsla(0, 0%, 100%, 1.5%);
    }

    .weapon-generator-list-item {
        margin-left: 20pt;
        margin-top: 10pt;
        margin-bottom: 10pt;
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
    .weapon-damage {
        flex-grow: 1;
        text-wrap: nowrap;
    }

    .weapon-desc {
        margin-left: auto;
    }
</style>
