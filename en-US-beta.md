## POI v12.0.0 changelog

### Breaking

- The non-grid plugin layout option is removed
- [Windows] 32-bit builds are no longer provided, as they are no longer supported by Electron

### Features

- Refreshed plugin drawer, with support of pinning plugin windows. A pinned window keeps its position and size relative to the main window and follows it when the main window is moved. The isolated game window can be pinned in the same way
- Add ship and equipment search: press Ctrl/Cmd+F or use the button in the admiral panel to look up a ship, a piece of equipment or a land base squadron, and poi tells where it sits in the game's own list - filter tab, page and row. Names can be searched in Japanese, in the translated name, in English or in romaji
- Right-click a ship tile to search the equipment she can carry
- Ship and equipment rarity backgrounds are now drawn by poi itself and look sharp at any size
- Add scroll shadow to task panel and plugin list
- Support fighter power calculation of jet fighters
- Support latest game API changes, including fleet preset reordering, equipment recovery on remodel, aircraft slot expansion and land base air corps condition recovery
- Fleet stats of a combined fleet now show the total of both fleets, with the values of the fleet itself available in the tooltip
- Show which fleets meet the requirement for quests that require certain ships
- Equipment icons can now also be taken from the game itself, so equipment poi does not have an icon for is still shown correctly (Thanks to [HetmesAskalana](https://github.com/HetmesAskalana))
- Add new equipment icons (Thanks to [nuclear357](https://github.com/nuclear357))
- Update game data to match latest game version, including AACI / OASW / Special Attack / quest and quest tracking / map / ship tag data
- [macOS] Tray icon now follows system appearance

### Changes

- Update to Electron@44 (Chromium@152)
- Add optional anonymous usage statistics, which can be turned off in Settings - Advanced
- Window now shows up only when it is ready, with smoother animations and refreshed colors
- Stop rendering while minimized to tray (Thanks to [huihuimoe](https://github.com/huihuimoe))
- Misc performance improvements

### Fixes

- Fix crash caused by game popup windows
- Fix ship name not showing in certain cases
- Fix LBAC tooltip showing incorrect status of each squadron
- Fix Fw5 quest not resetting daily
- Fix improvement bonus not counted correctly in fighter power, most notably for the Zero Fighter Model 64 series
- Fix window position and size being lost when poi does not exit normally
- Misc UI fixes
