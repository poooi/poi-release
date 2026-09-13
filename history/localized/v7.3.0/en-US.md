### Frequently Changing Data (FCD)
- Move frequently updated data, including maps, event ship locks, and map gauges, into the FCD module
- Check and update FCD at every poi startup and include current data with each new poi version, allowing data updates without a new application or plugin release
- Show the FCD version and provide a manual update check under Settings → About poi

### Features
- Support updating land-based air squadron information for multiple areas
- Support letter-based map node labels
- Support jet aircraft mechanics
- Support Flash display mode settings
- Show air power excluding proficiency and improvement bonuses for air support
- Add supporting organizations to the About page

### Fixes
- Fix the display of evacuated ships and air power calculations when a carrier evacuates
- Fix the minimap when map data is incomplete, such as the 2016 Autumn E5 unlock mechanism
- Fix the network reconnection count setting
- Fix an Electron issue that sometimes made the volume toggle, refresh button, and other controls unresponsive
- [Windows] Fix cursor flickering on high-resolution displays

### Plugin updates
- [未卜先知] Refactor and redesign the interface, support 6v12 and 12v12 displays and base air defense results, and use letter-based node labels with poi 7.3.0 or later
- [任务信息] Update to the latest data
- [装备改修] Update to the latest data and show the Ne Type Engine as an improvement material
- [经验计算] Add a fixed-experience calculation mode
- [战斗详情] Support jet assault and filtered browsing
- [泊地修理] Fix timer display and reset behavior
