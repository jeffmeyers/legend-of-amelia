import React, { Component } from 'react'

const picture = require('../../ispy.png')

export default class ISpyChallenge extends Component {
  pass() {
    this.props.pass(
      'J',
      `
      Oh thank you so much!!! But I still won't have time to make that
      delivery. Oh darn! ... What? You would be able to help me? Oh, that
      would be wonderful! ... Oh ... You want a payment ... I guess that's
      fair. Fine, what will it be? Hmm, you are searching for clues to open
      a mystical treasure box? Let me think? I think my grandfather once told me
      you hold the key to open the box in your hands ... I wonder if he meant
      this key?? Well. That's all I know about it. Now can you please deliver these
      seven chickens to the farmer? You really are a lifesaver!
      `
    )
    this.props.grantInventory('chickens')
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        left: '650px',
        top: '0px',
        width: '400px',
        height: '420px',
        color: 'black',
        background: '#eee',
        textAlign: 'center',
        fontSize: '18px',
      }}>
        Help your trusty mailman find his key!
        <div style={{
          width: '300px',
          height: '300px',
          background: '#eee',
          margin: '0 auto',
        }}>
          <img src={picture} style={{
            width: '100%',
          }} />
          <div style={{
            width: '12px',
            height: '20px',
            background: 'blue',
            position: 'absolute',
            top: '28px',
            left: '108px',
            opacity: 0.5,
          }}
          onClick={() => this.pass()}
          />
        </div>
      </div>
    );
  }
}
