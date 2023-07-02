'use strict';

const { Driver } = require('homey');

class SlimmeLezerDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('SlimmeLezerDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    const discoveryStrategy = this.getDiscoveryStrategy();
    const discoveryResults = discoveryStrategy.getDiscoveryResults();

    this.log(`SlimmeLezerDriver found ${Object.keys(discoveryResults).length} devices`);

    const devices = Object.values(discoveryResults).map(discoveryResult => {
      return {
        name: discoveryResult.txt.name,
        data: {
          id: discoveryResult.id,
        },
      };
    });

    return devices;
  }
}

module.exports = SlimmeLezerDriver;
