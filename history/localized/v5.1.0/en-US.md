### Features
- Add PAC support to proxy settings (experimental)
- Add plugin settings; 未卜先知 was the only supported plugin at the time and did not yet use settings in practice
- Show installation progress when installing a plugin by name
- [OS X] Open settings with Cmd + comma
- Add animations when switching panels
- Add a port number option to network settings: use a random available port on each startup by default, or a fixed port, with a warning if that port is occupied

### Fixes
- Fix occasional failures when installing plugins by name
- Fix Flash resolution limits sometimes being too permissive
- Fix poi's window size changing when a low-resolution application is opened while poi is running
- Fix the settings panel being impossible to scroll immediately after startup
- [Windows 10] Fix notification voices and the default system notification sound playing simultaneously
- Change the default theme and fix fresh poi installations sometimes being unresponsive on startup
- Improve the modernization result notification interface
- Switching between split and unsplit panels no longer requires restarting poi; some plugins still require a game refresh
- Fix the window sometimes starting off-screen

### Plugin updates
- Add the 耗资记录 plugin to record resource consumption for each sortie, with filtering and statistics
- Add the 舰娘百科数据收集 plugin to automatically report ship stats, map resource nodes, and other data to the KanColle wiki to help maintain its pages
- [航海日志] Remove the ranking module already provided by 我变强了 and fix occasional white screens on startup
- [未卜先知] Also update data during fleet composition changes and docking
