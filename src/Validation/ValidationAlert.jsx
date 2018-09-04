import React from 'react'

export default class ValidationAlert extends React.Component {
  render() {
    return (
      <div style={this.props.show ? {} : { display: 'none' }} className={`alert alert-danger validationForm-${this.props.validationFormId}`} role="alert">
        <label>
          <small>
            {this.props.message}
          </small>
        </label>
      </div>
    )
  }
}
