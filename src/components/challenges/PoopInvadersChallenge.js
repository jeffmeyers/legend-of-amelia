import React, { Component } from 'react'
import { times, shuffle, isEqual } from 'lodash'

const TileTypes = {
  Nothing: 0,
  Enemy: 1,
  Character: 2,
  Missile: 3,
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
  }
}

export default class PoopInvadersChallenge extends Component {
  constructor() {
    super()

    this.state = {
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
      direction: Directions.Right,
      characterIndex: 4
    }

    this.onKeyUp = this.onKeyUp.bind(this)
    this.moveEnemies = this.moveEnemies.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    setInterval(this.moveEnemies, 1000)
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
    
    this.setState({ map: newMap, direction: newDirection })
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
              if (this.state.missiles[rowIdx][tileIdx]) {
                tileType = TileTypes.Missile
              }
              return tileFactory(tileType, {
                key: `${rowIdx}-${tileIdx}`,
              })
            })
          })}
        </div>
      </div>
    );
  }
}
