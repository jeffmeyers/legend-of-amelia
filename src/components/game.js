import React, { Component } from 'react'

import * as mainMap from './maps/main'
import * as otherMap from './maps/other'

const safeGet = (matrix, row, column) => {
  if (!matrix) return null;
  if (!matrix[row]) return null;
  return matrix[row][column];
}

const TileTypes = {
  Movable: 1,
  Obstacle: 2,
  Character: 3,
  Door: 4,
}

const CharacterOrientations = {
  Right: 1,
  Left: 2,
  Down: 3,
  Up: 4,
}

const Directions = {
  Right: 1,
  Left: 2,
  Down: 3,
  Up: 4,
}

const getNextRowIndex = (rowIndex, direction) => {
  if (direction === Directions.Up) {
    return rowIndex - 1
  }

  if (direction === Directions.Down) {
    return rowIndex + 1
  }

  return rowIndex
}

const getNextColumnIndex = (columnIndex, direction) => {
  if (direction === Directions.Left) {
    return columnIndex - 1
  }

  if (direction === Directions.Right) {
    return columnIndex + 1
  }

  return columnIndex
}

const moveWouldBeOutOfBounds = (nextRowIndex, nextColumnIndex, direction, tiles) => {
  if (direction === Directions.Up) {
    return nextRowIndex === -1
  }

  if (direction === Directions.Down) {
    return nextRowIndex === tiles.length
  }

  if (direction === Directions.Left) {
    return nextColumnIndex === -1
  }

  if (direction === Directions.Right) {
    return nextColumnIndex === tiles[0].length
  }
}

const TILE_HEIGHT = 50
const TILE_WIDTH = 50
const TILE_STYLE = {
  float: 'left',
  height: TILE_HEIGHT,
  width: TILE_WIDTH,
}

const Row = (props) => <div style={{ clear: 'left' }}>{props.children}</div>;

const MovableTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'green'
  })} />
)

const ObstacleTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'grey'
  })} />
)

const DoorTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'red'
  })} />
)

const CharacterTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'blue',
    borderLeft: props.orientation === CharacterOrientations.Left ? '2px solid black' : '2px solid blue',
    borderRight: props.orientation === CharacterOrientations.Right ? '2px solid black' : '2px solid blue',
    borderTop: props.orientation === CharacterOrientations.Up ? '2px solid black' : '2px solid blue',
    borderBottom: props.orientation === CharacterOrientations.Down ? '2px solid black' : '2px solid blue',
    boxSizing: 'border-box'
  })} />
)

const Message = (props) => (
  <div style={{
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    width: '780px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '2px solid black',
    borderRadius: '5px',
    padding: '5px',
    boxSizing: 'border-box'
  }}>
    {props.message}
  </div>
)

