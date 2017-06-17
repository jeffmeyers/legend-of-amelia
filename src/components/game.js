import React, { Component } from 'react'

const TileTypes = {
  Movable: 1,
  Obstacle: 2,
  Character: 3,
}

const CharacterOrientations = {
  Right: 1,
  Left: 2,
  Down: 3,
  Up: 4,
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
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'green'
  })} />
)

const ObstacleTile = (props) => (
  <div style={Object.assign({}, TILE_STYLE, {
    background: 'grey'
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

export default class Game extends Component {
  constructor() {
    super()

    this.onKeyUp = this.onKeyUp.bind(this)

    this.state = {
      map,
      characterOrientation: CharacterOrientations.Down,
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

    if (map[rowIndex + 1][columnIndex] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex + 1][columnIndex] = TileTypes.Character

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

    if (map[rowIndex - 1][columnIndex] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex - 1][columnIndex] = TileTypes.Character

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

    if (map[rowIndex][columnIndex - 1] === TileTypes.Obstacle) return

    map[rowIndex][columnIndex] = TileTypes.Movable
    map[rowIndex][columnIndex - 1] = TileTypes.Character

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
                  return <CharacterTile key={idx} orientation={this.state.characterOrientation} />
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
