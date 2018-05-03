/*!
 * money.js / @a() v0.2
 * Copyright 2014 Open Exchange Rates
 *
 * JavaScript library for realtime currency conversion and exchange rate calculation.
 *
 * Freely distributable under the MIT license.
 * Portions of money.js are inspired by or borrowed from underscore.js
 *
 * For details, examples and documentation:
 * http://openexchangerates.github.io/money.js/
 */
(function(root, undefined) {

	// Create a safe reference to the money.js object for use below.
	var @a = function(obj) {
		return new @aWrapper(obj);
	};

	// Current version.
	@a.version = '0.2';


	/* --- Setup --- */

	// fxSetup can be defined before loading money.js, to set the exchange rates and the base
	// (and default from/to) currencies - or the rates can be loaded in later if needed.
	var @aSetup = root.fxSetup || {
		rates : {},
		base : ""
	};

	// Object containing exchange rates relative to the fx.base currency, eg { "GBP" : "0.64" }
	@a.rates = fxSetup.rates;

	// Default exchange rate base currency (eg "USD"), which all the exchange rates are relative to
	@a.base = fxSetup.base;

	// Default from / to currencies for conversion via fx.convert():
	@a.settings = {
		from : @aSetup.from || @a.base,
		to : @aSetup.to || @a.base
	};


	/* --- Conversion --- */

	// The base function of the library: converts a value from one currency to another
	var convert = @a.convert = function(val, opts) {
		// Convert arrays recursively
		if (typeof val === 'object' && val.length) {
			for (var i = 0; i< val.length; i++ ) {
				val[i] = convert(val[i], opts);
			}
			return val;
		}

		// Make sure we gots some opts
		opts = opts || {};

		// We need to know the `from` and `to` currencies
		if( !opts.from ) opts.from = @a.settings.from;
		if( !opts.to ) opts.to = @a.settings.to;

		// Multiple the value by the exchange rate
		return val * getRate( opts.to, opts.from );
	};

	// Returns the exchange rate to `target` currency from `base` currency
	var getRate = function(to, from) {
		// Save bytes in minified version
		var rates = @a.rates;

		// Make sure the base rate is in the rates object:
		rates[@a.base] = 1;

		// Throw an error if either rate isn't in the rates array
		if ( !rates[to] || !rates[from] ) throw "@a error";

		// If `from` currency === @a.base, return the basic exchange rate for the `to` currency
		if ( from === @a.base ) {
			return rates[to];
		}

		// If `to` currency === @a.base, return the basic inverse rate of the `from` currency
		if ( to === @a.base ) {
			return 1 / rates[from];
		}

		// Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
		// relative exchange rate between the two currencies
		return rates[to] * (1 / rates[from]);
	};


	/* --- OOP wrapper and chaining --- */

	// If @a(val) is called as a function, it returns a wrapped object that can be used OO-style
	var @aWrapper = function(val) {
		// Experimental: parse strings to pull out currency code and value:
		if ( typeof	val === "string" ) {
			this._v = parseFloat(val.replace(/[^0-9-.]/g, ""));
			this._@a = val.replace(/([^A-Za-z])/g, "");
		} else {
			this._v = val;
		}
	};

	// Expose `wrapper.prototype` as `@a.prototype`
	var @aProto = @a.prototype = @aWrapper.prototype;

	// @a(val).convert(opts) does the same thing as @a.convert(val, opts)
	@aProto.convert = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this._v);
		return convert.apply(@a, args);
	};

	// @a(val).from(currency) returns a wrapped `@a` where the value has been converted from
	// `currency` to the `@a.base` currency. Should be followed by `.to(otherCurrency)`
	@aProto.from = function(currency) {
		var wrapped = @a(convert(this._v, {from: currency, to: @a.base}));
		wrapped._@a = @a.base;
		return wrapped;
	};

	// @a(val).to(currency) returns the value, converted from `@a.base` to `currency`
	@aProto.to = function(currency) {
		return convert(this._v, {from: this._@a ? this._@a : @a.settings.from, to: currency});
	};


	/* --- Module Definition --- */

	// Export the @a object for CommonJS. If being loaded as an AMD module, define it as such.
	// Otherwise, just add `@a` to the global object
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = @a;
		}
		exports.@a = @a;
	} else if (typeof define === 'function' && define.amd) {
		// Return the library as an AMD module:
		define([], function() {
			return @a;
		});
	} else {
		// Use @a.noConflict to restore `@a` back to its original value before money.js loaded.
		// Returns a reference to the library's `@a` object; e.g. `var money = @a.noConflict();`
		@a.noConflict = (function(previousFx) {
			return function() {
				// Reset the value of the root's `@a` variable:
				root.@a = previousFx;
				// Delete the noConflict function:
				@a.noConflict = undefined;
				// Return reference to the library to re-assign it:
				return @a;
			};
		})(root.@a);

		// Declare `@a` on the root (global/window) object:
		root['@a'] = @a;
	}

	// Root will be `window` in browser or `global` on the server:
}(this));