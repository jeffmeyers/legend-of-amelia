import React, { Component } from 'react'
import { times, sample, includes, uniq, clone } from 'lodash'
import PoopInvadersChallenge from './challenges/PoopInvadersChallenge';
import TuxChallenge from './challenges/TuxChallenge';
import ISpyChallenge from './challenges/ISpyChallenge';
import Bounce from 'bounce.js';

import * as map1 from './maps/1'

const safeGet = (matrix, row, column) => {
  if (!matrix) return null
  if (!matrix[row]) return null
  return matrix[row][column] || null
}

const TileTypes = {
  Movable: 1,
  Obstacle: 2,
  Character: 3,
  Door: 4,
  Enemy: 5,
  Citizen: 6,
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
    background: 'red',
    opacity: 0,
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

const CitizenTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: props.character ? `url(${props.character})` : 'magenta',
    backgroundSize: 'cover',
  })} />
)

const Message = (props) => (
  <div style={{
    position: 'absolute',
    top: '290px',
    left: '10px',
    width: '620px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '5px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
  }}>
    {props.message}
    <p style={{
      textTransform: 'small-caps',
      fontSize: '10px',
    }}>hit space to continue</p>
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
  completedChallenges: [],
  inventory: [],
  clues: [],
}

export default class Game extends Component {
  constructor() {
    super()

    this.onKeyUp = this.onKeyUp.bind(this)
    this.moveRandomEnemy = this.moveRandomEnemy.bind(this)
    this.restart = this.restart.bind(this)
    this.checkSolution = this.checkSolution.bind(this)

    this.state = defaultState
  }

  componentDidMount() {
    this.start()

    setInterval(() => {
      if (Math.floor(Math.random() * 10) > 5) {
        this.moveRandomEnemy()
      }
    }, 500)
  }

  checkSolution(evt) {
    evt.preventDefault()
    if (this.state.solution === '7314') {
      this.setState({
        message: '🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉'
      })
    } else {
      this.setState({
        message: 'Wrong. Maybe you should talk to a few more people?'
      })
    }
  }

  start() {
    const id = setInterval(() => {
      this.setState({ introOpacity: this.state.introOpacity - 0.1 })
    }, 1000)

    setTimeout(() => this.makeCharacterJump(), 7500)

    setTimeout(() => {
      clearInterval(id)
      this.setState({
        justStarted: false,
        message: `
        Ahem. That's better. Today you are faced with many challenges. But none
        so great as the one that faces you now. In order to proceed you must collect
        clues in order to open the locked box in front of you. I would start checking
        around to see if any of the villagers can help you.
        `
      })
    }, 11000)
    document.addEventListener('keyup', this.onKeyUp)
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
    if (this.state.challenge) {
      console.info('keyup:ignore')
      return
    }

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
    let justClearedMessage = false
    if (this.state.message) {
      justClearedMessage = true
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

    let challenge = safeGet(map.challenges, nextRowIndex, nextColumnIndex)
    let message = safeGet(map.interactions, nextRowIndex, nextColumnIndex)
    if (message && typeof message === 'function') {
      message = message(this.state.inventory, (clue) => {
        this.setState({
          clues: uniq([...this.state.clues, clue]),
        })
      })
    }
    const hasCompletedChallenge = includes(this.state.completedChallenges, challenge)
    if (justClearedMessage || hasCompletedChallenge) {
      message = null
      challenge = null
    }
    this.setState({ message, challenge })
  }

  moveCharacter(direction) {
    console.info('character:move', { direction })
    // this.setState({ message: null })
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
    if (map.tiles[nextRowIndex][nextColumnIndex] === TileTypes.Citizen) return
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

    let challenge = safeGet(map.triggers, rowIndex, columnIndex)
    let message = null
    const hasCompletedChallenge = includes(this.state.completedChallenges, challenge)
    if (challenge && !hasCompletedChallenge) {
      message = safeGet(map.interactions, rowIndex, columnIndex)
    }
    if (hasCompletedChallenge) {
      challenge = null
    }

    map.tiles[rowIndex][columnIndex] = TileTypes.Movable
    map.tiles[nextRowIndex][nextColumnIndex] = TileTypes.Character

    const newState = { map }
    if (message) newState.message = message
    if (challenge) newState.challenge = challenge

    this.setState(newState)
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
    if (includes(this.state.completedChallenges, Klass)) return null;
    return (
      <Klass
        pass={(letter, message = null) => {
          const { letters } = this.state
          letters.push(letter)
          this.setState({
            challenge: null,
            letters,
            message,
            completedChallenges: [...this.state.completedChallenges, Klass],
          })
        }}
        fail={() => {
          const { numHearts } = this.state
          this.setState({ challenge: null, numHearts: numHearts - 1 })
        }}
        grantInventory={(item) => {
          this.setState({
            inventory: uniq([...this.state.inventory, item]),
          })
        }}
        grantClue={(clue) => {
          this.setState({
            clues: uniq([...this.state.clues, clue]),
          })
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
                  case TileTypes.Citizen: {
                    return <CitizenTile key={columnIndex} character={this.state.map.character} />
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
          fontSize: '48px',
          color: 'white',
          textAlign: 'center',
          width: '650px'
        }}>
          <form onSubmit={this.checkSolution}>
            <input
              type="text"
              style={{
                fontSize: '48px',
                width: '192px',
                background: '#eee',
                outline: 'none',
                border: 'none'
              }}
              placeholder="🔒🔒🔒🔒"
              onChange={(evt) => this.setState({ solution: evt.target.value })}
            />
          </form>
        </div>
        <div style={{
          fontSize: '48px',
          color: 'white',
          textAlign: 'center',
          width: '650px',
        }}>
          {includes(this.state.inventory, 'chickens') &&
            '🐓'
          }
        </div>
        <div style={{
          fontSize: '10px',
          color: 'white',
          textAlign: 'left',
          width: '650px',
        }}>
          <ul style={{ listStyle: 'none' }}>
            {this.state.clues.map((clue, idx) => (
              <li key={idx}>
                {clue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
