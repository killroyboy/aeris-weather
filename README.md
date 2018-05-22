# aeris-weather
`aeris-weather` is a chainable Node.js client for accessing Aeris Weather API

## Getting Started
```shell
npm install aeris-weather
```
## Instantiate
```js
const Aeris = require('aeris-weather');
var aerisApi = new Aeris('[your-app-id]', '[your-secret-key]');
```

## Examples
To get observation data for Auckland, NZ:
```js
aerisApi.endpoint('observations/summary').action('closest').place('-45.039948,168.695312').filter('allstations').limit(1).process().then(function (data) {
    console.log('Auckland weather', data);
});
```

Or using callback:
```js
aerisApi.endpoint('observations/summary').action('closest').place('-45.039948,168.695312').filter('allstations').limit(1).process(function (err, data) {
    console.log('Auckland weather', data);
});
```

Or using non-chained calls:
```js
aerisApi.endpoint('observations/summary');
aerisApi.action('closest');
aerisApi.place('-45.039948,168.695312');
aerisApi.filter('allstations');
aerisApi.limit(1);
aerisApi.process(function (err, data) {
    console.log('Auckland weather', data);
});
```

## NOTE
This is not a comprehensive SDK implementation and should be taken as a starting point for future implementation. 

Possible Features/Improvements:
* Validation of available endpoints
* Validation of actions and filters available with given endpoints
* Request specific parameters within batch endpoint
* Better error handling

## Testing
In order to run unit tests, create the following files within the `test` directory:
* `aeris-id.txt` (should contain a valid app/client ID)
* `aeris-secret.txt` (should contain a valid secret key)

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
0.0.1 Initial Release

## License
Copyright (c) 2018 Dan Wilson &amp; Skydrop, LLC. Licensed under the MIT license. See LICENSE.