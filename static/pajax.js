(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
   (global.Pajax = factory());
}(this, function () { 'use strict';

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  var _toConsumableArray = (function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return Array.from(arr);
    }
  })

  var _classCallCheck = (function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  })

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _possibleConstructorReturn = (function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  })

  var _inherits = (function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  })

  function reader2Promise(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function blob2ArrayBuffer(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return reader2Promise(reader);
  }

  function blob2text(blob) {
    var reader = new FileReader();
    reader.readAsText(blob);
    return reader2Promise(reader);
  }

  function bodyType(body) {
    if (typeof body === 'string') {
      return 'text';
    } else if (Blob.prototype.isPrototypeOf(body)) {
      return 'blob';
    } else if (FormData.prototype.isPrototypeOf(body)) {
      return 'formData';
    } else if (body && typeof body === 'object') {
      return 'json';
    } else {
      return null;
    }
  }

  function parseJSON(body) {
    try {
      return JSON.parse(body);
    } catch (ex) {
      throw 'Invalid JSON';
    }
  }

  var map = {
    text: {
      json: function json(body) {
        return Promise.resolve(JSON.stringify(body));
      },
      blob: function blob(body) {
        return blob2text(body);
      }
    },
    json: {
      text: function text(body) {
        return Promise.resolve(parseJSON(body));
      },
      blob: function blob(body) {
        return blob2text(body).then(parseJSON);
      }
    },
    blob: {
      text: function text(body) {
        return Promise.resolve(new Blob([body]));
      },
      json: function json(body) {
        return Promise.resolve(new Blob([JSON.stringify(body)]));
      }
    },
    arrayBuffer: {
      blob: function blob(body) {
        return blob2ArrayBuffer(body);
      }
    }
  };

  function convertBody(body, to) {
    var from = bodyType(body);
    if (body === null || body === undefined || !from || from === to) {
      return Promise.resolve(body);
    } else if (map[to] && map[to][from]) {
      return map[to][from](body);
    } else {
      return Promise.reject('Convertion from ' + from + ' to ' + to + ' not supported');
    }
  }

  var Body = function () {
    function Body() {
      _classCallCheck(this, Body);

      this.bodyUsed = false;
    }

    _createClass(Body, [{
      key: 'text',
      value: function text() {
        return this.consumeBody().then(function (body) {
          return convertBody(body, 'text');
        });
      }
    }, {
      key: 'blob',
      value: function blob() {
        return this.consumeBody().then(function (body) {
          return convertBody(body, 'blob');
        });
      }
    }, {
      key: 'formData',
      value: function formData() {
        return this.consumeBody().then(function (body) {
          return convertBody(body, 'formData');
        });
      }
    }, {
      key: 'json',
      value: function json() {
        return this.consumeBody().then(function (body) {
          return convertBody(body, 'json');
        });
      }
    }, {
      key: 'arrayBuffer',
      value: function arrayBuffer() {
        return this.consumeBody().then(function (body) {
          return convertBody(body, 'ArrayBuffer');
        });
      }
    }, {
      key: 'consumeBody',
      value: function consumeBody() {
        if (this.bodyUsed) {
          // TODO: Reject when body was used?
          //   return Promise.reject(...);
          return Promise.resolve(this._body);
        } else {
          this.bodyUsed = true;
          return Promise.resolve(this._body);
        }
      }
    }]);

    return Body;
  }();

  function checkStatus(res) {
    if (!res.error && !res.ok) {
      res.error = res.statusText || 'Request failed';
    }
    return res.error ? Promise.reject(res) : Promise.resolve(res);
  }

  function normalizeName(name) {
    return String(name).toLowerCase().trim();
  }

  function normalizeValue(name) {
    return String(name);
  }

  // Parses that string into a user-friendly key/value pair object.
  // http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
  function parseResponseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
      return headers;
    }
    var headerPairs = headerStr.split('\r\n');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf(': ');
      if (index > 0) {
        var name = normalizeName(headerPair.substring(0, index));
        var value = normalizeValue(headerPair.substring(index + 2));
        headers[name] = value.trim();
      }
    }
    return headers;
  }

  var Headers = function () {
    function Headers() {
      var _this = this;

      _classCallCheck(this, Headers);

      this.headers = {};

      for (var _len = arguments.length, headersArr = Array(_len), _key = 0; _key < _len; _key++) {
        headersArr[_key] = arguments[_key];
      }

      headersArr.forEach(function (headers) {
        if (headers && typeof headers === 'string') {
          headers = parseResponseHeaders(headers);
        }
        if (headers instanceof Headers) {
          headers.keys().forEach(function (name) {
            _this.append(name, headers.get(name));
          });
        } else if (headers && typeof headers === 'object') {
          Object.keys(headers).forEach(function (key) {
            _this.append(key, headers[key]);
          });
        }
      });
    }

    _createClass(Headers, [{
      key: 'append',
      value: function append(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        this.headers[name] = this.headers[name] || [];
        this.headers[name].push(value);
      }
    }, {
      key: 'delete',
      value: function _delete(name) {
        delete this.headers[normalizeName(name)];
      }
    }, {
      key: 'get',
      value: function get(name) {
        name = normalizeName(name);
        var values = this.headers[name] || [];
        return values.length > 0 ? values[0] : null;
      }
    }, {
      key: 'getAll',
      value: function getAll(name) {
        name = normalizeName(name);
        return this.headers[name] || [];
      }
    }, {
      key: 'has',
      value: function has(name) {
        name = normalizeName(name);
        return !!this.headers[name];
      }
    }, {
      key: 'set',
      value: function set(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        this.headers[name] = [value];
      }
    }, {
      key: 'keys',
      value: function keys() {
        return Object.keys(this.headers);
      }
    }, {
      key: 'values',
      value: function values() {
        var _this2 = this;

        return Object.keys(this.headers).map(function (name) {
          return _this2.get(name);
        });
      }
    }, {
      key: 'entries',
      value: function entries() {
        var _this3 = this;

        return Object.keys(this.headers).map(function (name) {
          return [name, _this3.get(name)];
        });
      }
    }]);

    return Headers;
  }();

  var def = {
    pipelets: {
      before: [],
      after: []
    },
    serializers: {
      'application/json': JSON.stringify,
      'application/ld+json': JSON.stringify,
      'application/x-www-form-urlencoded': function applicationXWwwFormUrlencoded(body) {
        return Object.keys(body).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]);
        }).join('&');
      }
    },
    autoMap: {
      'application/json': 'json',
      'application/ld+json': 'json',
      'text/': 'text',
      'application/xml': 'text'
    },
    request: {
      url: true,
      body: {
        assign: '_body'
      },
      headers: {
        default: function _default() {
          return new Headers();
        },
        merge: function merge(h1, h2) {
          return new Headers(h1, h2);
        }
      },
      method: true,
      noStatusCheck: true,
      timeout: true,
      contentType: true,
      mode: true,
      redirect: true,
      referrer: true,
      integrity: true,
      progress: true,
      credentials: true,
      cache: true
    }
  };

  var _defineProperty = (function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  })

  var operators = {
    setTimeout: function setTimeout(timeout) {
      return this.fork({ 'timeout': timeout });
    },
    type: function type(contentType) {
      return this.fork({ 'contentType': contentType });
    },
    onProgress: function onProgress(progressCb) {
      return this.fork({ 'progress': progressCb });
    },
    withCredentials: function withCredentials() {
      return this.fork({
        'credentials': 'include'
      });
    },
    noCache: function noCache(_noCache) {
      return this.fork({
        'cache': _noCache === false ? 'default' : 'no-cache'
      });
    },
    header: function header(_header, value) {
      if (typeof _header === 'string' && value !== undefined) {
        return this.fork({ headers: _defineProperty({}, _header, value) });
      } else if (typeof _header === 'string' && value === undefined) {
        return this.fork({ headers: _defineProperty({}, _header, undefined) });
      } else if (typeof _header === 'object') {
        return this.fork({ headers: _header });
      }
      return this;
    },
    accept: function accept(ct) {
      return this.header('Accept', ct);
    }
  };

  function operators$1 (target) {
    Object.keys(operators).forEach(function (key) {
      target[key] = operators[key];
    });
  }

  function match(ct) {
    if (!ct) {
      return null;
    }
    var key = Object.keys(def.autoMap).find(function (key) {
      return ct.startsWith(key);
    });
    return key ? def.autoMap[key] : null;
  }

  var Response = function (_Body) {
    _inherits(Response, _Body);

    function Response(body) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var status = _ref.status;
      var statusText = _ref.statusText;
      var headers = _ref.headers;
      var url = _ref.url;
      var pajax = _ref.pajax;
      var error = _ref.error;
      var request = _ref.request;

      _classCallCheck(this, Response);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Response).call(this));

      _this._body = body;
      _this.type = 'default';
      _this.status = status;
      _this.statusText = statusText;
      _this.headers = new Headers(headers);
      _this.url = url;
      _this.pajax = pajax;
      _this.request = request;
      _this.error = error || undefined;
      return _this;
    }

    _createClass(Response, [{
      key: 'clone',
      value: function clone() {
        return new this.constructor(this._body, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url,
          pajax: this.pajax,
          request: this.request,
          error: this.error
        });
      }

      // autoconverts body based on the the response's contentType
      // dataType is determined in the following order
      // - if the response is a blob, by the blobs content type
      // - content type in the response header

    }, {
      key: 'auto',
      value: function auto() {
        var _this2 = this;

        return this.consumeBody().then(function (body) {
          var dataType = void 0;
          if (typeof Blob !== 'undefined' && Blob.prototype.isPrototypeOf(body)) {
            dataType = match(body.type);
          } else if (_this2.headers.get('content-type')) {
            var contentType = _this2.headers.get('content-type').split(/ *; */).shift();
            dataType = match(contentType);
          }

          if (dataType) {
            return convertBody(body, dataType).catch(function (err) {
              // Set error and reject the response when convertion fails
              _this2.error = err;
              return Promise.reject(_this2);
            });
          } else {
            return Promise.resolve(body);
          }
        });
      }
    }, {
      key: 'ok',
      get: function get() {
        // Success: status between 200 and 299
        // Failure: status below 200 or beyond 299
        return this.status >= 200 && this.status < 300;
      }
    }]);

    return Response;
  }(Body);

  function _send (req) {
    // The XMLHttpRequest object is recreated on every request to defeat caching problems in IE
    var xhr = void 0;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      throw 'Could not create XMLHttpRequest object';
    }

    var onLoad = void 0;
    var onError = void 0;
    var onTimeout = void 0;
    var aborted = false;

    var abort = function abort() {
      if (onLoad) xhr.removeEventListener('load', onLoad);
      if (onError) xhr.removeEventListener('error', onError);
      if (onTimeout) xhr.removeEventListener('timeout', onTimeout);
      aborted = true;
      xhr.abort();
    };

    var pajax = req.pajax;

    var beforePipe$ = pajax ? pajax.pipe('before', req) : Promise.resolve(req);

    // Resolve before pipelets
    var fetch$ = beforePipe$.then(function (req) {
      // Do the xhr request
      return new Promise(function (resolve, reject) {
        var url = req.url;

        if (typeof url !== 'string') {
          throw 'URL required for request';
        }

        var method = req.method || 'GET';

        xhr.open(method, url, true);

        // Add custom headers
        if (req.headers) {
          req.headers.keys().forEach(function (key) {
            xhr.setRequestHeader(key, req.headers.get(key));
          });
        }

        // Register upload progress listener
        if (req.progress && xhr.upload) {
          xhr.upload.addEventListener('progress', function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            req.progress.apply(req, [req].concat(args));
          }, false);
        }

        // Set the timeout
        if (typeof req.timeout === 'number') {
          xhr.timeout = req.timeout;
        }

        // Set credentials
        if (req.credentials === 'include') {
          xhr.withCredentials = true;
        }

        // Caching
        if (req.cache) {
          xhr.setRequestHeader('cache-control', req.cache);
        }

        // Use blob whenever possible
        if ('responseType' in xhr && typeof Blob !== 'undefined') {
          xhr.responseType = 'blob';
        }

        var xhrReady = function xhrReady(error) {
          return function () {
            var resBody = !('response' in xhr) ? xhr.responseText : xhr.response;

            // Determines the Response class
            var ResponseCtor = pajax && pajax.option('Response') || Response;

            var res = new ResponseCtor(resBody, {
              error: error,
              headers: xhr.getAllResponseHeaders(),
              status: xhr.status,
              statusText: xhr.statusText,
              pajax: pajax,
              request: req,
              url: url
            });

            if (!req.noStatusCheck && !res.error && !res.ok) {
              res.error = res.statusText || 'Request failed';
            }

            resolve(res);
          };
        };

        // Callback for document loaded.
        onLoad = xhrReady();
        xhr.addEventListener('load', onLoad);

        // Callback for network errors.
        onError = xhrReady('Network error');
        xhr.addEventListener('error', onError);

        // Callback for timeouts
        onTimeout = xhrReady('Timeout');
        xhr.addEventListener('timeout', onTimeout);

        var contentType = req.contentType;

        req.consumeBody().then(function (rawBody) {
          if (rawBody === undefined) {
            return undefined;
          } else if (rawBody && typeof rawBody === 'object' && !(rawBody instanceof FormData) && contentType === undefined) {
            // Fallback to json if body is object (excluding formData) and no content type is set
            contentType = 'application/json';
          }
          var serializer = !!contentType && def.serializers[contentType];
          return serializer ? serializer(rawBody) : rawBody;
        }).then(function (reqBody) {
          // Add content type header only when body is attached
          if (reqBody !== undefined && contentType) {
            xhr.setRequestHeader('Content-Type', contentType);
          }

          // Don't even call send() if already aborted
          if (aborted) {
            return;
          }
          xhr.send(reqBody);
        }, function (err) {
          xhrReady('Cannot serialize body')();
        });
      });
    }).then(function (res) {
      // Resolve after pipelets
      return pajax ? pajax.pipe('after', res) : Promise.resolve(res);
    }).then(function (res) {
      // Resolve or reject based on error
      if (res.error) {
        return Promise.reject(res);
      } else {
        return Promise.resolve(res);
      }
    });

    // Decorate promise with abort() method
    fetch$.abort = abort;
    return fetch$;
  }

  // Extract init from request object
  function extractInit(req) {
    var init = {};
    var request = def.request;
    Object.keys(request).forEach(function (key) {
      var prop = request[key].assign || key;
      if (req[prop] !== undefined) {
        init[key] = req[prop];
      }
    });
    return init;
  }

  // Merges multiple request options
  // The result object is independent of the source options
  function options() {
    var result = {};
    var request = def.request;

    for (var _len = arguments.length, inits = Array(_len), _key = 0; _key < _len; _key++) {
      inits[_key] = arguments[_key];
    }

    inits.forEach(function (init) {
      if (typeof init === 'object' && init) {
        Object.keys(init).forEach(function (key) {
          if (request[key] && init[key] !== undefined) {
            // Merge options
            if (request[key] && request[key].merge) {
              result[key] = request[key].merge(result[key], init[key]);
            } else {
              result[key] = init[key];
            }
          }
        });
      }
    });
    return result;
  }

  var Request = function (_Body) {
    _inherits(Request, _Body);

    function Request(url, inits) {
      var pajax = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      _classCallCheck(this, Request);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Request).call(this));

      if (url instanceof Request) {
        // Extract the request options from the request and
        inits = [].concat(extractInit(url), inits);
        pajax = url.pajax || pajax;
        url = url.url;
      }
      // make sure inits is an array
      inits = [].concat(inits);

      // Convert init array into single init object
      var init = options.apply(undefined, _toConsumableArray(inits));

      // Assign pajax factory
      _this.pajax = pajax;
      // prioritize init.url over url
      _this.url = url;
      // Assign request options
      var request = def.request;
      Object.keys(request).forEach(function (key) {
        var prop = request[key].assign || key;
        if (init[key] !== undefined) {
          _this[prop] = init[key];
        } else if (request[key].default) {
          _this[prop] = request[key].default();
        }
      });
      return _this;
    }

    _createClass(Request, [{
      key: 'clone',
      value: function clone() {
        return this.fork();
      }
    }, {
      key: 'fork',
      value: function fork(init) {
        return new this.constructor(this, init, this.pajax);
      }
    }, {
      key: 'attach',
      value: function attach(body) {
        return this.fork({ 'body': body });
      }
    }, {
      key: 'as',
      value: function as(method) {
        return this.fork({ 'method': method });
      }
    }, {
      key: 'noCheck',
      value: function noCheck(_noCheck) {
        return this.fork({ 'noStatusCheck': _noCheck === false ? false : true });
      }
    }, {
      key: 'send',
      value: function send() {
        return _send(this);
      }
    }, {
      key: 'fetch',
      value: function fetch() {
        return this.noCheck().send();
      }
    }, {
      key: 'get',
      value: function get() {
        return this.as('GET').send();
      }
    }, {
      key: 'getAuto',
      value: function getAuto() {
        return this.as('GET').send().then(function (res) {
          return res.auto();
        });
      }
    }, {
      key: 'getJSON',
      value: function getJSON() {
        return this.as('GET').send().then(function (res) {
          return res.json();
        });
      }
    }, {
      key: 'getText',
      value: function getText() {
        return this.as('GET').send().then(function (res) {
          return res.text();
        });
      }
    }, {
      key: 'getBlob',
      value: function getBlob() {
        return this.as('GET').send().then(function (res) {
          return res.blob();
        });
      }
    }, {
      key: 'getArrayBuffer',
      value: function getArrayBuffer() {
        return this.as('GET').send().then(function (res) {
          return res.arrayBuffer();
        });
      }
    }, {
      key: 'getFormData',
      value: function getFormData() {
        return this.as('GET').send().then(function (res) {
          return res.formData();
        });
      }
    }, {
      key: 'delete',
      value: function _delete() {
        return this.as('DELETE').send();
      }
    }, {
      key: 'post',
      value: function post() {
        return this.as('POST').send();
      }
    }, {
      key: 'put',
      value: function put() {
        return this.as('PUT').send();
      }
    }, {
      key: 'patch',
      value: function patch() {
        return this.as('PATCH').send();
      }
    }]);

    return Request;
  }(Body);

  operators$1(Request.prototype);

  var Pajax = function () {
    function Pajax(init) {
      _classCallCheck(this, Pajax);

      // Store init always as an array
      this.inits = [].concat(init);

      for (var _len = arguments.length, defaults = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        defaults[_key - 1] = arguments[_key];
      }

      this.defaults = defaults;
    }
    // Creates init array by merging pajax inits, defaults and provided inits


    _createClass(Pajax, [{
      key: 'options',
      value: function options() {
        for (var _len2 = arguments.length, inits = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          inits[_key2] = arguments[_key2];
        }

        return [].concat(_toConsumableArray(this.defaults), _toConsumableArray(this.inits), inits).filter(function (init) {
          return init !== undefined;
        }); // filter undefined inits
      }
      // Return specific options

    }, {
      key: 'option',
      value: function option(key) {
        for (var _len3 = arguments.length, inits = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          inits[_key3 - 1] = arguments[_key3];
        }

        return this.options.apply(this, inits).map(function (init) {
          return init[key];
        }).filter(function (R) {
          return R !== undefined;
        }).pop();
      }
      // Creates a request instance

    }, {
      key: 'request',
      value: function request(url, init) {
        // Merge class defaults
        init = this.options(init);
        // Determines the Request class
        var RequestCtor = this.option('Request') || Request;
        return new RequestCtor(url, init, this);
      }
      // Resolves global and pajax pipelets

    }, {
      key: 'pipe',
      value: function pipe(handler, result) {
        var _ref;

        var pipe$ = Promise.resolve(result);
        // Draw pipelets from options
        var pipelets = this.options().map(function (init) {
          return init[handler];
        });
        // Flatten and filter the pipelets
        pipelets = (_ref = []).concat.apply(_ref, _toConsumableArray(pipelets)).filter(function (func) {
          return typeof func === 'function';
        });
        // Merge global and pajax pipelets
        pipelets = [].concat(_toConsumableArray(def.pipelets[handler]), _toConsumableArray(pipelets));

        pipelets.forEach(function (pipelet) {
          // chain together
          if (typeof pipelet === 'function') {
            pipe$ = pipe$.then(function (result) {
              // Resolve the return value of the pipelet
              return Promise.all([pipelet(result), result]);
            }).then(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2);

              var init = _ref3[0];
              var result = _ref3[1];

              if (handler === 'before') {
                // Requests can be manipulated or switched in the before handler
                if (init instanceof Request) {
                  return init;
                } else if (typeof init === 'object' && init && result instanceof Request) {
                  // Create a new requests with the return value of the pipelet
                  return result.fork(init);
                }
              } else if (handler === 'after') {
                // Responses can be switches in the after handler
                if (init instanceof Response) {
                  return init;
                }
              }
              return result;
            });
          }
        });
        return pipe$;
      }

      // pajax pipelets

    }, {
      key: 'before',
      value: function before(func) {
        return this.fork({ before: [func] });
      }
    }, {
      key: 'after',
      value: function after(func) {
        return this.fork({ after: [func] });
      }
    }, {
      key: 'clone',
      value: function clone() {
        return this.fork();
      }
    }, {
      key: 'fork',
      value: function fork(init) {
        return new this.constructor([].concat(_toConsumableArray(this.inits), [init]));
      }
    }, {
      key: 'JSON',
      value: function JSON() {
        var ct = 'application/json';
        return this.type(ct).accept(ct);
      }
    }, {
      key: 'URLEncoded',
      value: function URLEncoded() {
        var ct = 'application/x-www-form-urlencoded';
        return this.type(ct);
      }
      // ===

      // Request helpers

    }, {
      key: 'fetch',
      value: function fetch(url, init) {
        return this.request(url, init).fetch();
      }
    }, {
      key: 'get',
      value: function get(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).get();
      }
    }, {
      key: 'getAuto',
      value: function getAuto(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getAuto();
      }
    }, {
      key: 'getJSON',
      value: function getJSON(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getJSON();
      }
    }, {
      key: 'getText',
      value: function getText(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getText();
      }
    }, {
      key: 'getBlob',
      value: function getBlob(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getBlob();
      }
    }, {
      key: 'getArrayBuffer',
      value: function getArrayBuffer(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getArrayBuffer();
      }
    }, {
      key: 'getFormData',
      value: function getFormData(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getFormData();
      }
    }, {
      key: 'delete',
      value: function _delete(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).delete();
      }
    }, {
      key: 'post',
      value: function post(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).post();
      }
    }, {
      key: 'put',
      value: function put(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).put();
      }
    }, {
      key: 'patch',
      value: function patch(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).patch();
      }
    }], [{
      key: 'fetch',
      value: function fetch(url, init) {
        return this.request(url, init).fetch();
      }
    }, {
      key: 'get',
      value: function get(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).get();
      }
    }, {
      key: 'getAuto',
      value: function getAuto(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getAuto();
      }
    }, {
      key: 'getJSON',
      value: function getJSON(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getJSON();
      }
    }, {
      key: 'getText',
      value: function getText(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getText();
      }
    }, {
      key: 'getBlob',
      value: function getBlob(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getBlob();
      }
    }, {
      key: 'getArrayBuffer',
      value: function getArrayBuffer(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getArrayBuffer();
      }
    }, {
      key: 'getFormData',
      value: function getFormData(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).getFormData();
      }
    }, {
      key: 'delete',
      value: function _delete(url) {
        var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.request(url, init).delete();
      }
    }, {
      key: 'post',
      value: function post(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).post();
      }
    }, {
      key: 'put',
      value: function put(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).put();
      }
    }, {
      key: 'patch',
      value: function patch(url, body) {
        var init = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this.request(url, init).attach(body).patch();
      }
    }, {
      key: 'request',
      value: function request(url, init) {
        return new Pajax().request(url, init);
      }
      // ===

    }]);

    return Pajax;
  }();

  operators$1(Pajax.prototype);

  Pajax.checkStatus = checkStatus;
  Pajax.send = _send;
  Pajax.def = def;
  Pajax.Headers = Headers;
  Pajax.Body = Body;
  Pajax.Request = Request;
  Pajax.Response = Response;

  return Pajax;

}));
