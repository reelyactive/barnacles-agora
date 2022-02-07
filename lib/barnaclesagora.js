/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const https = require('https');


const SIGNATURE_SEPARATOR = '/';
const DEFAULT_PRINT_ERRORS = false;
const DEFAULT_DYNAMB_OPTIONS = {};
const DEFAULT_EVENTS_TO_STORE = { dynamb: DEFAULT_DYNAMB_OPTIONS };
const SUPPORTED_EVENTS = [ 'dynamb' ];


/**
 * BarnaclesAgora Class
 * Forwards events from barnacles to Agora software via webhook.
 */
class BarnaclesAgora {

  /**
   * BarnaclesAgora constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    this.target = new URL(options.target);
    this.printErrors = options.printErrors || DEFAULT_PRINT_ERRORS;
    this.eventsToStore = {};
    let eventsToStore = options.eventsToStore || DEFAULT_EVENTS_TO_STORE;

    for(const event in eventsToStore) {
      let isSupportedEvent = SUPPORTED_EVENTS.includes(event);

      if(isSupportedEvent) {
        self.eventsToStore[event] = eventsToStore[event] ||
                                    DEFAULT_EVENTS_TO_STORE[event];
      }
    }
  }

  /**
   * Handle an outbound event.
   * @param {String} name The outbound event name.
   * @param {Object} data The outbound event data.
   */
  handleEvent(name, data) {
    let self = this;
    let isEventToStore = self.eventsToStore.hasOwnProperty(name);

    if(isEventToStore) {
      switch(name) {
        case 'raddec':
          return;  // TODO: process/forward raddecs in future?
        case 'dynamb':
          return handleDynamb(self, data);
      }
    }
  }

  /**
   * Handle an outbound raddec.  [DEPRECATED]
   * @param {Raddec} raddec The outbound raddec.
   */
  handleRaddec(raddec) {
    return;
  }

}


/**
 * Handle the given dynamb by storing it in Elasticsearch.
 * @param {BarnaclesElasticsearch} instance The BarnaclesElasticsearch instance.
 * @param {Object} dynamb The dynamb data.
 */
function handleDynamb(instance, dynamb) {
  let attributes = {};
  let sourceName = dynamb.deviceId + SIGNATURE_SEPARATOR + dynamb.deviceIdType;
  let sourceData = { sourceName: sourceName,
                     className: "sensor",
                     attributes: attributes }

  for(const property in dynamb) {
    switch(property) {
      case 'acceleration':
        attributes['acceleration-g'] = Math.sqrt(dynamb[property]
                                             .reduce((a, x) => (a + x * x), 0));
        break;
      case 'angleOfRotation':
        attributes['angle-degree'] = dynamb[property];
        break;
      case 'batteryPercentage':
        attributes['battery-percentage'] = dynamb[property] / 100;
        break;
      case 'illuminance':
        attributes['brightness-lux'] = dynamb[property];
        break;
      case 'isContactDetected':
        attributes['switch'] = dynamb[property].includes(true);
        break;
      case 'isMotionDetected':
        attributes['activityDetection'] = dynamb[property].includes(true);
        break;
      case 'pressure':
        attributes['pressure-hpa'] = dynamb[property] / 100;
        break;
      case 'relativeHumidity':
        attributes['humidity-percentage'] = dynamb[property] / 100;
        break;
      case 'temperature':
        attributes['temperature-celsius'] = dynamb[property];
        break;
    }
  }

  post([ sourceData ], instance.target, instance.printErrors);
}


/**
 * HTTP POST the given JSON data to the given target.
 * @param {Object} data The data to POST.
 * @param {Object} target The target host, port and protocol.
 * @param {boolean} toQueryString Convert the data to query string?
 */
function post(data, target, printErrors) {
  target.options = target.options || {};

  let dataString = JSON.stringify(data);
  let headers = {
      "Content-Type": "application/json",
      "Content-Length": dataString.length
  };
  let options = {
      hostname: target.hostname,
      port: target.port,
      path: target.pathname || '/',
      method: 'POST',
      headers: headers
  };
  let req = https.request(options, function(res) { });

  req.on('error', function(err) {
    if(printErrors) {
      console.log(err);
    }
  });
  req.write(dataString);
  req.end();
}


module.exports = BarnaclesAgora;