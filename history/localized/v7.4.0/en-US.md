### Features
- Support Formula 33 line-of-sight calculations with different equipment coefficients, available in the fleet panel
- Show individual ship speed and fleet speed
- Allow the final-battle notification to be disabled in settings
- Update some equipment icons and support new equipment from the 2017 Winter event
- Improve game screen scaling
- Add automatic plugin updates, enabled through the plugin settings panel
- Improve FCD data updates
- Add safe mode, which does not automatically enable plugins; use --safe or -S on the command line, or “Start in safe mode next time” in settings
- Allow adjustment of the panel area's minimum width or height to provide more room for panels
- [Linux] Add a tray icon, which can be disabled in settings
- [Windows] Also create a poi (safe mode) shortcut when shortcut creation on startup is enabled

### Fixes
- Fix network errors with a negative retry count, and retry messages still appearing when the count is 0
- Automatically move users of the discontinued Tsinghua plugin mirror to another mirror

### Plugin updates
- Fix 未卜先知 identifying the wrong fleet when a fleet other than the first participates in PvP
- [舰娘信息] Remove the sorting settings area and show the current sort order in the table header; align sorting with the game
- [舰娘信息] Allow multiple broad ship categories to be selected and add an “Other ships” category to help find seaplane tenders, submarine aircraft carriers, supply ships, landing ships, and repair ships
- [舰娘信息] Use the main application's tooltips for reinforcement expansion equipment and show the ship's fleet
- [舰娘信息] Allow switching between base stats and stats including equipment bonuses, and between a single page and pagination
- [舰娘信息] Add “In a fleet”, “Sparkled”, and “Reinforcement expansion” filters; use the main application's FCD data for sortie restriction filters
- [舰娘信息] Add a button to reset all filters and display settings, support custom CSS and scaling, and fix repair time per HP
- [经验计算] Fix the vertical layout; sort ships of the same level by remaining experience to the next level in ascending order
- [远征信息] Fix Daihatsu bonus calculations and display, support Kinu Kai Ni and Toku Daihatsu bonuses, and show specific reasons for some unmet requirements
- [未卜先知] Show the previous battle's formation in next-node information; show both fleet names and enemy firepower, torpedo, anti-air, and armor stats during battle, with settings to toggle these displays
