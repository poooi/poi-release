This release rewrites substantial parts of the code and architecture to simplify future development and maintenance and improve performance.

### Plugin compatibility
- Plugins are gradually moving to the new architecture; future features, support for new game mechanics, and fixes will mainly target the new plugins
- Some new plugins are published in the beta channel; enable “Check beta plugins” under Settings → Extensions → Advanced settings, then check for updates
- New poi versions provide a compatibility interface for old plugins; old poi versions cannot run new plugins
- Older versions from 6.3.0 onward block incompatible plugin upgrades; if an incompatible version is already installed, they refuse to load it and offer a rollback
- Versions 6.2.x and earlier lack compatibility checks: do not upgrade to new plugins or install plugins through poi. If an upgrade causes a black screen, remove the affected plugin and install an offline package compatible with the old version

### Features
- Save main panel data on exit so the main panel and plugins such as ship information can be viewed before logging into the game
- Trigger notifications only after logging into the game
- Add Flash quality settings under Settings → Display settings; changing them reloads Flash
- Show gauge progress for normal maps in the toolbar's map information
- Show bauxite consumption in the notification bar when resupplying
- Improve active quest records so obsolete quests can be removed after active quests are changed on another device
- Add an in-window final-phase notification when entering a map where the gauge can be cleared; at the time, this supported EO maps and non-transport event maps
- Use in-window notifications for plugin updates and crashes, independent of Notification settings → Other

### Plugin updates
- [未卜先知] Fix damage being displayed as -1 when an enemy cut-in misses
- [远征信息] Show unmet expedition requirements when hovering over the three fleets in the middle column, and list the specific requirements in the departure warning
- [我变强了] Support the latest API
- [战斗记录] Show historical battles in a table; organize old records on first launch and display an estimated completion time
- [舰娘信息] Add anti-submarine stats
