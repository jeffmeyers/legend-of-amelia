import React, { Component } from 'react'
import { times, shuffle, isEqual, random, sampleSize } from 'lodash'

const TileTypes = {
  Nothing: 0,
  Enemy: 1,
  Character: 2,
  Missile: 3,
  EnemyMissile: 4,
}

const Directions = {
  Left: 0,
  Right: 1,
  Down: 2,
}

const tileStyle = {
  width: '30px',
  height: '30px',
  float: 'left',
}

const NothingTile = (props) => (
  <div style={tileStyle}>
  </div>
)

const EnemyTile = (props) => (
  <div style={{
    ...tileStyle,
  }}>
    💩
  </div>
)

const CharacterTile = (props) => (
  <div style={{
    ...tileStyle,
    background: 'blue',
  }} />
)

const MissileTile = (props) => (
  <div style={{
    ...tileStyle,
    background: 'yellow',
  }} />
)

const EnemyMissileTile = (props) => (
  <div style={{
    ...tileStyle,
    background: 'red',
  }} />
)

const tileFactory = (tileType, props) => {
  switch (tileType) {
  case TileTypes.Nothing:
    return <NothingTile {...props} />;
  case TileTypes.Enemy:
    return <EnemyTile {...props} />;
  case TileTypes.Character:
    return <CharacterTile {...props} />;
  case TileTypes.Missile:
    return <MissileTile {...props} />;
  case TileTypes.EnemyMissile:
    return <EnemyMissileTile {...props} />;
  }
}

