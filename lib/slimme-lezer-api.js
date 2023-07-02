const { Client } = require('esphome-native-api');

class SlimmeLezerApi {
  constructor(ip_address, port, log) {
    this.updateAddress(ip_address, 6053);
    this.setupClient();
    this.dataEntries = {};
    this.lastUpdate = null;
    this.log = log;
  }

  updateAddress(ip_address, port) {
    this.ip_address = ip_address;
    this.port = port
  }

  setupClient() {
    this.client = new Client({
      host: this.ip_address,
      port: this.port,
      initializeSubscribeLogs: true,
      clientInfo: 'homey'
    });
  }

  async connect() {
    this.client.connect();
    this.startDeviceListeners();
  }

  async disconnect() {
    this.client.disconnect();
  }

  async startDeviceListeners() {
    this.client.on('logs', ({ message }) => {
      this.log(message);
    });

    this.client.on('deviceInfo', deviceInfo => {
      this.log(`Received deviceInfo from ${deviceInfo.name}: ${JSON.stringify(deviceInfo)}`);

      const version = deviceInfo.esphomeVersion;
      // this.setSettings({ firmware_version: version });
    });

    this.client.on('newEntity', entity => {
      const name = entity.config.objectId

      entity.on(`state`, async (state) => {
        this.lastUpdate = Date.now();
        this.dataEntries[name] = state.state;
      });
    });

    // this.client.on('error', error => {
    //   this.log(`SlimmeLezerDevice error:`, error);

    //   var message = '';
    //   if (error.data && error.data.code) {
    //     message = error.data.code;
    //   } else {
    //     message = error.data;
    //   }

    //   this.setUnavailable(this.homey.__('app.error.connection_failed') + message).catch(this.error);
    // });

    // this.client.on('initialized', () => {
    //   this.log(`SlimmeLezerDevice initialized`);
    //   this.setAvailable().catch(this.error);
    // });

    // this.client.on('disconnected', () => {
    //   this.log(`SlimmeLezerDevice disconnected`);
    //   this.setUnavailable(this.homey.__('app.error.connection_disconnected')).catch(this.error);
    // });
  }
}

module.exports = SlimmeLezerApi;
