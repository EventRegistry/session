/*!
 * Connect - session - Cookie
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var cookie = require('cookie')
var merge = require('utils-merge')

/**
 * Initialize a new `Cookie` with the given `options`.
 *
 * @param {IncomingMessage} req
 * @param {Object} options
 * @api private
 */

var Cookie = module.exports = function Cookie(options) {
  this.path = '/';
  this.maxAge = null;
  this.httpOnly = true;

  if (options) {
    if (typeof options !== 'object') {
      throw new TypeError('argument options must be a object')
    }

    merge(this, options)
  }

  this.originalMaxAge = undefined == this.originalMaxAge
    ? this.maxAge
    : this.originalMaxAge;
};

/*!
 * Prototype.
 */

Cookie.prototype = {

  /**
   * Set expires `date`.
   *
   * @param {Date} date
   * @api public
   */

  set expires(date) {
    this._expires = date;
    this.originalMaxAge = this.maxAge;
  },

  /**
   * Get expires `date`.
   *
   * @return {Date}
   * @api public
   */

  get expires() {
    return this._expires;
  },

  /**
   * Set expires via max-age in `ms`.
   *
   * @param {Number} ms
   * @api public
   */

  set maxAge(ms) {
    if (ms && typeof ms !== 'number' && !(ms instanceof Date)) {
      throw new TypeError('maxAge must be a number or Date')
    }

    this.expires = 'number' == typeof ms
      ? new Date(Date.now() + ms)
      : ms;
  },

  /**
   * Get expires max-age in `ms`.
   *
   * @return {Number}
   * @api public
   */

  get maxAge() {
    return this.expires instanceof Date
      ? this.expires.valueOf() - Date.now()
      : this.expires;
  },

  /**
   * Return cookie data object.
   *
   * @return {Object}
   * @api private
   */

  get data() {
    return {
      originalMaxAge: this.originalMaxAge
      , expires: this._expires
      , secure: this.secure
      , httpOnly: this.httpOnly
      , domain: this.domain
      , path: this.path
      , sameSite: this.sameSite
    }
  },

  /**
   * Return a serialized cookie string.
   *
   * @return {String}
   * @api public
   */

  serialize: function(name, val){
    return cookie.serialize(name, val, this.data);
  },

  /**
   * Return JSON representation of this cookie.
   *
   * @return {Object}
   * @api private
   */

  toJSON: function(){
    return this.data;
  }
};
