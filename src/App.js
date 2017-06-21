import React, { Component } from 'react'
import Game from './components/game'
import './App.css'
import bg from './bg.jpg'

export default class App extends Component {
  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%'
      }}>
        <Game />
        <div className="logo" />
      </div>
    )
  }
}
