const axios = require('axios');

module.exports = (api) => {
  api.registerAccessory('PrometheusSensorPlugin', PrometheusSensorAccessory);
};

class PrometheusSensorAccessory {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      // extract configuration
      this.name = config.name;
      this.url = config.url;
      this.query = config.query;
      this.type = config.type || 'temperature';

      this.log.warn(this.type)
      switch(this.type) {
        case 'temperature':
          // create a new Temperature Sensor service
          this.service = new this.api.hap.Service.TemperatureSensor(this.name);
          this.service.getCharacteristic(this.Characteristic.current)
            .onGet(this.handleCurrentTemperatureGet.bind(this));
          break;
        case 'tvoc':
          this.service = new this.api.hap.Service.OccupancySensor(this.name);
          this.service.getCharacteristic(this.Characteristic.OccupancyDetected)
            .onGet(this.handleOccupancyDetectedGet.bind(this));
          break;
        case 'nox':
          this.service = new this.api.hap.Service.OccupancySensor(this.name);
          this.service.getCharacteristic(this.Characteristic.OccupancyDetected)
            .onGet(this.handleOccupancyDetectedGet.bind(this));
          break;
        case 'CO2':
          this.service = new this.api.hap.Service.CarbonDioxideSensor(this.name);
          this.service.getCharacteristic(this.Characteristic.CarbonDioxideDetected)
            .onGet(this.handleCarbonDioxideDetectedGet.bind(this));
          break;
        case 'humidity':
          this.service = new this.api.hap.Service.HumiditySensor(this.name);
          this.service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity)
            .onGet(this.handleCurrentRelativeHumidityGet.bind(this));
          break;
        case 'pm25':
          this.service = new this.api.hap.Service.OccupancySensor(this.name);
          this.service.getCharacteristic(this.Characteristic.OccupancyDetected)
            .onGet(this.handleOccupancyDetectedGet.bind(this));
          break;
      }
  }

  handleCurrentTemperatureGet() {
    this.log.debug('Triggered GET CurrentTemperature');

    return this.queryPrometheus().then((result) => {
      this.log.debug('CurrentTemperature is ' + result)
      return Number.parseFloat(result).toFixed(1);
    });
  }

  handleTvocGet() {
    this.log.debug('Triggered GET TVOC');

    return this.queryPrometheus().then((result) => {
      this.log.debug('TVOC is ' + result)
      return parseInt(result);
    });
  }

  handleNoxGet() {
    this.log.debug('Triggered GET NOX');

    return this.queryPrometheus().then((result) => {
      this.log.debug('NOX is ' + result)
      return parseInt(result);
    });
  }

  handleCO2Get() {
    this.log.debug('Triggered GET CO2');

    return this.queryPrometheus().then((result) => {
      this.log.debug('CO2 is ' + result)
      return parseInt(result);
    });
  }

  handleHumidityGet() {
    this.log.debug('Triggered GET Humidity');

    return this.queryPrometheus().then((result) => {
      this.log.debug('Humidity is ' + result)
      return parseInt(result);
    });
  }

  handlePm25Get() {
    this.log.debug('Triggered GET PM2.5');

    return this.queryPrometheus().then((result) => {
      this.log.debug('PM2.5 is ' + result)
      return parseInt(result);
    });
  }

  queryPrometheus() {
    let url = this.url + "/api/v1/query?query=" + this.query;
    const response = axios.get(url)
    return response.then((response) => {
      return response.data["data"]["result"][0]["value"][1];
    })
  }

  getServices() {
    return [
      this.service
    ];
  }
}
