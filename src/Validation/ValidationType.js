import validator from 'validator'
import _ from 'lodash'

const ValidationType = {
  email: [
    {
      method: validator.isEmpty,
      valid: false,
      message: () => '請輸入E-mail',
    },
    {
      method: validator.isEmail,
      valid: true,
      message: () => 'E-mail格式錯誤',
    },
  ],
  mobileNumber: [
    {
      method: validator.isEmpty,
      valid: false,
      message: () => '請輸入手機號碼',
    },
    {
      method: value => validator.isMobilePhone(value, 'zh-TW'),
      valid: true,
      message: () => '請輸入正確的手機號碼',
    },
  ],
  mobileNumbers: [
    {
      method: validator.isEmpty,
      valid: false,
      message: () => '請輸入手機號碼',
    },
    {
      method: (str) => {
        let NumbersStr = str.replace(/([\r\n])\1/g, '\n') // 換行不得連續重複
        NumbersStr = NumbersStr.replace(/([\s])\1/g, ' ') // 空格不得連續重複
        const mobileNumbers = NumbersStr.replace(/[\r\n]/g, ' ').replace(/([\s])\1/g, ' ').trim().split(' ')

        return mobileNumbers.filter(number => !validator.isMobilePhone(number, 'zh-TW')).length === 0
      },
      valid: true,
      message: () => '請輸入正確的手機號碼',
    },
  ],
  tel: [
    {
      method: value => (validator.isEmpty(value[0]) || validator.isEmpty(value[1])),
      valid: false,
      message: params => `請輸入${params[1] ? params[1] : '電話'}號碼`,
    }, {
      method: (value, params) => (validator.isLength(value[0], { min: 2, max: 5 }) && validator.isLength(value[1], { min: 5, max: 13 })),
      valid: true,
      message: (params) => {
        let message = ''
        const value = params[0]
        if (!validator.isLength(value[0], { min: 2, max: 5 })) { message = '區碼須為2~5碼數字' }
        if (!validator.isLength(value[1], { min: 5, max: 13 })) { message += `${message ? ', ' : ''}市話僅能有5~13碼數字` }
        return message
      },
    }, {
      method: value => (/^[0-9]+#?[0-9]+$/.test(value[1]) && /^[0-9]*$/.test(value[0])),
      valid: true,
      message: (params) => {
        let message = ''
        const value = params[0]
        if (!/^[0-9]*$/.test(value[0])) { message = '區碼僅能輸入數字' }
        if (!/^[0-9]+#?[0-9]+$/.test(value[1])) { message += `${message ? ', ' : ''}電話格式不符, 僅可輸入數字及＃'` }
        return message
      },
    },
  ],
  smsType: [
    {
      method: (val, params) => (!(params[1] === '' && params[2] === '')),
      valid: true,
      message: () => '請選擇發送類型或輸入其他類型',
    },
  ],
  notEmpty: [
    {
      /**
       檢測欄位是否為空值
       validate('lengthInRange', [檢測值, 欄位名稱])
       */
      method: validator.isEmpty,
      valid: false,
      message: params => ((params[1]) ? `請輸入${params[1]}` : '此欄位必填'),
    },
  ],
  lengthInRange: [
    {
      /**
       檢測輸入的文字長度是否在期望內
       用法：
       validate('lengthInRange', [檢測值, { min: 最小長度, max: 最大長度}])
       */
      method: (str, params) =>
        validator.isLength(str, params[1]),
      valid: true,
      message: params => `請輸入${params[1].min ? `${params[1].min}字以上` : ''}${params[1].max ? `${params[1].max}字以下` : ''}！`,
    },
  ],
  notEmptyAndInRange: [
    {
      /**
       檢測欄位是否為空值，以及在一字數內
       validate('lengthInRange', [檢測值, 欄位名稱, 最大長度])
       */
      method: validator.isEmpty,
      valid: false,
      message: params => ((params[1]) ? `請輸入${params[1]}` : '此欄位必填'),
    }, {
      method: (str, params) =>
        validator.isLength(str, { max: params[2] ? params[2] : undefined }),
      valid: true,
      message: (params) => {
        let message = ''
        if (params[2] !== undefined && params[2] !== '') {
          message = `${params[1]}長度不得超過${params[2]}字元`
        }
        return message
      },
    },
  ],
  checkEquality: [
    {
      /**
       檢測兩個值是否相等
       */
      method: (str, params) => validator.equals(str, params[1]),
      valid: true,
      message: () => '輸入錯誤',
    },
  ],
  inputRadioMustCheck: [
    {
      /**
       檢測input radio是否沒有被勾選到
       */
      method: name => document.querySelector(`input[name="${name}"]:checked`) !== null,
      valid: true,
      message: params => ((params[1]) ? `請選擇${params[1]}` : '此欄位必填'),
    },
  ],
  GroupInputCheck: [
    {
      /**
       利用name取得input的值或select的值並進行檢驗是否符合期待，可一次檢測多欄位值
       用法：
       validate("GroupInputCheck", [元素1, 元素2, ...])
       元素必須為陣列,可以有三種形式：
       [input名稱, 必須相等的值] ： 只檢查input與某個值得相等性
       [input名稱, 比較運算子, 比較值] ： 多了比較運算子 （只接受此六種：< , <= , = , != , >= , >）
       [input名稱, 自定義函數] : 使用自定義函數去驗證，該函數只能有一個參數傳入
       */
      method: (value, params) => {
        const compare = ValidationType.compareCheck[0].method
        return params.filter((val) => {
          const selector = document.querySelector(`[name="${val[0]}"]`)
          const checkedSelector = document.querySelector(`[name="${val[0]}"]:checked`)
          const func = typeof val[1] === 'function' ? val[1] : compare
          return (
            selector ?
              (
                selector.type !== 'radio' ?
                  !func(selector.value, val) :
                  (
                    checkedSelector ?
                      !func(checkedSelector.value, val) :
                      true
                  )
              ) :
              true
          )
        }).length === 0
      },
      valid: true,
      message: () => '輸入錯誤',
    },
  ],
  compareCheck: [
    {
      /**
       對值進行簡單的比對
       用法：
        validate('compareCheck', [被驗證的值, 比較運算子, 比較值])
        */
      method: (val, params) => {
        const v1 = val
        let operator = params[1]
        let v2 = params[2]
        if (v2 === undefined) {
          v2 = params[1]
          operator = '='
        }
        switch (operator) {
          case '<':
            return parseFloat(v1) < parseFloat(v2)
          case '<=':
            return parseFloat(v1) <= parseFloat(v2)
          case '=':
            return v1 === v2
          case '!=':
            return v1 !== v2
          case '>=':
            return parseFloat(v1) >= parseFloat(v2)
          case '>':
            return parseFloat(v1) > parseFloat(v2)
          default:
            return false
        }
      },
      valid: true,
      message: () => '驗證錯誤',
    },
  ],
  addressCheck: [
    {
      method: (value, params) => validator.isEmpty(params[0]),
      valid: false,
      message: () => '請選擇行政區域',
    },
    {
      method: (value, params) => validator.isEmpty(params[1]),
      valid: false,
      message: () => '請輸入地址',
    },
    {
      method: (value, params) => validator.isLength(params[1], { max: 2000 }),
      valid: true,
      message: () => '地址長度超過限制',
    },
  ],
  checkedThenText: [
    {
      /**
       檢測當input radio或check被勾選時,後面的input text必須填植
       */
      method: (value, params) => {
        const check = document.querySelector(`${params[0]}:checked`) !== null
        const text = document.querySelector(`${params[1]}`) ? document.querySelector(`${params[1]}`).value !== '' : true
        return (check && !text) // 當被勾選且沒填寫
      },
      valid: false,
      message: () => '請填寫欄位',
    },
    {
      method: (value, params) => {
        if (params[2]) {
          const check = document.querySelector(`${params[0]}:checked`) !== null
          const text = document.querySelector(`${params[1]}`)
          if ((check && text)) {
            return validator.isLength(document.querySelector(`${params[1]}`).value, params[2])
          }
        }
        return true
      },
      valid: true,
      message: params => `請輸入${params[2].min ? `${params[2].min}字以上` : ''}${params[2].max ? `${params[2].max}字以下` : ''}！`,
    },
  ],
  isIntInRange: [
    {
      method: (value, params) => validator.isInt(value, params[1]),
      valid: true,
      message: () => '請輸入正確數字',
    },
  ],
}

export default ValidationType
