"use strict";

exports.__esModule = true;
exports.makeStrongCache = makeStrongCache;
exports.makeWeakCache = makeWeakCache;

function makeStrongCache(handler, autoPermacache) {
  return makeCachedFunction(new Map(), handler, autoPermacache);
}

function makeWeakCache(handler, autoPermacache) {
  return makeCachedFunction(new WeakMap(), handler, autoPermacache);
}

function makeCachedFunction(callCache, handler, autoPermacache) {
  if (autoPermacache === void 0) {
    autoPermacache = true;
  }

  return function cachedFunction(arg) {
    var cachedValue = callCache.get(arg);

    if (cachedValue) {
      for (var _iterator = cachedValue, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var _ref3 = _ref2;
        var _value2 = _ref3[0];
        var _valid = _ref3[1];
        if (_valid()) return _value2;
      }
    }

    var _makeCacheConfig = makeCacheConfig(),
        cache = _makeCacheConfig.cache,
        result = _makeCacheConfig.result,
        deactivate = _makeCacheConfig.deactivate;

    var value = handler(arg, cache);
    if (autoPermacache && !result.configured) cache.forever();
    deactivate();

    if (!result.configured) {
      throw new Error(["Caching was left unconfigured. Babel's plugins, presets, and .babelrc.js files can be configured", "for various types of caching, using the first param of their handler functions:", "", "module.exports = function(api) {", "  // The API exposes the following:", "", "  // Cache the returned value forever and don't call this function again.", "  api.cache(true);", "", "  // Don't cache at all. Not recommended because it will be very slow.", "  api.cache(false);", "", "  // Cached based on the value of some function. If this function returns a value different from", "  // a previously-encountered value, the plugins will re-evaluate.", "  var env = api.cache(() => process.env.NODE_ENV);", "", "  // If testing for a specific env, we recommend specifics to avoid instantiating a plugin for", "  // any possible NODE_ENV value that might come up during plugin execution.", '  var isProd = api.cache(() => process.env.NODE_ENV === "production");', "", "  // .cache(fn) will perform a linear search though instances to find the matching plugin based", "  // based on previous instantiated plugins. If you want to recreate the plugin and discard the", "  // previous instance whenever something changes, you may use:", '  var isProd = api.cache.invalidate(() => process.env.NODE_ENV === "production");', "", "  // Note, we also expose the following more-verbose versions of the above examples:", "  api.cache.forever(); // api.cache(true)", "  api.cache.never();   // api.cache(false)", "  api.cache.using(fn); // api.cache(fn)", "", "  // Return the value that will be cached.", "  return { };", "};"].join("\n"));
    }

    if (!result.never) {
      if (result.forever) {
        cachedValue = [[value, function () {
          return true;
        }]];
      } else if (result.invalidate) {
        cachedValue = [[value, result.valid]];
      } else {
        cachedValue = cachedValue || [];
        cachedValue.push([value, result.valid]);
      }

      callCache.set(arg, cachedValue);
    }

    return value;
  };
}

function makeCacheConfig() {
  var pairs = [];
  var result = {
    configured: false,
    never: false,
    forever: false,
    invalidate: false,
    valid: function valid() {
      return pairs.every(function (_ref4) {
        var key = _ref4[0],
            fn = _ref4[1];
        return key === fn();
      });
    }
  };
  var active = true;

  var deactivate = function deactivate() {
    active = false;
  };

  var cache = Object.assign(function cacheFn(val) {
    if (typeof val === "boolean") {
      if (val) cache.forever();else cache.never();
      return;
    }

    return cache.using(val);
  }, {
    forever: function forever() {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }

      if (result.never) {
        throw new Error("Caching has already been configured with .never()");
      }

      result.forever = true;
      result.configured = true;
    },
    never: function never() {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }

      if (result.forever) {
        throw new Error("Caching has already been configured with .forever()");
      }

      result.never = true;
      result.configured = true;
    },
    using: function using(handler) {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }

      if (result.never || result.forever) {
        throw new Error("Caching has already been configured with .never or .forever()");
      }

      result.configured = true;
      var key = handler();
      pairs.push([key, handler]);
      return key;
    },
    invalidate: function invalidate(handler) {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }

      if (result.never || result.forever) {
        throw new Error("Caching has already been configured with .never or .forever()");
      }

      result.invalidate = true;
      result.configured = true;
      var key = handler();
      pairs.push([key, handler]);
      return key;
    }
  });
  return {
    cache: cache,
    result: result,
    deactivate: deactivate
  };
}