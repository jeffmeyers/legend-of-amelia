import React, { Component } from 'react'

const TileTypes = {
  Movable: 1,
  Obstacle: 2,
  Character: 3,
}

const map = [
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
  [ 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1 ],
]

const TILE_HEIGHT = 25
const TILE_WIDTH = 25
const TILE_STYLE = {
  float: 'left',
  height: TILE_HEIGHT,
  width: TILE_WIDTH,
}

const Row = (props) => <div style={{ clear: 'left' }}>{props.children}</div>;

const MovableTile = (props) => (
  <div style={Object.assign(TILE_STYLE, {
    background: 'green'
  })} />
)

const ObstacleTile = (props) => (
  <div style={Object.assign(TILE_STYLE, {
    background: 'grey'
  })} />
)

const CharacterTile = (props) => (
  <div style={Object.assign(TILE_STYLE, {
    background: 'blue'
  })} />
)

export default class Game extends Component {
  constructor() {
    super()

    this.onKeyUp = this.onKeyUp.bind(this)

    this.state = {
      map,
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
    const { key } = evt
    if (key === "ArrowDown") {
      this.moveCharacterDown()
    }
    if (key === "ArrowUp") {
      this.moveCharacterUp()
    }
    if (key === "ArrowLeft") {
      this.moveCharacterLeft()
    }
    if (key === "ArrowRight") {
      this.moveCharacterRight()
    }
  }

  moveCharacterDown() {
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]
    const { map } = this.state

    if (map[rowIndex + 1][columnIndex] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex + 1][columnIndex] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterUp() {
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]
    const { map } = this.state

    if (map[rowIndex - 1][columnIndex] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex - 1][columnIndex] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterLeft() {
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]
    const { map } = this.state

    if (map[rowIndex][columnIndex - 1] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex][columnIndex - 1] = TileTypes.Character

    this.setState({ map })
  }

  moveCharacterRight() {
    const coords = this.findCharacter()
    const rowIndex = coords[0]
    const columnIndex = coords[1]
    const { map } = this.state

    if (map[rowIndex][columnIndex + 1] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex][columnIndex + 1] = TileTypes.Character

    this.setState({ map })
  }

  findCharacter() {
    let rowIndex, columnIndex;
    map.forEach((row, currentRowIndex) => {
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
      <div>
        {map.map((row, idx) => (
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
                  return <CharacterTile key={idx} />
                }
                default: {
                  return <MovableTile key={idx} />
                }
              }
            })}
          </Row>
        ))}
      </div>
    )
  }
}
