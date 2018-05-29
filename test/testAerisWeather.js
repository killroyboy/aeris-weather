/**
 * Aeris Weather Data API
 *
 * @author Dan Wilson
 * @copyright 2018 Skydrop, LLC
 * @licence MIT (see LICENCE)
 */
require('should');
const AerisApi = require('./../lib/aeris-weather'),
	fs = require('fs');

var cachedDevId = null;
var getDevId = function(callback){
	"use strict";

	if (cachedDevId){
		callback(false, cachedDevId);
		return;
	}

	fs.readFile(__dirname+'/aeris-id.txt', 'utf8', function (err, data) {
		if (err) {
			callback(err, false);
			return console.error(err);
		}

		cachedDevId = data;
		callback(false, cachedDevId);
	});
};

var cachedDevSecret = null;
var getDevSecret = function(callback){
	"use strict";

	if (cachedDevSecret){
		callback(false, cachedDevSecret);
		return;
	}

	fs.readFile(__dirname+'/aeris-secret.txt', 'utf8', function (err, data) {
		if (err) {
			callback(err, false);
			return console.error(err);
		}

		cachedDevSecret = data;
		callback(false, cachedDevSecret);
	});
};


describe('Aeris Weather Data API Node Client', function () {
	"use strict";

	this.timeout(4000);

	before(function (done) {
		getDevId(function (err, key) {
			err.should.be.false();
			key.should.be.String();

			getDevSecret(function (err, key) {
				err.should.be.false();
				key.should.be.String();

				done();
			});
		});
	});

	it('should fail because of missing AppId', function (done) {
		var api = new AerisApi();
		api.should.be.instanceOf(Error);
		api.message.should.equal('Application ID is required');

		done();
	});

	it('should fail because of missing secret', function (done) {
		var api = new AerisApi(cachedDevId);
		api.should.be.instanceOf(Error);
		api.message.should.equal('Secret Key is required');

		done();
	});

	it('should return closest observation summary data for postal code', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.endpoint('observations/summary').action('closest').place('94024').process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.response.should.be.Array();

			var first = result.response.pop();
			first.should.be.Object();
			first.should.have.property('id', 'KNUQ');
			first.should.have.property('loc');
			first.loc.should.be.Object();
			first.should.have.property('place');
			first.place.should.be.Object();
			first.should.have.property('profile');
			first.profile.should.be.Object();
			first.should.have.property('periods');
			first.periods.should.be.Array();
			first.periods[0].should.be.Object();
			first.periods[0].should.have.property('summary');

			var summary = first.periods[0].summary;
			summary.should.have.property('timestamp');
			summary.should.have.property('dateTimeISO');
			summary.should.have.property('range');
			summary.should.have.property('temp');
			summary.should.have.property('dewpt');
			summary.should.have.property('rh');
			summary.should.have.property('pressure');
			summary.should.have.property('visibility');
			summary.should.have.property('wind');
			summary.should.have.property('precip');
			summary.should.have.property('weather');
			summary.should.have.property('sky');
			summary.should.have.property('solrad');
			summary.should.have.property('QC');
			summary.should.have.property('spressure');

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});

	it('should return closest observation summary data for geo lat/long', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.endpoint('observations/summary').action('closest').place('7.050169,79.936509').process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.response.should.be.Array();

			var first = result.response.pop();
			first.should.be.Object();
			first.should.have.property('id', 'VCBI');
			first.should.have.property('loc');
			first.loc.should.be.Object();
			first.should.have.property('place');
			first.place.should.be.Object();
			first.should.have.property('profile');
			first.profile.should.be.Object();
			first.should.have.property('periods');
			first.periods.should.be.Array();
			first.periods[0].should.be.Object();
			first.periods[0].should.have.property('summary');

			var summary = first.periods[0].summary;
			summary.should.have.property('timestamp');
			summary.should.have.property('dateTimeISO');
			summary.should.have.property('range');
			summary.should.have.property('temp');
			summary.should.have.property('dewpt');
			summary.should.have.property('rh');
			summary.should.have.property('pressure');
			summary.should.have.property('visibility');
			summary.should.have.property('wind');
			summary.should.have.property('precip');
			summary.should.have.property('weather');
			summary.should.have.property('sky');
			summary.should.have.property('solrad');
			summary.should.have.property('QC');
			summary.should.have.property('spressure');

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});


	it('should return observation summary data for VCBI station', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.endpoint('observations/summary').action('VCBI').process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);

			var first = result.response;
			first.should.be.Object();
			first.should.have.property('id', 'VCBI');
			first.should.have.property('loc');
			first.loc.should.be.Object();
			first.should.have.property('place');
			first.place.should.be.Object();
			first.should.have.property('profile');
			first.profile.should.be.Object();
			first.should.have.property('periods');
			first.periods.should.be.Array();
			first.periods[0].should.be.Object();
			first.periods[0].should.have.property('summary');

			var summary = first.periods[0].summary;
			summary.should.have.property('timestamp');
			summary.should.have.property('dateTimeISO');
			summary.should.have.property('range');
			summary.should.have.property('temp');
			summary.should.have.property('dewpt');
			summary.should.have.property('rh');
			summary.should.have.property('pressure');
			summary.should.have.property('visibility');
			summary.should.have.property('wind');
			summary.should.have.property('precip');
			summary.should.have.property('weather');
			summary.should.have.property('sky');
			summary.should.have.property('solrad');
			summary.should.have.property('QC');
			summary.should.have.property('spressure');

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});

	it('should return closest observation summary data for Auckland, New Zealand (lat/lng)', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.reset().endpoint('observations/summary').action('closest').place('-45.039948,168.695312').filter('allstations').limit(1).process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);

			var first = result.response[0];
			first.should.be.Object();
			first.should.have.property('loc');
			first.loc.should.be.Object();
			first.should.have.property('place');
			first.place.should.be.Object();
			first.should.have.property('profile');
			first.profile.should.be.Object();
			first.should.have.property('periods');
			first.periods.should.be.Array();
			first.periods[0].should.be.Object();
			first.periods[0].should.have.property('summary');

			var summary = first.periods[0].summary;
			summary.should.have.property('timestamp');
			summary.should.have.property('dateTimeISO');
			summary.should.have.property('range');
			summary.should.have.property('temp');
			summary.should.have.property('dewpt');
			summary.should.have.property('rh');
			summary.should.have.property('pressure');
			summary.should.have.property('visibility');
			summary.should.have.property('wind');
			summary.should.have.property('precip');
			summary.should.have.property('weather');
			summary.should.have.property('sky');
			summary.should.have.property('solrad');
			summary.should.have.property('QC');
			summary.should.have.property('spressure');

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});

	it('should fail to return closest observation summary data for Auckland, New Zealand (lat/lng) because allstations filter', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.reset().endpoint('observations/summary').action('closest').place('-45.039948,168.695312').limit(1).process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.error.should.be.Object();

			result.error.should.have.property('code', 'warn_no_data');
			result.error.should.have.property('description', 'No data was returned for the request.');

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});

	it('should return closest observation, forecast, and observation summary data for Auckland, New Zealand (lat/lng) using batch', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.reset().action('closest').place('-45.039948,168.695312').limit(1).filter('allstations').batch('observations/summary,observations,forecasts').process().then(function (result) {
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.response.should.have.property('responses').and.be.Array();

			var responses = result.response.responses;
			responses.length.should.equal(3);


			for (var i = 0; i < responses.length; i++) {
				responses[i].should.be.Object();
				responses[i].should.have.property('success', true);
				responses[i].should.have.property('error', null);
			}

			done();
		}).catch(function (err) {
			console.log('error', err);
			err.should.equal(false);
			done();
		});
	});


	it ('should set params, action and endpoint separately', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit : 1, filter: 'allstations'});
		api.action('closest');
		api.place('-45.039948,168.695312');
		api.endpoint('observations');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);

			done();
		});
	});

	it ('should compile a url for batch mode', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit : 1, filter: 'allstations'});
		api.action('closest');
		api.place('-45.039948,168.695312');
		api.endpoint('observations');

		var data = api.compileUrl(true);

		data.should.be.Object();
		data.error.should.be.false();
		data.url.should.be.String().and.equal('/observations/closest');
		data.params.should.be.Object();
		data.params.p.should.equal('-45.039948,168.695312');
		data.params.filter.should.equal('allstations');

		done();
	});

	it ('should add 2 batch request', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit : 1, filter: 'allstations'}).action('closest').place('-45.039948,168.695312');
		api.addBatch('observations').addBatch('observations/summary');

		api.requests.should.be.Array();
		api.requests.length.should.be.Number().and.equal(2);

		var data = api.compileUrl();

		data.should.be.Object();
		data.should.have.property('url', 'https://api.aerisapi.com/batch');
		data.should.have.property('error', false);
		data.params.should.be.Object();
		data.params.should.have.property('p', '-45.039948,168.695312');
		data.params.should.have.property('filter', 'allstations');

		done();
	});

	it ('should add 2 batch request for same endpoint', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit : 25, filter: 'allstations,1hr'}).action('closest').place('-45.039948,168.695312');
		api.batch('forecasts');
		api.limit(7).filter('allstations');
		api.batch('forecasts');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();
			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.should.have.property('response').and.be.Object();
			result.response.should.have.property('responses').and.be.Array();

			var hours = result.response.responses[0].response[0],
				days = result.response.responses[1].response[0];

			hours.should.have.property('interval', '1hr');
			hours.should.have.property('periods').and.be.Array();
			hours.periods.length.should.equal(25);
			days.should.have.property('interval', 'day');
			days.should.have.property('periods').and.be.Array();
			days.periods.length.should.equal(7);

			done();
		});
	});

	it ('should have 4 batch requests: observations, observations/summary, forecast (7 days), forecast (24hr)', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit: 1, filter: 'allstations'}).action('closest').place('-45.039948,168.695312');
		api.batch('observations,observations/summary');
		api.limit(7).filter('day');
		api.batch('forecasts');
		api.setParams({limit : 169, filter: '1hr'});
		api.batch('forecasts');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();

			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.should.have.property('response').and.be.Object();

			result.response.responses.length.should.equal(4);


			result.response.responses[0].request.should.equal('/observations/closest?limit=1&p=-45.039948%2C168.695312&filter=allstations');
			result.response.responses[1].request.should.equal('/observations/summary/closest?limit=1&p=-45.039948%2C168.695312&filter=allstations');
			result.response.responses[2].request.should.equal('/forecasts/closest?limit=7&p=-45.039948%2C168.695312&filter=day');
			result.response.responses[3].request.should.equal('/forecasts/closest?limit=169&p=-45.039948%2C168.695312&filter=1hr');

			var days = result.response.responses[2].response[0],
				hours = result.response.responses[3].response[0];

			hours.should.have.property('interval', '1hr');
			hours.should.have.property('periods').and.be.Array();
			hours.periods.length.should.equal(169);
			days.should.have.property('interval', 'day');
			days.should.have.property('periods').and.be.Array();
			days.periods.length.should.equal(7);

			done();
		});

	});

	it ('should have 3 batch requests: observations/summary, forecast (7 days), forecast (24hr and zero hour)', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit: 1, filter: 'allstations'}).action('closest').place('-45.039948,168.695312');
		api.batch('observations/summary');
		api.limit(7).filter('day');
		api.batch('forecasts');
		api.setParams({limit : 169, filter: '1hr', from: '-1hour'});
		api.batch('forecasts');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();

			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.should.have.property('response').and.be.Object();

			result.response.responses.length.should.equal(3);

			result.response.responses[0].request.should.equal('/observations/summary/closest?limit=1&p=-45.039948%2C168.695312&filter=allstations');
			result.response.responses[1].request.should.equal('/forecasts/closest?limit=7&p=-45.039948%2C168.695312&filter=day');
			result.response.responses[2].request.should.equal('/forecasts/closest?limit=169&p=-45.039948%2C168.695312&filter=1hr&from=-1hour');

			var days = result.response.responses[1].response[0],
				hours = result.response.responses[2].response[0];

			hours.should.have.property('interval', '1hr');
			hours.should.have.property('periods').and.be.Array();
			hours.periods.length.should.equal(169);
			days.should.have.property('interval', 'day');
			days.should.have.property('periods').and.be.Array();
			days.periods.length.should.equal(7);

			done();
		});

	});

});
