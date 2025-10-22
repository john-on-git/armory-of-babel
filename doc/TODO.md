- TODO                                                  Difficulty, Time, Impact (1-10)
    - Bugs.
        - API blasting
            - local caching for weapons
            - sort out the bad performance on providers

    - Generator setup.
        - Configuration.
            - Ban / Force Themes
            - 5e mode.

        - ~~Implement bonuses for passive abilities.~~

        - Information page.

        - UX.                                           EASY LONG   6
            - Link to this weapon button.
            - Warning countdown for breaking updates.
            - Prefetching queue for weapons             EASY SHORT  8

        - More themes & abilities.
            - 'pets'                                    EASY LONG   6
        
        - ~~Names / Namelist~~                          EASY LONG   7
        - Descriptions.                                 HARD LONG   4
        - Automated Testing.                            HARD LONG   ~
    - Advanced.
        - ~~add @vercel/analytics                         EASY SHORT  3~~
        - Bookmark weapons functionality.               EASY SHORT  3
        - Automated Testing.                            EASY LONG  ~

- Done
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