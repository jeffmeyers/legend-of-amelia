import React, { Component } from 'react'
import { times, sample } from 'lodash'
import PoopInvadersChallenge from './challenges/PoopInvadersChallenge';
import TuxChallenge from './challenges/TuxChallenge';
import Bounce from 'bounce.js';

import * as map1 from './maps/1'

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

const TILE_HEIGHT = 40
const TILE_WIDTH = 40
const TILE_STYLE = {
  float: 'left',
  height: TILE_HEIGHT,
  width: TILE_WIDTH,
}

const Row = (props) => <div style={{ clear: 'left' }}>{props.children}</div>;

const MovableTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'transparent'
  })} />
)

const ObstacleTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'grey',
    opacity: 0,
  })} />
)

const DoorTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'red'
  })} />
)

const characterTileClass = (props) => {
  if (props.orientation === CharacterOrientations.Left) return 'characterLeft'
  if (props.orientation === CharacterOrientations.Right) return 'characterRight'
  if (props.orientation === CharacterOrientations.Up) return 'characterBack'
  if (props.orientation === CharacterOrientations.Down) return 'characterFront'
}

const CharacterTile = (props) => (
  <div id='character' style={Object.assign({}, TILE_STYLE, { background: 'transparent' })}>
    <div className={characterTileClass(props)} />
  </div>
)

const EnemyTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'yellow'
  })} />
)

const Message = (props) => (
  <div style={{
    position: 'absolute',
    bottom: '145px',
    left: '10px',
    width: '780px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.95)',
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

const Intro = (props) => (
  <div style={{
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'black',
    color: 'white',
    textAlign: 'center',
    paddingTop: '150px',
    boxSizing: 'border-box',
    fontSize: '32px',
    opacity: props.opacity,
  }}>
    {props.opacity > 0.8 && 'Amelink...'}
    {props.opacity > 0.6 && props.opacity < 0.8 && '...Amelink...'}
    {props.opacity > 0.4 && props.opacity < 0.6 && '...Aaaamelink...'}
    {props.opacity > 0 && props.opacity < 0.4 && 'HEY, LISTEN!'}
  </div>
)

const defaultState = {
  map: map1,
  characterOrientation: CharacterOrientations.Down,
  message: null,
  challenge: null,
  numHearts: 10,
  letters: [],
  justStarted: true,
  introOpacity: 1.0,
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
    this.start()

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

  start() {
    const id = setInterval(() => {
      this.setState({ introOpacity: this.state.introOpacity - 0.1 })
    }, 1000)

    setTimeout(() => this.makeCharacterJump(), 7500)

    setTimeout(() => {
      clearInterval(id)
    }, 11000)
  }
  
  makeCharacterJump() {
    var bounce = new Bounce();
    bounce
      .translate({
        from: { x: 0, y: -25 },
        to: { x: 0, y: 0 },
        duration: 1500,
      })
      .applyTo(document.getElementById('character'));
  }

  restart() {
    this.setState(defaultState)
  }

  moveRandomEnemy() {
    const enemyCoords = sample(this.findEnemies());
    if (!enemyCoords) return
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
    if (this.state.challenge) return;

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
        pass={(letter) => {
          const { letters } = this.state
          letters.push(letter)
          this.setState({ challenge: null, letters })
        }}
        fail={() => {
          const { numHearts } = this.state
          this.setState({ challenge: null, numHearts: numHearts - 1 })
        }}
      />
    )
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        width: '640px'
      }}>
        {this.state.justStarted && <Intro opacity={this.state.introOpacity} />}
        {this.state.numHearts === 0 && <Gameover restart={this.restart} />}
        <div className="map" style={{
          float: 'left',
          width: '640px',
          background: `url(${this.state.map.background})`
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
          fontSize: '48px',
          textAlign: 'center',
          width: '800px',
          paddingTop: '10px'
        }}>
          {times(this.state.numHearts, () => '❤️')}
          {times(10 - this.state.numHearts, () => (
            <span style={{
              opacity: '0.5'
            }}>
              💔
            </span>
          ))}
        </div>
        <div style={{
          fontSize: '48px',
          color: 'white',
          textAlign: 'center',
          width: '800px'
        }}>
          {this.state.letters[0] || '🔒'}
          {this.state.letters[1] || '🔒'}
          &nbsp;
          {this.state.letters[2] || '🔒'}
          {this.state.letters[3] || '🔒'}
          {this.state.letters[4] || '🔒'}
          {this.state.letters[5] || '🔒'}
          {this.state.letters[6] || '🔒'}
          {this.state.letters[7] || '🔒'}
          {this.state.letters[8] || '🔒'}
        </div>
      </div>
    )
  }
}
