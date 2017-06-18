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
      this.moveCharacterDown()
    }
    if (code === "ArrowUp") {
      this.moveCharacterUp()
    }
    if (code === "ArrowLeft") {
      this.moveCharacterLeft()
    }
    if (code === "ArrowRight") {
      this.moveCharacterRight()
    }
    if (code === "Space") {
      this.interact()
    }
  }

  interact() {
    console.log('interact!')

    if (this.state.message) {
      this.setState({ message: null })
      return
    }

    const { map, characterOrientation } = this.state
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    let message = null

    if (characterOrientation === CharacterOrientations.Down) {
      message = safeGet(map.interactions, rowIndex + 1, columnIndex)
    }
    if (characterOrientation === CharacterOrientations.Up) {
      message = safeGet(map.interactions, rowIndex - 1, columnIndex)
    }
    if (characterOrientation === CharacterOrientations.Left) {
      message = safeGet(map.interactions, rowIndex, columnIndex - 1)
    }
    if (characterOrientation === CharacterOrientations.Right) {
      message = safeGet(map.interactions, rowIndex, columnIndex + 1)
    }

    if (message) this.setState({ message })
    if (!message) this.setState({ message: null })
  }

  moveCharacterDown() {
    const { map, characterOrientation } = this.state

    if (characterOrientation !== CharacterOrientations.Down) {
      this.setState({ characterOrientation: CharacterOrientations.Down })
      return
    }

    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    if (rowIndex === this.state.map.tiles.length -1) return
    if (map.tiles[rowIndex + 1][columnIndex] === TileTypes.Obstacle) return
    if (map.tiles[rowIndex + 1][columnIndex] === TileTypes.Door) {
      const newMap = this.state.map.doors[rowIndex + 1][columnIndex]
      if (newMap) {
        this.setState({
          map: newMap,
        })
      }
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[rowIndex + 1][columnIndex] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterUp() {
    const { map, characterOrientation } = this.state

    if (characterOrientation !== CharacterOrientations.Up) {
      this.setState({ characterOrientation: CharacterOrientations.Up })
      return
    }

    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    if (rowIndex === 0) return
    if (map.tiles[rowIndex - 1][columnIndex] === TileTypes.Obstacle) return
    if (map.tiles[rowIndex - 1][columnIndex] === TileTypes.Door) {
      const newMap = this.state.map.doors[rowIndex - 1][columnIndex]
      if (newMap) {
        this.setState({
          map: newMap,
        })
      }
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[rowIndex - 1][columnIndex] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterLeft() {
    const { map, characterOrientation } = this.state

    if (characterOrientation !== CharacterOrientations.Left) {
      this.setState({ characterOrientation: CharacterOrientations.Left })
      return
    }

    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    if (columnIndex === 0) return
    if (map.tiles[rowIndex][columnIndex - 1] === TileTypes.Obstacle) return
    if (map.tiles[rowIndex][columnIndex - 1] === TileTypes.Door) {
      const newMap = this.state.map.doors[rowIndex][columnIndex - 1]
      console.log({newMap})
      if (newMap) {
        this.setState({
          map: newMap,
        })
      }
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[rowIndex][columnIndex - 1] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterRight() {
    const { map, characterOrientation } = this.state

    if (characterOrientation !== CharacterOrientations.Right) {
      this.setState({ characterOrientation: CharacterOrientations.Right })
      return
    }

    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]

    if (columnIndex === this.state.map.tiles[0].length - 1) return
    if (map.tiles[rowIndex][columnIndex + 1] === TileTypes.Obstacle) return
    if (map.tiles[rowIndex][columnIndex + 1] === TileTypes.Door) {
      const newMap = this.state.map.doors[rowIndex][columnIndex + 1]
      if (newMap) {
        this.setState({
          map: newMap,
        })
      }
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[rowIndex][columnIndex + 1] = TileTypes.Character

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

  render() {
    return (
      <div style={{
        position: 'absolute'
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
    )
  }
}
