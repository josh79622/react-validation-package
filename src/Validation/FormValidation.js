import React from 'react'
import animateScrollTo from 'animated-scroll-to'
import ValidationType from './ValidationType'
import ValidationAlert from './ValidationAlert'

export default class FormValidation {
  constructor(obj) {
    this.obj = obj
    this.showValidation = false
    this.showApiErrorMessages = false
    this.ApiErrors = {}
    this.validationFormId = `${Date.now()}${Math.floor(Math.random() * 9999)}`
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
    let ele = scrolledSelector === 'body' ? window : document.querySelector(scrolledSelector)
    let x = target.offsetTop + adjustX

    const options = {
      element: ele,
      onComplete: function() {}
    }

    animateScrollTo(x, options)

  }

  freshValidations = () => {
    this.obj.setState({})
    this.showValidation = true
    this.showApiErrorMessages = false
  }

  hideValidation = () => {
    this.showValidation = false
    this.obj.setState({})
  }

  setApiErrorsObject = (obj) => {
    this.ApiErrors = obj
  }

  validate = (field, value, customizedMessage, messages = []) => {
    let param = []
    let fieldValue
    if (typeof value === 'string' || typeof value === 'number') {
      fieldValue = value
    } else if (typeof value === 'object' && value.length > 0) {
      param = value
      fieldValue = value[0]
    } else if (typeof value === 'undefined') {
      fieldValue = document.querySelector(`input[name="${field}"]`) ?
        (
          document.querySelector(`[name="${field}"]`).type !== 'radio' ?
            document.querySelector(`[name="${field}"]`).value :
            (
              document.querySelector(`[name="${field}"]:checked`) ?
                document.querySelector(`[name="${field}"]:checked`).value :
                undefined
            )
        ) :
        undefined
    }

    if (fieldValue !== undefined && ValidationType[field] !== undefined) {
      ValidationType[field].forEach((type, key) => {
        if (type.method(fieldValue, param) !== type.valid) {
          if (typeof customizedMessage === 'string') {
            messages.push(customizedMessage)
          } else if (customizedMessage === undefined || customizedMessage[key] === undefined || customizedMessage[key] === '') {
            messages.push(type.message(param))
          } else if (customizedMessage[key] !== undefined && customizedMessage[key]) {
            messages.push(customizedMessage[key])
          }
        }
      })
    }
    return {
      validate: (f, v, c) => this.validate(f, v, c, messages),
      getApiError: (k, c) => this.getApiError(k, c, messages),
      showValidationAlert: s => this.showValidationAlert(messages, [], s),
      getMessages: () => ({ validateMessages: messages }),
      result: (messages.length === 0),
    }
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
