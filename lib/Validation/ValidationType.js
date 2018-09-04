'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ValidationType = {
  email: [{
    method: _validator2.default.isEmpty,
    valid: false,
    message: function message() {
      return '請輸入E-mail';
    }
  }, {
    method: _validator2.default.isEmail,
    valid: true,
    message: function message() {
      return 'E-mail格式錯誤';
    }
  }],
  mobileNumber: [{
    method: _validator2.default.isEmpty,
    valid: false,
    message: function message() {
      return '請輸入手機號碼';
    }
  }, {
    method: function method(value) {
      return _validator2.default.isMobilePhone(value, 'zh-TW');
    },
    valid: true,
    message: function message() {
      return '請輸入正確的手機號碼';
    }
  }],
  mobileNumbers: [{
    method: _validator2.default.isEmpty,
    valid: false,
    message: function message() {
      return '請輸入手機號碼';
    }
  }, {
    method: function method(str) {
      var NumbersStr = str.replace(/([\r\n])\1/g, '\n'); // 換行不得連續重複
      NumbersStr = NumbersStr.replace(/([\s])\1/g, ' '); // 空格不得連續重複
      var mobileNumbers = NumbersStr.replace(/[\r\n]/g, ' ').replace(/([\s])\1/g, ' ').trim().split(' ');

      return mobileNumbers.filter(function (number) {
        return !_validator2.default.isMobilePhone(number, 'zh-TW');
      }).length === 0;
    },
    valid: true,
    message: function message() {
      return '請輸入正確的手機號碼';
    }
  }],
  tel: [{
    method: function method(value) {
      return _validator2.default.isEmpty(value[0]) || _validator2.default.isEmpty(value[1]);
    },
    valid: false,
    message: function message(params) {
      return '\u8ACB\u8F38\u5165' + (params[1] ? params[1] : '電話') + '\u865F\u78BC';
    }
  }, {
    method: function method(value, params) {
      return _validator2.default.isLength(value[0], { min: 2, max: 5 }) && _validator2.default.isLength(value[1], { min: 5, max: 13 });
    },
    valid: true,
    message: function message(params) {
      var message = '';
      var value = params[0];
      if (!_validator2.default.isLength(value[0], { min: 2, max: 5 })) {
        message = '區碼須為2~5碼數字';
      }
      if (!_validator2.default.isLength(value[1], { min: 5, max: 13 })) {
        message += (message ? ', ' : '') + '\u5E02\u8A71\u50C5\u80FD\u67095~13\u78BC\u6578\u5B57';
      }
      return message;
    }
  }, {
    method: function method(value) {
      return (/^[0-9]+#?[0-9]+$/.test(value[1]) && /^[0-9]*$/.test(value[0])
      );
    },
    valid: true,
    message: function message(params) {
      var message = '';
      var value = params[0];
      if (!/^[0-9]*$/.test(value[0])) {
        message = '區碼僅能輸入數字';
      }
      if (!/^[0-9]+#?[0-9]+$/.test(value[1])) {
        message += (message ? ', ' : '') + '\u96FB\u8A71\u683C\u5F0F\u4E0D\u7B26, \u50C5\u53EF\u8F38\u5165\u6578\u5B57\u53CA\uFF03\'';
      }
      return message;
    }
  }],
  smsType: [{
    method: function method(val, params) {
      return !(params[1] === '' && params[2] === '');
    },
    valid: true,
    message: function message() {
      return '請選擇發送類型或輸入其他類型';
    }
  }],
  notEmpty: [{
    /**
     檢測欄位是否為空值
     validate('lengthInRange', [檢測值, 欄位名稱])
     */
    method: _validator2.default.isEmpty,
    valid: false,
    message: function message(params) {
      return params[1] ? '\u8ACB\u8F38\u5165' + params[1] : '此欄位必填';
    }
  }],
  lengthInRange: [{
    /**
     檢測輸入的文字長度是否在期望內
     用法：
     validate('lengthInRange', [檢測值, { min: 最小長度, max: 最大長度}])
     */
    method: function method(str, params) {
      return _validator2.default.isLength(str, params[1]);
    },
    valid: true,
    message: function message(params) {
      return '\u8ACB\u8F38\u5165' + (params[1].min ? params[1].min + '\u5B57\u4EE5\u4E0A' : '') + (params[1].max ? params[1].max + '\u5B57\u4EE5\u4E0B' : '') + '\uFF01';
    }
  }],
  notEmptyAndInRange: [{
    /**
     檢測欄位是否為空值，以及在一字數內
     validate('lengthInRange', [檢測值, 欄位名稱, 最大長度])
     */
    method: _validator2.default.isEmpty,
    valid: false,
    message: function message(params) {
      return params[1] ? '\u8ACB\u8F38\u5165' + params[1] : '此欄位必填';
    }
  }, {
    method: function method(str, params) {
      return _validator2.default.isLength(str, { max: params[2] ? params[2] : undefined });
    },
    valid: true,
    message: function message(params) {
      var message = '';
      if (params[2] !== undefined && params[2] !== '') {
        message = params[1] + '\u9577\u5EA6\u4E0D\u5F97\u8D85\u904E' + params[2] + '\u5B57\u5143';
      }
      return message;
    }
  }],
  checkEquality: [{
    /**
     檢測兩個值是否相等
     */
    method: function method(str, params) {
      return _validator2.default.equals(str, params[1]);
    },
    valid: true,
    message: function message() {
      return '輸入錯誤';
    }
  }],
  inputRadioMustCheck: [{
    /**
     檢測input radio是否沒有被勾選到
     */
    method: function method(name) {
      return document.querySelector('input[name="' + name + '"]:checked') !== null;
    },
    valid: true,
    message: function message(params) {
      return params[1] ? '\u8ACB\u9078\u64C7' + params[1] : '此欄位必填';
    }
  }],
  GroupInputCheck: [{
    /**
     利用name取得input的值或select的值並進行檢驗是否符合期待，可一次檢測多欄位值
     用法：
     validate("GroupInputCheck", [元素1, 元素2, ...])
     元素必須為陣列,可以有三種形式：
     [input名稱, 必須相等的值] ： 只檢查input與某個值得相等性
     [input名稱, 比較運算子, 比較值] ： 多了比較運算子 （只接受此六種：< , <= , = , != , >= , >）
     [input名稱, 自定義函數] : 使用自定義函數去驗證，該函數只能有一個參數傳入
     */
    method: function method(value, params) {
      var compare = ValidationType.compareCheck[0].method;
      return params.filter(function (val) {
        var selector = document.querySelector('[name="' + val[0] + '"]');
        var checkedSelector = document.querySelector('[name="' + val[0] + '"]:checked');
        var func = typeof val[1] === 'function' ? val[1] : compare;
        return selector ? selector.type !== 'radio' ? !func(selector.value, val) : checkedSelector ? !func(checkedSelector.value, val) : true : true;
      }).length === 0;
    },
    valid: true,
    message: function message() {
      return '輸入錯誤';
    }
  }],
  compareCheck: [{
    /**
     對值進行簡單的比對
     用法：
      validate('compareCheck', [被驗證的值, 比較運算子, 比較值])
      */
    method: function method(val, params) {
      var v1 = val;
      var operator = params[1];
      var v2 = params[2];
      if (v2 === undefined) {
        v2 = params[1];
        operator = '=';
      }
      switch (operator) {
        case '<':
          return parseFloat(v1) < parseFloat(v2);
        case '<=':
          return parseFloat(v1) <= parseFloat(v2);
        case '=':
          return v1 === v2;
        case '!=':
          return v1 !== v2;
        case '>=':
          return parseFloat(v1) >= parseFloat(v2);
        case '>':
          return parseFloat(v1) > parseFloat(v2);
        default:
          return false;
      }
    },
    valid: true,
    message: function message() {
      return '驗證錯誤';
    }
  }],
  addressCheck: [{
    method: function method(value, params) {
      return _validator2.default.isEmpty(params[0]);
    },
    valid: false,
    message: function message() {
      return '請選擇行政區域';
    }
  }, {
    method: function method(value, params) {
      return _validator2.default.isEmpty(params[1]);
    },
    valid: false,
    message: function message() {
      return '請輸入地址';
    }
  }, {
    method: function method(value, params) {
      return _validator2.default.isLength(params[1], { max: 2000 });
    },
    valid: true,
    message: function message() {
      return '地址長度超過限制';
    }
  }],
  checkedThenText: [{
    /**
     檢測當input radio或check被勾選時,後面的input text必須填植
     */
    method: function method(value, params) {
      var check = document.querySelector(params[0] + ':checked') !== null;
      var text = document.querySelector('' + params[1]) ? document.querySelector('' + params[1]).value !== '' : true;
      return check && !text; // 當被勾選且沒填寫
    },
    valid: false,
    message: function message() {
      return '請填寫欄位';
    }
  }, {
    method: function method(value, params) {
      if (params[2]) {
        var check = document.querySelector(params[0] + ':checked') !== null;
        var text = document.querySelector('' + params[1]);
        if (check && text) {
          return _validator2.default.isLength(document.querySelector('' + params[1]).value, params[2]);
        }
      }
      return true;
    },
    valid: true,
    message: function message(params) {
      return '\u8ACB\u8F38\u5165' + (params[2].min ? params[2].min + '\u5B57\u4EE5\u4E0A' : '') + (params[2].max ? params[2].max + '\u5B57\u4EE5\u4E0B' : '') + '\uFF01';
    }
  }],
  isIntInRange: [{
    method: function method(value, params) {
      return _validator2.default.isInt(value, params[1]);
    },
    valid: true,
    message: function message() {
      return '請輸入正確數字';
    }
  }]
};

exports.default = ValidationType;