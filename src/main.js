'use strict';

const {
  ipcMain,
  BrowserWindow
} = require('electron');

/** Class ElectronIPCUtil - main process usage */
module.exports = class ElectronIPCUtil {
  constructor() {}
  static init() {
    ipcMain.on('electron-ipc-util.renderer.announce', (e, arg) => {
      e.reply('electron-ipc-util.main.acknowledged', `electron-ipc-util.main has received announcement: '${arg.options.eventName}'`);
      let options = arg.options;
      options.source = e.sender.browserWindowOptions.name;
      this.announce(arg.options, arg.data);
    });
  }

  static announce(options = {
      eventName: 'default',
      source: 'main'
    },
    data = {}
  ) {
    // TODO:
    // whitelist: options.whitelist,
    // blacklist: options.blacklist,

    BrowserWindow.getAllWindows().forEach(browserWindow => {
      if (browserWindow.webContents.browserWindowOptions.name != options.source) {
        console.log(options.source);
        browserWindow.webContents.send('electron-ipc-util.main.announce', {
          options: {
            eventName: options.eventName,
            source: options.source
          },
          data: data
        });
      }
    });
  }
}