export default class Game extends Component {
  constructor() {
    super()

    this.onKeyUp = this.onKeyUp.bind(this)

    this.state = {
      map: mainMap,
      characterOrientation: CharacterOrientations.Down,
      message: null,
      challenge: null,
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    console.log('hi')
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
  }

  onKeyUp(evt) {
    console.log(evt)
    const { code } = evt
    if (code === "ArrowDown") {
      this.moveCharacter(Directions.Down)
    }
    if (code === "ArrowUp") {
      this.moveCharacter(Directions.Up)
    }
    if (code === "ArrowLeft") {
      this.moveCharacter(Directions.Left)
    }
    if (code === "ArrowRight") {
      this.moveCharacter(Directions.Right)
    }
    if (code === "Space") {
      this.interact()
    }
  }

  interact() {
    console.log('interact!')

    if (this.state.message) {
      this.setState({ message: null })
    }

    const { map, characterOrientation } = this.state
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    let nextRowIndex, nextColumnIndex

    if (characterOrientation === CharacterOrientations.Down) {
      nextRowIndex = rowIndex + 1
      nextColumnIndex = columnIndex
    }
    if (characterOrientation === CharacterOrientations.Up) {
      nextRowIndex = rowIndex - 1
      nextColumnIndex = columnIndex
    }
    if (characterOrientation === CharacterOrientations.Left) {
      nextRowIndex = rowIndex
      nextColumnIndex = columnIndex - 1
    }
    if (characterOrientation === CharacterOrientations.Right) {
      nextRowIndex = rowIndex
      nextColumnIndex = columnIndex + 1
    }

    const challenge = safeGet(map.challenges, nextRowIndex, nextColumnIndex)
    if (challenge) {
      console.log('A CHALLENGE')
      this.setState({
        challenge,
      })
      return
    }

    const message = safeGet(map.interactions, nextRowIndex, nextColumnIndex)
    if (message) this.setState({ message })
    if (!message) this.setState({ message: null })
  }

  moveCharacter(direction) {
    this.setState({ message: null })
    const { map, characterOrientation } = this.state

    if (direction === Directions.Down && characterOrientation !== CharacterOrientations.Down) {
      this.setState({ characterOrientation: CharacterOrientations.Down })
      return
    }

    if (direction === Directions.Up && characterOrientation !== CharacterOrientations.Up) {
      this.setState({ characterOrientation: CharacterOrientations.Up })
      return
    }

    if (direction === Directions.Left && characterOrientation !== CharacterOrientations.Left) {
      this.setState({ characterOrientation: CharacterOrientations.Left })
      return
    }

    if (direction === Directions.Right && characterOrientation !== CharacterOrientations.Right) {
      this.setState({ characterOrientation: CharacterOrientations.Right })
      return
    }

    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    let nextRowIndex = getNextRowIndex(rowIndex, direction)
    let nextColumnIndex = getNextColumnIndex(columnIndex, direction)

    if (moveWouldBeOutOfBounds(nextRowIndex, nextColumnIndex, direction, this.state.map.tiles)) return

    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Obstacle) return
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Door) {
      const newMap = this.state.map.doors[nextRowIndex][nextColumnIndex]
      if (newMap) {
        this.setState({
          map: newMap,
        })
      }
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[nextRowIndex][nextColumnIndex] = TileTypes.Character

    this.setState({ map })
  }

  findCharacter() {
    let rowIndex, columnIndex;
    this.state.map.tiles.forEach((row, currentRowIndex) => {
      const foundColumnIndex = row.findIndex(tileType => {
        return tileType === TileTypes.Character
      })
      if (foundColumnIndex !== -1) {
        rowIndex = currentRowIndex
        columnIndex = foundColumnIndex
      }
    })
    return [rowIndex, columnIndex]
  }

  renderChallenge() {
    const Klass = this.state.challenge;
    return (
      <Klass
        pass={() => {
          alert('pass')
          this.setState({ challenge: null })
        }}
        fail={() => {
          alert('fail')
          this.setState({ challenge: null })
        }}
      />
    )
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        width: '1000px'
      }}>
        <div style={{
          float: 'left',
          width: '800px',
        }}>
          {this.state.map.tiles.map((row, idx) => (
            <Row key={idx}>
              {row.map((tileType, idx) => {
                switch (tileType) {
                  case TileTypes.Movable: {
                    return <MovableTile key={idx} />
                  }
                  case TileTypes.Obstacle: {
                    return <ObstacleTile key={idx} />
                  }
                  case TileTypes.Character: {
                    return <CharacterTile key={idx} orientation={this.state.characterOrientation} />
                  }
                  case TileTypes.Door: {
                    return <DoorTile key={idx} />
                  }
                  default: {
                    return <MovableTile key={idx} />
                  }
                }
              })}
            </Row>
          ))}
          {this.state.message && <Message message={this.state.message} />}
        </div>
        <div style={{
          float: 'left',
          width: '200px'
        }}>
          {this.state.challenge && this.renderChallenge()}
        </div>
      </div>
    )
  }
}