const defaultMap = [
  [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
  [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
  [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
]

const defaultState = {
  map: [
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  missiles: times(10, row => times(10, 0)),
  enemyMissiles: times(10, row => times(10, 0)),
  direction: Directions.Right,
  characterIndex: 4,
  currentRound: 0,
  numberOfRounds: 10,
  intervals: [],
}

export default class PoopInvadersChallenge extends Component {
  constructor() {
    super()

    this.state = defaultState
    this.onKeyUp = this.onKeyUp.bind(this)
    this.moveEnemies = this.moveEnemies.bind(this)
    this.moveMissiles = this.moveMissiles.bind(this)
    this.checkForWin = this.checkForWin.bind(this)
    this.spawnNewEnemyMissiles = this.spawnNewEnemyMissiles.bind(this)
    this.moveEnemyMissiles = this.moveEnemyMissiles.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    this.setIntervals()
  }

  setIntervals() {
    this.setState({
      intervals: [
        setInterval(this.moveEnemies, 1000 - this.state.currentRound * 75),
        setInterval(this.moveMissiles, 50),
        setInterval(this.moveEnemyMissiles, 1000 - this.state.currentRound * 75),
        setInterval(this.spawnNewEnemyMissiles, 2000 - this.state.currentRound * 75),
      ]
    })
  }

  cancelIntervals() {
    this.state.intervals.forEach(id => clearInterval(id))
  }

  checkForWin() {
    let areAnyEnemiesRemaining = false
    this.state.map.forEach(row => {
      row.forEach(col => {
        if (col === TileTypes.Enemy) areAnyEnemiesRemaining = true
      })
    })
    if (!areAnyEnemiesRemaining && this.state.currentRound === this.state.numberOfRounds - 1) {
      this.props.pass(
        'I',
        `
        (Left fish statue talking) You have defeated our minions oh great heroine! My
        partner and I have sworn to guard the secrets of the treasure you seek. As a
        reward for your valor we will give you a clue. My partner and I represent the
        position and if you add one more the value as well.
        `
      );
    } else if (!areAnyEnemiesRemaining) {
      this.startNewRound()
    }
  }

  startNewRound() {
    this.cancelIntervals()
    this.setState({
      currentRound: this.state.currentRound + 1,
      map: defaultMap,
      direction: Directions.Right,
    }, () => this.setIntervals())
  }

  onKeyUp(evt) {
    const { code } = evt
    if (code === "ArrowLeft" && this.state.characterIndex > 0) {
      this.setState({ characterIndex: this.state.characterIndex - 1 })
    }
    if (code === "ArrowRight" && this.state.characterIndex < 9) {
      this.setState({ characterIndex: this.state.characterIndex + 1 })
    }
    if (code === "KeyA") {
      const { missiles } = this.state
      missiles[missiles.length - 2][this.state.characterIndex] = 1
      this.setState({ missiles })
    }
  }

  spawnNewEnemyMissiles() {
    const shouldSpawn = random(0, 1)
    if (!shouldSpawn) return
    const enemyPositions = [];
    this.state.map.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col === TileTypes.Enemy) {
          enemyPositions.push([rowIdx, colIdx])
        }
      })
    })
    const numberOfEnemiesToSpawnMissiles = random(0, enemyPositions.length / 4)
    const enemiesToSpawnMissiles = sampleSize(enemyPositions, numberOfEnemiesToSpawnMissiles)
    const { enemyMissiles } = this.state
    enemiesToSpawnMissiles.forEach(coords => {
      const rowIdx = coords[0]
      const colIdx = coords[1]
      if (colIdx < this.state.map.length - 1) {
        enemyMissiles[rowIdx][colIdx + 1] = 1
      }
    })
    this.setState({ enemyMissiles })
  }

  getMapEnemiesShiftedRight() {
    const { map } = this.state
    const newMap = []
    let enemyAtBoundary = false
    map.forEach((row, rowIdx) => {
      if (row.findIndex(type => type === TileTypes.Enemy) !== -1) {
        const newRow = [TileTypes.Nothing, ...row]
        newRow.pop()
        if (newRow[newRow.length - 1] === TileTypes.Enemy) enemyAtBoundary = true
        newMap.push(newRow)
      } else {
        newMap.push(row)
      }
    })
    return [newMap, enemyAtBoundary]
  }

  getMapEnemiesShiftedLeft() {
    const { map } = this.state
    const newMap = []
    let enemyAtBoundary = false
    map.forEach((row, rowIdx) => {
      const newRow = [...row, TileTypes.Nothing]
      newRow.shift()
      if (newRow[0] === TileTypes.Enemy) enemyAtBoundary = true
      newMap.push(newRow)
    }) 
    return [newMap, enemyAtBoundary]
  }

  getMapEnemiesShiftedDown() {
    const { map } = this.state
    const newMap = [
      times(10, () => 0),
      ...map
    ]
    newMap.pop()
    return newMap
  }

  moveEnemies() {
    // if moving right and there's an enemy on the far right, switch to down
    // if moving left and there's an enemy on the far left, switch to down
    // if moving down and there's an enemy on the far right, switch to left
    // if moving down and there's an enemy on the far left, switch to right
    
    let newMap, enemyAtBoundary
    let newDirection = this.state.direction
    const { direction } = this.state
    if (direction === Directions.Right) {
      [newMap, enemyAtBoundary] = this.getMapEnemiesShiftedRight()
      if (enemyAtBoundary) newDirection = Directions.Down
    }
    if (direction === Directions.Left) {
      [newMap, enemyAtBoundary] = this.getMapEnemiesShiftedLeft()
      if (enemyAtBoundary) newDirection = Directions.Down
    }
    if (direction === Directions.Down) {
      newMap = this.getMapEnemiesShiftedDown()
      const enemyOnLeftBoundary = !!newMap.find(row => row[0] === TileTypes.Enemy)
      const enemyOnRightBoundary = !!newMap.find(row => row[row.length - 1] === TileTypes.Enemy)
      if (enemyOnLeftBoundary) { newDirection = Directions.Right }
      if (enemyOnRightBoundary) { newDirection = Directions.Left }
    }

    if (newMap[newMap.length - 1][this.state.characterIndex] === TileTypes.Enemy) {
      this.gameOver()
    } else {
      this.setState({ map: newMap, direction: newDirection })
    }
  }

  moveMissiles() {
    const { missiles, enemyMissiles, map } = this.state
    const newMissiles = times(10, () => times(10, 0))
    missiles.forEach((row, rowIdx) => {
      row.forEach((potentialMissile, potentialMissileIdx) => {
        if (potentialMissile) {
          if (rowIdx > 0 && map[rowIdx - 1][potentialMissileIdx] === TileTypes.Enemy) {
            map[rowIdx - 1][potentialMissileIdx] = TileTypes.Nothing
          }
          else if (rowIdx > 0 && enemyMissiles[rowIdx - 1][potentialMissileIdx]) {
            enemyMissiles[rowIdx - 1][potentialMissileIdx] = 0
          }
          else {
            if (rowIdx > 0) newMissiles[rowIdx - 1][potentialMissileIdx] = 1
            newMissiles[rowIdx][potentialMissileIdx] = 0
          }
        }
      })
    })

    this.setState({ map, missiles: newMissiles, enemyMissiles }, this.checkForWin)
  }

  moveEnemyMissiles() {
    const { enemyMissiles, missiles, map } = this.state
    const newEnemyMissiles = times(10, () => times(10, 0))
    enemyMissiles.forEach((row, rowIdx) => {
      row.forEach((potentialMissile, potentialMissileIdx) => {
        if (potentialMissile) {
          if (rowIdx < this.state.map.length - 1 && missiles[rowIdx + 1][potentialMissileIdx]) {
            missiles[rowIdx + 1][potentialMissileIdx] = 0
          }
          else if (rowIdx === this.state.map.length - 2 && this.state.characterIndex === potentialMissileIdx) {
            this.gameOver()
          }
          else {
            if (rowIdx < this.state.map.length - 1) newEnemyMissiles[rowIdx + 1][potentialMissileIdx] = 1
            newEnemyMissiles[rowIdx][potentialMissileIdx] = 0
          }
        }
      })
    })

    this.setState({ map, missiles, enemyMissiles: newEnemyMissiles }, this.checkForWin)
  }

  gameOver() {
    this.cancelIntervals()
    this.setState(defaultState, () => this.setIntervals())
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
        The poop emojis are invading! Knock 'em out!
        <div style={{
          width: '300px',
          height: '300px',
          background: '#eee',
          margin: '0 auto',
          border: '1px solid #333'
        }}>
          {this.state.map.map((row, rowIdx) => {
            if (rowIdx === this.state.map.length - 1) {
              // character row
              return times(10, characterRowIdx => {
                let tileType = TileTypes.Nothing
                if (characterRowIdx === this.state.characterIndex) {
                  tileType = TileTypes.Character
                }
                return tileFactory(tileType, {
                  key: `${rowIdx}-${characterRowIdx}`,
                })
              })
            }
            return row.map((mapTileType, tileIdx) => {
              let tileType = mapTileType
              if (this.state.enemyMissiles[rowIdx][tileIdx]) {
                tileType = TileTypes.EnemyMissile
              }
              else if (this.state.missiles[rowIdx][tileIdx]) {
                tileType = TileTypes.Missile
              }
              return tileFactory(tileType, {
                key: `${rowIdx}-${tileIdx}`,
              })
            })
          })}
        </div>

        <div>
          <h4 style={{margin: '0px', padding: '0px'}}>Controls:</h4>
          <ul style={{margin: '0px', padding: '0px'}}>
            <li>A: fire</li>
            <li>Left Arrow: move left</li>
            <li>Right Arrow: move right</li>
          </ul>
          <p>
            Round {this.state.currentRound + 1} of {this.state.numberOfRounds}
          </p>
        </div>
      </div>
    );
  }
}
