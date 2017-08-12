import React, { Component } from 'react'
import { times, shuffle, isEqual } from 'lodash'

const tuxImages = [
  require('../../tux/0.png'),
  require('../../tux/1.png'),
  require('../../tux/2.png'),
  require('../../tux/3.png'),
  require('../../tux/4.png'),
  require('../../tux/5.png'),
  require('../../tux/6.png'),
  require('../../tux/7.png'),
]

const tileStyle = {
  width: '98px',
  height: '98px',
  borderSizing: 'border-box',
  border: '1px solid black',
  float: 'left',
}

const tileStyleForIndex = (idx) => {
  return Object.assign({}, tileStyle, {
    background: `url('${tuxImages[idx]}')`,
  })
}

const SOLUTION = [0, 1, 2, 3, 4, 5, 6, 7, -1]

export default class TuxChallenge extends Component {
  constructor() {
    super()

    this.state = {
      // puzzle: shuffle(SOLUTION)
      // puzzle: [0, 1, 2, 3, 4, 5, 6, -1, 7]
      puzzle: [-1, 3, 5, 0, 6, 1, 4, 7, 2]
    }

    this.tryMove = this.tryMove.bind(this)
  }

  shouldComponentUpdate() {
    return false
  }

  tryMove(idx) {
    const { puzzle } = this.state;
    const positionInMatrix = puzzle.findIndex(val => val === idx)
    const upAvail = puzzle[positionInMatrix - 3] === -1
    const downAvail = puzzle[positionInMatrix + 3] === -1
    const rightAvail = puzzle[positionInMatrix + 1] === -1
    const leftAvail = puzzle[positionInMatrix - 1] === -1
    

    if (downAvail) {
      puzzle[positionInMatrix + 3] = idx
      puzzle[positionInMatrix] = -1
    }

    if (upAvail) {
      puzzle[positionInMatrix - 3] = idx
      puzzle[positionInMatrix] = -1
    }

    if (rightAvail) {
      puzzle[positionInMatrix + 1] = idx
      puzzle[positionInMatrix] = -1
    }

    if (leftAvail) {
      puzzle[positionInMatrix - 1] = idx
      puzzle[positionInMatrix] = -1
    }

    this.setState({ puzzle }, () => {
      this.forceUpdate()
      
      if (isEqual(this.state.puzzle, SOLUTION)) {
        this.props.pass('H', `
        Thank you so much!!! Oh, he looks good as new! Is there anything I can do for you?
        ...You are trying to open a box? Hmmm, I think my parents told me on my birthday
        that my age corresponded to both the code and the position of a treasure box. I wonder
        if that could be helpful?
        `);
        this.props.grantClue(
          `
          The boy who got a dog for his birthday said his age corresponds to both the code
          and number position.
          `
        )
      }
    })
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        left: '650px',
        top: '0px',
        width: '400px',
        height: '400px',
        color: 'black',
        background: '#eee',
        textAlign: 'center',
        fontSize: '18px'
      }}>
        Oh no! Our dog is all scrambled. Can you help?
        <div style={{
          width: '300px',
          height: '300px',
          background: '#eee',
          margin: '0 auto'
        }}>
          {this.state.puzzle.map(idx => (
            <div
              key={idx}
              style={tileStyleForIndex(idx)}
              onClick={() => this.tryMove(idx)}
            />
          ))}
        </div>
      </div>
    );
  }
}
