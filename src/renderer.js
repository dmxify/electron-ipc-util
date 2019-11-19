'use strict';

const {
  ipcRenderer,
  remote
} = require('electron');

/** Class ElectronIPCUtil - renderer process usage */
module.exports = class ElectronIPCUtil {
  constructor() {
    this._subscriptions = {};
    this._blacklist = {};
  }

  init() {
    ipcRenderer.on('electron-ipc-util.main.acknowledged', (event, args) => {
      console.log(args);
    });
    ipcRenderer.on('electron-ipc-util.main.announce', (event, args) => {
      if (this._subscriptions[args.options.eventName]) {
        this._subscriptions[args.options.eventName](args);
      }
    });
  }

  static announce(options = {
      eventName: 'default'
    },
    data = {}
  ) {
    ipcRenderer.send('electron-ipc-util.renderer.announce', {
      options: {
        eventName: options.eventName,
        source: remote.getCurrentWindow().webContents.browserWindowOptions.name
      },
      data: data
    });
  }

  subscribe(eventName, callback = () => {
    console.log('window "' + remote.getCurrentWindow().webContents.browserWindowOptions.name + '": callback not passed as parameter for event: "' + eventName + '"');
  }) {
    this._subscriptions[eventName] = callback;
  }

  static ignore(eventName) {}
}
