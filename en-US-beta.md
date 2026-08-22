## POI v12.0.0 changelog

### Breaking

- Plugins relying on deprecated global variables and global IPC will no longer work and need to be updated
- The non-grid plugin layout option is removed

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
- Add new equipment icons
- Update game data to match latest game version, including AACI / OASW / Special Attack / quest and quest tracking / map / ship tag data
- [macOS] Tray icon now follows system appearance

### Changes

- Update to Electron@43 (Chromium@150)
- Add optional anonymous usage statistics, which can be turned off in Settings - Advanced
- Window now shows up only when it is ready, with smoother animations and refreshed colors
- Misc performance improvements

### Fixes

- Fix crash when opening, closing or reloading plugins
- Fix crash caused by game popup windows
- Fix ship name not showing in certain cases
- Fix custom background not working
- Fix LBAC tooltip showing incorrect status of each squadron
- Fix Fw5 quest not resetting daily
- Fix window position and size being lost when poi does not exit normally
- Fix incorrect condition timer and notification messages
- Misc UI fixes
