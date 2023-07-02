'use strict';

const Homey = require('homey');

class SlimmeLezer extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('SlimmeLezer has been initialized');
  }

}

module.exports = SlimmeLezer;
