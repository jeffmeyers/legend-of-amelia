import React, { Component } from 'react'

export default class MarshyChallenge extends Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)

    this.state = {
      answer: '',
    }
  }

  onChange(evt) {
    this.setState({ answer: evt.target.value })
  }

  onClick() {
    if (this.state.answer.match(/marshy/i)) {
      this.props.pass('H');
    } else {
      this.props.fail();
    }
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        background: '#777',
        textAlign: 'center',
        height: '100%'
      }}>
        What is our dog's name?<br />
        <input type="text" onChange={this.onChange} /><br />
        <button onClick={this.onClick}>Submit</button>
      </div>
    )
  }
}
