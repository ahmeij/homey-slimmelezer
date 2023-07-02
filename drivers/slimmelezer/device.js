
'use strict';
const { Device } = require('homey');
const SlimmeLezerApi = require('../../lib/slimme-lezer-api');

class SlimmeLezerDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('SlimmeLezerDevice has been initialized');
    this.settings = this.getSettings();

    this.api = new SlimmeLezerApi(this.settings.ip_address, this.settings.port, this.log);
    await this.api.connect();


    setInterval(() => {
      this.updateCapabilities();
    }, 1000);
  }

  async updateCapabilities() {
    const dataEntries = this.api.dataEntries;
    this.log(`Updating capabilities with dataEntries: ${JSON.stringify(dataEntries)}`);
    // const lastUpdate = this.api.getLastUpdate();
    // this.setCapabilityValue('last_update', lastUpdate);

    let totalPower = 0;
    totalPower += dataEntries['power_consumed_phase_1'];
    totalPower += dataEntries['power_consumed_phase_2'];
    totalPower += dataEntries['power_consumed_phase_3'];
    totalPower -= dataEntries['power_produced_phase_1'];
    totalPower -= dataEntries['power_produced_phase_2'];
    totalPower -= dataEntries['power_produced_phase_3'];
    totalPower = Math.round(totalPower * 1000)
    this.setCapabilityValue('measure_power', totalPower)

    let averageVoltage = 0;
    averageVoltage += dataEntries['voltage_phase_1'];
    averageVoltage += dataEntries['voltage_phase_2'];
    averageVoltage += dataEntries['voltage_phase_3'];
    averageVoltage = Math.round(averageVoltage / 3)
    this.setCapabilityValue('measure_voltage', averageVoltage);

    let totalConsumed = 0;
    totalConsumed += dataEntries['energy_consumed_tariff_1'];
    totalConsumed += dataEntries['energy_consumed_tariff_2'];
    totalConsumed -= dataEntries['energy_produced_tariff_1'];
    totalConsumed -= dataEntries['energy_produced_tariff_2'];
    totalConsumed = Math.round(totalConsumed)
    this.setCapabilityValue('meter_power', totalConsumed);

    let totalConsumedGas = 0;
    totalConsumedGas += dataEntries['gas_consumed'];
    totalConsumedGas = Math.round(totalConsumedGas)
    this.setCapabilityValue('meter_gas', totalConsumedGas);
  }

  onDiscoveryResult(discoveryResult) {
    this.log(`SlimmeLezerDevice discovered at ${JSON.stringify(discoveryResult)}`);

    return discoveryResult.id === this.getData().id;
  }

  async onDiscoveryAvailable(discoveryResult) {
    this.log(`SlimmeLezerDevice is available at ${discoveryResult.address}`);
    this.setSettings({ ip_address: discoveryResult.address });

    this.api = new SlimmeLezerApi(this.settings.ip_address, this.settings.port);
    await this.api.connect();
    await this.startDeviceListeners();
  }

  async onDiscoveryAddressChanged(discoveryResult) {
    this.log(`SlimmeLezerDevice address changed to ${discoveryResult.address}`);
    this.setSettings({ ip_address: discoveryResult.address });
    this.api.updateAddress(this.settings.ip_address, this.settings.port);
    this.api.connect().catch(this.error);
  }

  async onDiscoveryLastSeenChanged(discoveryResult) {
    this.log(`SlimmeLezerDevice last seen changed to ${discoveryResult.lastSeen}`);
    this.api.connect().catch(this.error);
  }


  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('SlimmeLezerDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({
    oldSettings,
    newSettings,
    changedKeys
  }) {
    this.log('SlimmeLezerDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('SlimmeLezerDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('SlimmeLezerDevice has been deleted');
  }

}

module.exports = SlimmeLezerDevice;
