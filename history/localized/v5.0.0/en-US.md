### New plugin center
- Download, enable, disable, and update plugins independently of poi releases; plugins such as quest information can now follow game updates promptly
- Stop bundling plugins with the application: install them from the plugin center after first launch. Store plugins in the system user directory so they survive removal of the application
- Provide multiple plugin download servers; switch under Settings → Extensions → Advanced settings, then restart poi
- Use offline packages when online downloads are unavailable: extract poi-plugins and install its .tgz files through the plugin center. Each application release provides an offline package of the latest official plugins at that time
- List official plugins even when they are not installed. Third-party plugins published on npmjs.com with names beginning poi-plugin- can be installed by name or from offline packages
- Support searching in the plugin center; each application update summarizes plugin changes since the previous release

### Features
- Add redrawn high-resolution icons, enabled in display settings; these use a flat style and were still being improved at the time
- Add tips about hidden features, precautions, and useful information to the status bar at startup and every half hour, with an option to disable them
- Show modernization results and stat increases in the status bar; “++” and “+” indicate full or half gains for firepower, torpedo, anti-air, and armor, and rounding up or down for luck
- Allow notification settings to control expedition advance warning time in seconds and the fatigue recovery threshold
- Allow sortie checks to specify the required number of empty ship and equipment slots
- Allow customization of the boss key; Mac users can also use the system's Cmd + H shortcut
- Allow customization of the cache directory; the browser cache directory cannot be changed
- Allow Flash size to be set as a percentage
- Add “Lock window size” and “Hide DMM network change warnings” options to the status bar
- Show aircraft capacity for empty equipment slots in the fleet view
- Collapse less frequently used toolbar functions, with an arrow to expand them
- Show Kou, Otsu, and Hei event difficulty in the status bar's map information
- Precompile scripts before release to improve startup speed
- Package the application as .asar to reduce excessively long paths and speed up extraction; change the update package from app.7z to app.asar

### Fixes
- Add an upper limit to window size settings to prevent accidentally creating an excessively large window
- Fix some appearance issues
- Update Electron to v0.36.3; the original announcement says Windows memory leaks “may have improved”

### Plugin updates
- Add the 英语翻译 plugin to translate ship, equipment, and item names into English when the interface language is English
- Add the 我变强了 plugin to calculate ranking points, track ranking positions, and provide related information
- Add the 秘书通知 plugin to replace notification sounds with the selected ship's voice; click “Disable” inside the plugin to restore the original sounds
- Reintroduce the existing entertainment plugin 舰娘黄历 by adding it to the official list
- [未卜先知] Add notifications for item drops during sorties
- [经验计算] Show estimated experience and training cruiser bonuses in the status bar after selecting a PvP opponent; estimates may occasionally be substantially inaccurate
- [经验计算] Show the next remodel level when the current one has been passed, and raise the level cap to 155
- [任务信息] Add English and Japanese translations of all quest requirements and rewards, update quests, and correct some prerequisites
- [编成日记] Improve the interface and allow previewing the current fleet during import without adding a record
- [航海日志] Integrate with battle details: click the icon at the start of a sortie row to open that battle's details; improve appearance, compatibility, and visual effects
- [装备改修] Add a checkbox before each equipment item to pin selected items to the top
- [舰娘信息] Add a “Modernization complete” filter
- [装备信息] Group aircraft by proficiency, show quantities when one ship carries multiple copies of the same equipment, and fix appearance issues
- [一心二用] Fix occasional crashes when opening the plugin
