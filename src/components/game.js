import React, { Component } from 'react'
import { times, sample } from 'lodash'

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
  Enemy: 5,
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

const getRandomDirection = () => (
  Directions[sample(Object.keys(Directions))]
)

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

const EnemyTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'yellow'
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

const Gameover = (props) => (
  <div style={{
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'black',
    color: 'red',
    textAlign: 'center',
    paddingTop: '150px',
    boxSizing: 'border-box',
    fontSize: '32px'
  }} onClick={() => props.restart()}>
    Game over!
    <div style={{
      color: 'white',
      fontSize: '18px'
    }}>
      Click to restart.
    </div>
  </div>
)

const defaultState = {
  map: mainMap,
  characterOrientation: CharacterOrientations.Down,
  message: null,
  challenge: null,
  numHearts: 10,
}

export default class Game extends Component {
  constructor() {
    super()

    this.onKeyUp = this.onKeyUp.bind(this)
    this.moveRandomEnemy = this.moveRandomEnemy.bind(this)
    this.restart = this.restart.bind(this)

    this.state = defaultState
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)

    setInterval(() => {
      if (Math.floor(Math.random() * 10) > 5) {
        this.moveRandomEnemy()
      }
    }, 500)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
  }

  restart() {
    this.setState(defaultState)
  }

  moveRandomEnemy() {
    const enemyCoords = sample(this.findEnemies());
    if (!enemyCoords) return
    console.log({enemyCoords})
    const rowIndex = enemyCoords[0];
    const columnIndex = enemyCoords[1];
    const direction = getRandomDirection();

    const { map } = this.state
    let nextRowIndex = getNextRowIndex(rowIndex, direction)
    let nextColumnIndex = getNextColumnIndex(columnIndex, direction)

    if (moveWouldBeOutOfBounds(nextRowIndex, nextColumnIndex, direction, this.state.map.tiles)) return
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Obstacle) return
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Enemy) return
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Door) return
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Character) {
      const { numHearts } = this.state
      this.setState({ numHearts: numHearts - 1 })
      return
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[nextRowIndex][nextColumnIndex] = TileTypes.Enemy

    this.setState({ map })
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
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Enemy) {
      const { numHearts } = this.state
      this.setState({ numHearts: numHearts - 1})
      return
    }
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

  findEnemies() {
    const enemies = [];
    this.state.map.tiles.forEach((row, rowIndex) => {
      row.forEach((tileType, columnIndex) => {
        if (tileType === TileTypes.Enemy) {
          enemies.push([rowIndex, columnIndex]);
        }
      })
    })
    return enemies;
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
          const { numHearts } = this.state
          this.setState({ challenge: null, numHearts: numHearts - 1 })
        }}
      />
    )
  }

  render() {
    console.log(this.findEnemies());
    return (
      <div style={{
        position: 'absolute',
        width: '1000px'
      }}>
        {this.state.numHearts === 0 && <Gameover restart={this.restart} />}
        <div style={{
          float: 'left',
          width: '800px',
        }}>
          {this.state.map.tiles.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((tileType, columnIndex) => {
                switch (tileType) {
                  case TileTypes.Movable: {
                    return <MovableTile key={columnIndex} />
                  }
                  case TileTypes.Obstacle: {
                    return <ObstacleTile key={columnIndex} />
                  }
                  case TileTypes.Character: {
                    return <CharacterTile key={columnIndex} orientation={this.state.characterOrientation} />
                  }
                  case TileTypes.Door: {
                    return <DoorTile key={columnIndex} />
                  }
                  case TileTypes.Enemy: {
                    return <EnemyTile key={columnIndex} />
                  }
                  default: {
                    return <MovableTile key={columnIndex} />
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
        <div style={{
          clear: 'left',
          fontSize: '28px'
        }}>
          {times(this.state.numHearts, () => '❤️')}
          {times(10 - this.state.numHearts, () => '💔')}
        </div>
      </div>
    )
  }
}
