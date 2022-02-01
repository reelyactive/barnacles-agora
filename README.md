barnacles-agora
===============

Forward dynamic ambient (dynamb) data from [barnacles](https://github.com/reelyactive/barnacles) to Agora Software.


Installation
------------

    npm install barnacles-agora


Hello barnacles-agora
---------------------

The following code will POST a single source data point via Webhook to Agora Software.

```javascript
const Barnacles = require('barnacles');
const BarnaclesAgora = require('barnacles-agora');

const TARGET = 'https://agora.software/.../'; // Change to valid Webhook URL
const BARNACLES_OPTIONS = {
    packetProcessors: [
      { processor: require('advlib-ble'),
        libraries: [ require('advlib-ble-services'),
                     require('advlib-ble-manufacturers') ] }
    ]
};

let dynamb = {
    deviceId: "001122334455",
    deviceIdType: 3,
    acceleration: [ 0.01, 0.02, -0.99 ],
    batteryPercentage: 99,
    relativeHumidity: 33,
    temperature: 21,
    timestamp: Date.now()
}

let barnacles = new Barnacles(BARNACLES_OPTIONS);
barnacles.addInterface(BarnaclesAgora, { target: TARGET, printErrors: true });
barnacles.handleEvent('dynamb', dynamb);
```


Supported Properties/Attributes
-------------------------------

__barnacles-agora__ translates the standard dynamb properties, [as specified by advlib](https://github.com/reelyactive/advlib#standard-properties) (reelyActive's open source wireless advertising packet decoding library), into standard _attributes_ supported by Agora Software.  The current mapping is listed in the table below:

| dynamb property   | Agora Software attribute | 
|:------------------|:-------------------------|
| acceleration      | acceleration-g           |
| angleOfRotation   | angle-degree             |
| batteryPercentage | battery-percentage       |
| illuminance       | brightness-lux           |
| pressure          | pressure-hpa             |
| relativeHumidity  | humidity-percentage      |
| temperature       | temperature-celsius      |


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/barnacles-agora/badge.svg)](https://snyk.io/test/github/reelyactive/barnacles-agora)


License
-------

MIT License

Copyright (c) 2022 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
