import validator from 'validator'

const ValidationType = {
  notEmpty: value => validator.isEmpty(value) === false,
  inputBeChecked: selector => document.querySelector(`${selector}:checked`) !== null,
  numberComparison: (v1, operator, v2) => {
    if (v2 === undefined) {
      v2 = operator
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
}

Object.assign(ValidationType, validator)

export default ValidationType
