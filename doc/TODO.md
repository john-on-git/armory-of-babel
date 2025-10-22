- TODO                                                  Difficulty, Time, Impact (1-10)
    - typos.
        - 'intimate' -> 'intimidate'

    - Bugs.
        - Broken weapon @ 60724988481853520000
        - Weapon ID doesn't sync with URL on page load 

    - Generator setup.
        - So, currently there's just one weapon type that's got things with generators inside them.
        - Should be replaced with a weapon model generator that's got generators inside it.
        - And all the features are generators on the outside, rather than containing generators in their desc.
        - Generators should have a UUID and transfer it to the things they generate.  

    - Basic Functionality
        - Version control for features.
            - There should be a piece of state: v or version
            - Every weapon has an associated version.
            - Whenever features are modified, v++
            - There's a stack of deltas that are applied in order up to the current version.
                - add / replace delete
            - At this point, probably replace the UUID setup & just manually assign everything an ID,
              so they can be targeted for replacement / removal later. 
        
            - It'll be best to prioritize this, as the app can't really be used without it.
              And once it's implemented, all the powers will have to be converted over, so the fewer powers the better

        - Configuration.
            - ~~Power level.~~
            - 5e mode.
        

        - ~~Color-coded rarities.~~
        - ~~Weapon shape type based damage.~~
        - ~~Support for conditionally available abilities, beyond themes.~~
            - ~~Personality.~~
            - ~~Active Abilities.~~
            - ~~Passive Abilities.~~
            - ~~Recharge Method.~~
            - ~~Quant for active & passive powers.~~
            - ~~UUID based Quant.~~                         HARD SHORT  4
            - Split languages from passive powers. Current way of doing it is stupid & it's now possible to just have a Language or Misc Power provider. 

        - Sentient demands
            - ", and a charge when one of its demands is fulfilled."
            - 1-in-x to make demands
            - demand generator

        - ~~Implement bonuses for passive abilities.~~

        - UX.                                           EASY LONG   6
            - Link to github.
            - Link to this weapon button.
        - More themes & abilities.                      EASY LONG   8
            - 'pets'
        
        - ~~Names / Namelist~~                          EASY LONG   7
        - Descriptions.                                 HARD LONG   4
        - Automated Testing.                            HARD LONG   ~
    - Advanced.
        - add @vercel/analytics                         EASY SHORT  3
        - User configuration menu & settings.           EASY SHORT  4
        - Bookmark weapons functionality.               EASY SHORT  3
        - Automated Testing.                            HARD SHORT  ~