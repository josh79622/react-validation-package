import React from 'react'
import animateScrollTo from 'animated-scroll-to'
import ValidationType from './ValidationType'
import ValidationAlert from './ValidationAlert'

export default class FormValidation {
  constructor(obj, lang = '') {
    this.obj = obj
    this.validationType = ValidationType
    this.validationErrorMessages = {}
    this.language = lang
    this.showValidation = false
    this.showApiErrorMessages = false
    this.ApiErrors = {}
    this.validationFormId = `${Date.now()}${Math.floor(Math.random() * 9999)}`
  }

  resetLanguage = (lang) => {
    this.language = lang
    this.obj.setState({})
  }

  importValidationType = (newValidationType) => {
    this.validationType = Object.assign({}, this.validationType, newValidationType)
  }

  importErrorMessages = (newErrorMessages) => {
    this.validationErrorMessages = Object.assign({}, this.validationErrorMessages, newErrorMessages)
  }

  getValidationResult = () => (
    new Promise((resolve) => {
      this.freshValidations()
      resolve()
    }).then(() => new Promise((resolve, reject) => {
      const validationNum = document.getElementsByClassName(`validationForm-${this.validationFormId}`).length
      if (validationNum > 0) {
        reject()
      } else {
        this.showApiErrorMessages = true
        resolve()
      }
    }))
  )

  showFirstFailValidation = (scrolledSelector, adjustX = 0) => {
    const target = document.querySelector(`.validationForm-${this.validationFormId}`)
    const ele = scrolledSelector === 'body' ? window : document.querySelector(scrolledSelector)
    const x = target.offsetTop + adjustX

    const options = {
      element: ele,
      onComplete() {},
    }

    animateScrollTo(x, options)
  }

  freshValidations = () => {
    this.showValidation = true
    this.showApiErrorMessages = false
    this.obj.setState({})
  }

  hideValidation = () => {
    this.showValidation = false
    this.obj.setState({})
  }

  setApiErrorsObject = (obj) => {
    this.ApiErrors = obj
  }

  validate = (validator, param, customizedMessage, messages = []) => {
    if (validator && this.validationType[validator] !== undefined) {
      let params
      if (typeof value === 'object' && value.length > 0) {
        params = [...param]
      } else {
        params = [param]
      }

      if (!this.validationType[validator].apply(null, params)) {
        if (typeof customizedMessage === 'string') {
          messages.push(customizedMessage)
        } else if (this.validationErrorMessages[validator]) {
          let m = ''
          if (this.language) {
            if (this.validationErrorMessages[validator][this.language] && typeof this.validationErrorMessages[validator][this.language] === 'string') {
              m = this.validationErrorMessages[validator][this.language]
            }
          } else {
            if (typeof this.validationErrorMessages[validator] === 'object') {
              const keys = Object.keys(this.validationErrorMessages[validator])
              if (keys.length > 0 && typeof this.validationErrorMessages[validator][keys[0]] === 'string') {
                m = this.validationErrorMessages[validator][keys[0]]
              }
            } else if (typeof this.validationErrorMessages[validator] === 'string') {
              m = this.validationErrorMessages[validator]
            }
          }
          messages.push(m)
        } else {
          messages.push('')
        }
    }
    return {
      validate: (v, p, c) => this.validate(v, p, c, messages),
      validateInSelector: (v, s, c) => this.validateInSelector(v, s, c, messages),
      validateInPrecondition: (v, p, c, pre) => this.validateInPrecondition(v, p, c, pre, messages),
      getApiError: (k, c) => this.getApiError(k, c, messages),
      showValidationAlert: s => this.showValidationAlert(messages, [], s),
      getMessages: () => ({ validateMessages: messages }),
      result: (messages.length === 0),
    }
  }

  validateInSelector = (validator, selector, customizedMessage, messages = []) => {
    if (document.querySelector(selector)) {
      return this.validate(validator, document.querySelector(selector).value, customizedMessage, messages)
    }
    return {
      validate: (v, p, c) => this.validate(v, p, c, messages),
      validateInSelector: (v, s, c) => this.validateInSelector(v, s, c, messages),
      validateInPrecondition: (v, p, c, pre) => this.validateInPrecondition(v, p, c, pre, messages),
      getApiError: (k, c) => this.getApiError(k, c, messages),
      showValidationAlert: s => this.showValidationAlert(messages, [], s),
      getMessages: () => ({ validateMessages: messages }),
      result: (messages.length === 0),
    }
  }

  validateInPrecondition = (validator, param, customizedMessage, precondition = [], messages = []) => {
    if (typeof precondition === 'object' && precondition.length > 0) {
      let params
      if (typeof value === 'object' && value.length > 0) {
        params = [...param]
      } else {
        params = [param]
      }
      const doFinalValidation = precondition.every((condition) => {
        if (typeof condition === 'string' && this.validationType[condition]) {
          if (this.validationType[condition].apply(null, params)) {
            return false
          }
        }
        return true
      })
      if (!doFinalValidation) {
        return {
          validate: (v, p, c) => this.validate(v, p, c, messages),
          validateInSelector: (v, s, c) => this.validateInSelector(v, s, c, messages),
          validateInPrecondition: (v, p, c, pre) => this.validateInPrecondition(v, p, c, pre, messages),
          getApiError: (k, c) => this.getApiError(k, c, messages),
          showValidationAlert: s => this.showValidationAlert(messages, [], s),
          getMessages: () => ({ validateMessages: messages }),
          result: (messages.length === 0),
        }
      }
    }
    return this.validate(validator, param, customizedMessage, messages)
  }

  getApiError = (key, customizedMessage, validateMessages = [], apiErrorMessages = []) => {
    if (this.ApiErrors[key] !== undefined) {
      apiErrorMessages.push(customizedMessage || this.ApiErrors[key])
    }
    return {
      getApiError: (k, c) => this.getApiError(k, c, validateMessages, apiErrorMessages),
      showValidationAlert: s => this.showValidationAlert(validateMessages, apiErrorMessages, s),
      getMessages: () => ({ validateMessages, apiErrorMessages }),
    }
  }

  showValidationAlert = (validateMessages = [], apiErrorMessages = [], show = 'first') => {
    let messages
    if (this.showApiErrorMessages) {
      messages = apiErrorMessages
    } else {
      messages = validateMessages
    }
    if (messages.length > 0) {
      if (show === 'first') {
        return <ValidationAlert show={this.showValidation} message={messages[0]} validationFormId={this.validationFormId}/>
      } else if (show === 'all') {
        return messages.map((message, k) =>
          <ValidationAlert
            key={k}
            show={this.showValidation}
            message={message}
            validationFormId={this.validationFormId}/>)
      }
    }
    return ''
  }
}
