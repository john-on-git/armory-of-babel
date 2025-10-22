- TODO                                                  Difficulty, Time, Impact (1-10)

    - could add overlapping themes, it wouldn't break anything.
        - discrete latent space? map it all out
        - what about descriptors? lot of work...
        - It's possible to split a theme into multiple themes 
          with identical options, then chip away gradually, making them different.
          Though, in the meantime you end up with basically one theme with a higher weight.

    - Weapons with shafts should allow both hard & holding materials on it.

    - 400 page for invalid weapons

    - Oddities.
        - Zelda magic shoot sword ability can roll on ranged weapons. Kinda funny though.
        - Steampunk theme should disallow natural materials.

    - Generator setup.
        - Configuration.
            - Ban / Force Themes
            - 5e mode.

        - ~~Implement bonuses for passive abilities.~~

        - Information page.

        - UX.                                           EASY LONG   6
            - Weapon button is unclear?
            - Link to this weapon button.
            - Warning countdown for breaking updates.
            - Prefetching queue for weapons             EASY SHORT  8

        - More themes & abilities.
            - 'pets'                                    EASY LONG   6
        
        - ~~Names / Namelist~~                          EASY LONG   7
        - Descriptions.                                 HARD LONG   4
        - Automated Testing.                            HARD LONG   ~
    - Advanced.
        - Bookmark weapons functionality.               EASY SHORT  3
        - Automated Testing.                            EASY LONG  ~
            - WIP
            - TODO UI test for weapon exists regression

- Done
    - Bugs
        - ~~API blasting~~
            - Main culprit is that it makes a call every time the odds (and other config) change, and this is kind of unavoidable
                - The generate-weapon API should not be parameterised on rarity,
                  instead it should just return a dict of weapons with these parameters, keyed by rarity.
                  And then the UI holds this and just displays the active one.
                - We could also have it only call when you stop adjusting the rarity but the UX on that is worse IMO
            - local caching for weapons
            - sort out the bad performance on providers
    - Basic Functionality
        - ~~Version control for features.~~
            - ~~There should be a piece of state: v or version
            - ~~Every weapon has an associated version.
            - ~~Whenever features are modified, v++
            - ~~There's a stack of deltas that are applied in order up to the current version.
                - ~~add / replace delete
            - ~~At this point, probably replace the UUID setup & just manually assign everything an ID,
              ~~so they can be targeted for replacement / removal later. 
        
            - It'll be best to prioritize this, as the app can't really be used without it.
              And once it's implemented, all the powers will have to be converted over, so the fewer powers the better

        - Generator Setup
            - ~~Color-coded rarities.~~
            - ~~Weapon shape type based damage.~~
            - Configuration
                - ~~Power level.~~
            - ~~Support for conditionally available abilities, beyond themes.~~
                - ~~Personality.~~
                - ~~Active Abilities.~~
                - ~~Passive Abilities.~~
                - ~~Recharge Method.~~
                - ~~Quant for active & passive powers.~~
                - ~~UUID based Quant.~~                         HARD SHORT  4
                - ~~Split languages from passive powers. Current way of doing it is stupid & it's now possible to just have a Language or Misc Power provider.~~
                
        - Sentient demands
            - ", and a charge when one of its demands is fulfilled."
            - 1-in-x to make demands
            - demand generator
    - Advanced.
        - ~~add @vercel/analytics                         EASY SHORT  3~~