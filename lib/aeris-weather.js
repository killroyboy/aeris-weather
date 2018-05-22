/**
 * Aeris Weather Data API
 *
 * @author Dan Wilson
 * @copyright 2018 Skydrop, LLC
 * @licence MIT (see LICENCE)
 */

const got = require('got'),
	parse = require('parse-json'),
	_ = require('lodash');

var AerisWeather = function (id, secret) {
	"use strict";

	var self = this;

	self.base_url = 'https://api.aerisapi.com/';

	self.appId = id;
	self.secretKey = secret;

	self.act = '';
	self.end = '';
	self.requests = [];
	self.params = {};

	// ensure we have the id and secret
	if (!self.appId) {
		return new Error('Application ID is required');
	}

	if (!self.secretKey) {
		return new Error('Secret Key is required');
	}

	/**
	 * Set an individual param
	 *
	 * @param param
	 * @param value
	 * @returns {AerisWeather}
	 */
	self.setParam = function (param, value) {
		self.params[param] = value;
		return self;
	};

	/**
	 * Set multiple params
	 *
	 * @param params
	 * @returns {AerisWeather}
	 */
	self.setParams = function (params) {
		self.params = _.merge(self.params, params);
		return self;
	};

	/**
	 * Reset the params to defaults
	 * @returns {AerisWeather}
	 */
	self.resetParams = function () {
		self.params = {
			limit : 1,
			p : '',
			radius : '',
			filter : '',
			query : '',
			sort : '',
			skip : 0,
			from : '',
			to : '',
			plimit : '',
			psort : '',
			pskip : 0,
			callback : null,
			fields : ''
		};
		return self;
	};
	self.resetParams();

	/**
	 * Set the filter param
	 *
	 * @param filter
	 * @returns {AerisWeather}
	 */
	self.filter = function (filter) {
		var valid = ['allstations', 'official', 'metar', 'pws', 'mesonet', 'hasprecip'];
		if (_.indexOf(valid, filter) > -1) {
			self.setParam('filter', filter);
		}
		return self;
	};

	/**
	 * Set the place param
	 *
	 * @param place
	 * @returns {AerisWeather}
	 */
	self.place = function (place) {
		self.setParam('p', place);
		return self;
	};

	/**
	 * Set the endpoint
	 *
	 * @param endpoint
	 * @returns {AerisWeather}
	 */
	self.endpoint = function (endpoint) {
		// we might want to validate endpoint in the future
		self.end = endpoint;
		return self;
	};

	/**
	 * Set the action
	 *
	 * @param action
	 * @returns {AerisWeather}
	 */
	self.action = function (action) {
		self.act = action;
		return self;
	};

	/**
	 * Set the requests for a batch request
	 *
	 * @param requests
	 * @returns {AerisWeather}
	 */
	self.batch = function (requests) {
		if (_.isString(requests)) {
			requests = requests.split(',');
		}
		self.requests = requests;
		return self;
	};

	/**
	 * Reset endpoint and action
	 *
	 * @returns {AerisWeather}
	 */
	self.reset = function () {
		self.act = '';
		self.end = '';
		return self;
	};

	/**
	 * Call the API using the got http library
	 * - returns a Promise or if a callback is passed in, it will call it instead
	 *
	 * @param cb
	 * @returns {Promise}
	 */
	self.process = function (cb) {
		var doRequest = function (callback) {
			var url = self.base_url;

			var params = _.pickBy(self.params, function (o) {
				return !_.isEmpty(o);
			});

			if (!self.requests.length) { // we are in a "normal" request
				/* istanbul ignore if  */
				if (!self.end) {
					callback.call(self, new Error('Invalid Request: No endpoints provided'), false);
					return false;
				} else {
					url += self.end;
				}
				url += '/' + self.act;
			} else { // batch request
				url += 'batch';
				var requests = [];

				_.each(self.requests, function (item) {
					requests.push('/' + item + '/' + self.act);
				});

				params.requests = requests.join(',');
			}

			params.client_id = self.appId;
			params.client_secret = self.secretKey;

			// console.log('processing', url, params);
			got(url, {query: params}).then(function (response) {
				// console.log('body', response.body);
				var json = false, err = false;
				try {
					json = parse(response.body);
					callback(err, json)
				} catch (e) {
					/* istanbul ignore next */
					callback(e, json);
				}
			}).catch(/* istanbul ignore next */ function (reason) {
				console.log('Error', reason);
				callback(reason, false);
			});
		};

		if (cb) {
			return doRequest(cb)
		}

		return new Promise(function(resolve, reject){
			doRequest(function(err, json){
				/* istanbul ignore if  */
				if (err){
					reject(err);
				} else {
					resolve(json);
				}
			});
		});
	};

	// Add convenience methods for setting params
	Object.keys(self.params).forEach(function (param) {
		if (!this[param]) {
			this[param] = function () {
				var args = Array.prototype.slice.call(arguments);
				this.setParam.apply(this, args);
				return this;
			}.bind(this, param);
		}
	}, this);

};

module.exports = AerisWeather;
