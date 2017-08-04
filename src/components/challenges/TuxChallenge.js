import React, { Component } from 'react'
import { SlidingPuzzle } from 'react-puzzle'

const tux = require('../../tux.jpg');

export default class TuxChallenge extends Component {
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
        top: 0,
        left: '650px',
        background: '#777',
        textAlign: 'center',
        height: '400px',
        width: '400px'
      }}>
        <SlidingPuzzle src={tux} rows={3} cols={3} />
      </div>
    )
  }
}
