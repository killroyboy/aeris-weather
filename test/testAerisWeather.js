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

		}).then(done, done);
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

		}).then(done, done);
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

		}).then(done, done);
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

		}).then(done, done);
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

		}).then(done, done);
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

		}).then(done, done);
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

	it ('should have 4 batch requests: observations (with no_data_warning), observations/summary (with no_data_warning), forecast (7 days), forecast (24hr)', function (done) {
		// 7.228594,80.708443 - Sri Lanka

		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit: 1, filter: 'allstations'}).action('closest').place('7.228594,80.708443');
		api.batch('observations,observations/summary');
		api.limit(7).filter('day');
		api.batch('forecasts');
		api.setParams({limit : 168, filter: '1hr'});
		api.batch('forecasts');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();

			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.should.have.property('response').and.be.Object();

			result.response.responses.length.should.equal(4);


			result.response.responses[0].request.should.equal('/observations/closest?limit=1&p=7.228594%2C80.708443&filter=allstations');
			result.response.responses[1].request.should.equal('/observations/summary/closest?limit=1&p=7.228594%2C80.708443&filter=allstations');
			result.response.responses[2].request.should.equal('/forecasts/closest?limit=7&p=7.228594%2C80.708443&filter=day');
			result.response.responses[3].request.should.equal('/forecasts/closest?limit=168&p=7.228594%2C80.708443&filter=1hr');

			var current = result.response.responses[0],
				summary = result.response.responses[1],
				days = result.response.responses[2].response[0],
				hours = result.response.responses[3].response[0];

			current.should.have.property('error').and.be.Object();
			current.error.should.have.property('code', 'warn_no_data');
			summary.should.have.property('error').and.be.Object();
			summary.error.should.have.property('code', 'warn_no_data');

			days.should.have.property('interval', 'day');
			days.should.have.property('periods').and.be.Array();
			days.periods.length.should.equal(7);

			hours.should.have.property('interval', '1hr');
			hours.should.have.property('periods').and.be.Array();
			hours.periods.length.should.equal(168);

			done();
		});

	});

	it ('should have 3 batch requests: observations/summary, forecast (7 days), forecast (24hr and zero hour)', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.setParams({limit: 1, filter: 'allstations'}).action('closest').query('qcmin:10').place('-45.039948,168.695312');
		api.batch('observations/summary');
		api.query(); // reset
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

			result.response.responses[0].request.should.equal('/observations/summary/closest?limit=1&p=-45.039948%2C168.695312&filter=allstations&query=qcmin%3A10');
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

	it ('should reset batches between process requests', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.action('closest').place('-45.039948,168.695312').setParams({limit: 1, filter: 'allstations'}).batch('observations/summary');
		api.limit(7).filter('day').batch('forecasts');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();

			result.response.responses.length.should.equal(2);

			api.action('closest').place('-45.039948,168.695312').setParams({limit : 169, filter: '1hr', from: '-1hour'}).batch('forecasts');
			// api.limit(7).filter('day').from('').batch('forecasts');

			api.process(function (err2, result2) {
				err2.should.be.false();

				result2.should.have.property('success', true);
				result2.should.have.property('error', null);
				result2.should.have.property('response').and.be.Object();

				result2.response.responses.length.should.equal(1);
				result2.response.responses[0].request.should.equal('/forecasts/closest?limit=169&p=-45.039948%2C168.695312&filter=1hr&from=-1hour');

				done();
			});
		});
	});

	it ('should result in no data warning', function (done) {
		// 7.228594,80.708443 - Sri Lanka

		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.action('closest').place('7.228594,80.708443').setParams({limit: 1, filter: 'allstations'}).endpoint('observations');

		api.process(function (err, result) {
			err.should.be.false();
			result.should.be.Object();

			result.should.have.property('success', true);
			result.should.have.property('error').and.be.Object();
			result.error.should.have.property('code', 'warn_no_data');

			done();
		});
	});

	it ('should return only specified fields to today historical forecast using from/to', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.action('closest').place('40.3916172,-111.8507662').from('today').to('now').endpoint('forecasts');
		api.fields('periods.dateTimeISO,periods.maxTempF,periods.minTempF,periods.weather,periods.pop,periods.precipIN,periods.precipMM');
		api.process().then(function (results) {
			results.should.be.Object();

			results.should.have.property('success', true);
			results.should.have.property('error', null);
			results.should.have.property('response').and.be.Array();

			results.response[0].should.have.property('periods').and.be.Array();
			results.response[0].should.have.property('periods').and.be.Array();

			var firstPeriod = results.response[0].periods[0];
			firstPeriod.should.have.size(7);
			firstPeriod.should.have.property('dateTimeISO');
			firstPeriod.should.have.property('maxTempF');
			firstPeriod.should.have.property('minTempF');
			firstPeriod.should.have.property('weather');
			firstPeriod.should.have.property('pop');
			firstPeriod.should.have.property('precipIN');
			firstPeriod.should.have.property('precipMM');

		}).then(done, done);
	});

	it ('should return 4 batch requests (observation, observations/summary, forecasts (1hr), forests (day) for Australia', function (done) {
		var api = new AerisApi(cachedDevId, cachedDevSecret);
		api.should.be.instanceOf(AerisApi);

		api.reset().action('closest').place('40.008213,-111.676392').limit(1).filter('allstations,hasprecip').batch('observations');
		api.query('qcmin:10').batch('observations/summary').query();
		api.filter('1hr').limit(24 * 7).batch('forecasts');
		api.filter('day').limit(7).batch('forecasts');

		api.process().then(function (result) {
			result.should.have.property('success', true);
			result.should.have.property('error', null);
			result.should.have.property('response').and.be.Object();

			result.response.should.have.property('responses').and.be.Array();
			result.response.responses.length.should.equal(4);

			var responses = result.response.responses;
			responses[0].request.should.equal('/observations/closest?limit=1&p=40.008213%2C-111.676392&filter=allstations%2Chasprecip');
			responses[1].request.should.equal('/observations/summary/closest?limit=1&p=40.008213%2C-111.676392&filter=allstations%2Chasprecip&query=qcmin%3A10');
			responses[2].request.should.equal('/forecasts/closest?limit=168&p=40.008213%2C-111.676392&filter=1hr');
			responses[3].request.should.equal('/forecasts/closest?limit=7&p=40.008213%2C-111.676392&filter=day');

			var mostRecent = api.getLastRequest();

			mostRecent.should.have.property('url', 'https://api.aerisapi.com/batch');
			mostRecent.should.have.property('params').and.be.Object();
			mostRecent.params.should.have.property('requests').and.be.String();
			mostRecent.params.should.have.property('client_id').and.be.String();
			mostRecent.params.should.have.property('client_secret').and.be.String();

		}).then(done, done);
	});
});
