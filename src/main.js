'use strict';

const {
  ipcMain,
  BrowserWindow
} = require('electron');

const relay = (options = {
  eventName: 'default'
}, data = {}) => {
  ElectronIPCUtil.announce(options, data);
};

/** Class ElectronIPCUtil - main process usage */
const ElectronIPCUtil = class {
  constructor() {}
  static init() {
    ipcMain.on('electron-ipc-util.renderer.announce', (e, arg) => {
      e.reply('electron-ipc-util.main.acknowledged', `electron-ipc-util.main has received announcement: '${arg.options.eventName}'`);
      let options = arg.options;
      options.source = e.sender.browserWindowOptions.name;
      relay(options, arg.data);
    });
  }

  /**
   * Send announcement from main process to all renderer (BrowserWindow) processes
   * @param {object} options - Parameter object
   * @param {string} options.eventName - Event name for the announcement.
   * @param {object} data - (optional) Additional data to be passed to subscribed windows
   */
  static announce(options = {
      eventName: 'default'
    },
    data = {}
  ) {

    if (!options.source) {
      options.source = 'main-process';
    }

    BrowserWindow.getAllWindows().forEach(browserWindow => {
      if (browserWindow.webContents.browserWindowOptions.name != options.source) {
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

module.exports = ElectronIPCUtil;
