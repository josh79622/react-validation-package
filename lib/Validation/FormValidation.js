'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _animatedScrollTo = require('animated-scroll-to');

var _animatedScrollTo2 = _interopRequireDefault(_animatedScrollTo);

var _ValidationType = require('./ValidationType');

var _ValidationType2 = _interopRequireDefault(_ValidationType);

var _ValidationAlert = require('./ValidationAlert');

var _ValidationAlert2 = _interopRequireDefault(_ValidationAlert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormValidation = (_temp = _class = function FormValidation(obj) {
  _classCallCheck(this, FormValidation);

  _initialiseProps.call(this);

  this.obj = obj;
  this.showValidation = false;
  this.showApiErrorMessages = false;
  this.ApiErrors = {};
  this.validationFormId = '' + Date.now() + Math.floor(Math.random() * 9999);
}, _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.getValidationResult = function () {
    return new Promise(function (resolve) {
      _this.freshValidations();
      resolve();
    }).then(function () {
      return new Promise(function (resolve, reject) {
        var validationNum = document.getElementsByClassName('validationForm-' + _this.validationFormId).length;
        if (validationNum > 0) {
          reject();
        } else {
          _this.showApiErrorMessages = true;
          resolve();
        }
      });
    });
  };

  this.showFirstFailValidation = function (scrolledSelector) {
    var adjustX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var target = document.querySelector('.validationForm-' + _this.validationFormId);
    var ele = scrolledSelector === 'body' ? window : document.querySelector(scrolledSelector);
    var x = target.offsetTop + adjustX;

    var options = {
      element: ele,
      onComplete: function onComplete() {}
    };

    (0, _animatedScrollTo2.default)(x, options);
  };

  this.freshValidations = function () {
    _this.obj.setState({});
    _this.showValidation = true;
    _this.showApiErrorMessages = false;
  };

  this.hideValidation = function () {
    _this.showValidation = false;
    _this.obj.setState({});
  };

  this.setApiErrorsObject = function (obj) {
    _this.ApiErrors = obj;
  };

  this.validate = function (field, value, customizedMessage) {
    var messages = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var param = [];
    var fieldValue = void 0;
    if (typeof value === 'string' || typeof value === 'number') {
      fieldValue = value;
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.length > 0) {
      param = value;
      fieldValue = value[0];
    } else if (typeof value === 'undefined') {
      fieldValue = document.querySelector('input[name="' + field + '"]') ? document.querySelector('[name="' + field + '"]').type !== 'radio' ? document.querySelector('[name="' + field + '"]').value : document.querySelector('[name="' + field + '"]:checked') ? document.querySelector('[name="' + field + '"]:checked').value : undefined : undefined;
    }

    if (fieldValue !== undefined && _ValidationType2.default[field] !== undefined) {
      _ValidationType2.default[field].forEach(function (type, key) {
        if (type.method(fieldValue, param) !== type.valid) {
          if (typeof customizedMessage === 'string') {
            messages.push(customizedMessage);
          } else if (customizedMessage === undefined || customizedMessage[key] === undefined || customizedMessage[key] === '') {
            messages.push(type.message(param));
          } else if (customizedMessage[key] !== undefined && customizedMessage[key]) {
            messages.push(customizedMessage[key]);
          }
        }
      });
    }
    return {
      validate: function validate(f, v, c) {
        return _this.validate(f, v, c, messages);
      },
      getApiError: function getApiError(k, c) {
        return _this.getApiError(k, c, messages);
      },
      showValidationAlert: function showValidationAlert(s) {
        return _this.showValidationAlert(messages, [], s);
      },
      getMessages: function getMessages() {
        return { validateMessages: messages };
      },
      result: messages.length === 0
    };
  };

  this.getApiError = function (key, customizedMessage) {
    var validateMessages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var apiErrorMessages = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (_this.ApiErrors[key] !== undefined) {
      apiErrorMessages.push(customizedMessage || _this.ApiErrors[key]);
    }
    return {
      getApiError: function getApiError(k, c) {
        return _this.getApiError(k, c, validateMessages, apiErrorMessages);
      },
      showValidationAlert: function showValidationAlert(s) {
        return _this.showValidationAlert(validateMessages, apiErrorMessages, s);
      },
      getMessages: function getMessages() {
        return { validateMessages: validateMessages, apiErrorMessages: apiErrorMessages };
      }
    };
  };

  this.showValidationAlert = function () {
    var validateMessages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var apiErrorMessages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var show = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'first';

    var messages = void 0;
    if (_this.showApiErrorMessages) {
      messages = apiErrorMessages;
    } else {
      messages = validateMessages;
    }
    if (messages.length > 0) {
      if (show === 'first') {
        return _react2.default.createElement(_ValidationAlert2.default, { show: _this.showValidation, message: messages[0], validationFormId: _this.validationFormId });
      } else if (show === 'all') {
        return messages.map(function (message, k) {
          return _react2.default.createElement(_ValidationAlert2.default, {
            key: k,
            show: _this.showValidation,
            message: message,
            validationFormId: _this.validationFormId });
        });
      }
    }
    return '';
  };
}, _temp);
exports.default = FormValidation;