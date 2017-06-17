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
  render() {
    return (
      <div>
        {map.map((row, idx) => (
          <Row key={idx}>
            {row.map((tileType, idx) => {
              switch (tileType) {
                case TileTypes.Movable: {
                  return <MovableTile />
                }
                case TileTypes.Obstacle: {
                  return <ObstacleTile />
                }
                case TileTypes.Character: {
                  return <CharacterTile />
                }
                default: {
                  return <MovableTile />
                }
              }
            })}
          </Row>
        ))}
      </div>
    )
  }
}
