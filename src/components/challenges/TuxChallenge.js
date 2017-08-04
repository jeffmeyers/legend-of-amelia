import React, { Component } from 'react'
import { SlidingPuzzle } from 'react-puzzle'
import { times } from 'lodash';

const tux = require('../../tux.jpg');

const tileStyle = {
  width: '98px',
  height: '98px',
  borderSizing: 'border-box',
  border: '1px solid black',
  background: `url('${tux}')`,
  float: 'left',
};

const tileStyleForIndex = (idx) => {
  let backgroundPosition;
  switch (idx) {
    case 0:
      backgroundPosition = '0px 0px';
      break;
    case 1:
      backgroundPosition = '300px 0px';
      break;
    case 2:
      backgroundPosition = '100px 0px';
      break;
    case 3:
      backgroundPosition = '0px 450px';
      break;
    case 4:
      backgroundPosition = '300px 450px';
      break;
    case 5:
      backgroundPosition = '100px 450px';
      break;
    case 6:
      backgroundPosition = '0px 900px';
      break;
    case 7:
      backgroundPosition = '300px 900px';
  }
  return Object.assign({}, tileStyle, {
    backgroundPosition,
    backgroundSize: '400px 533px',
  });
};

export default class TuxChallenge extends Component {
  render() {
    return (
      <div style={{
        width: '300px',
        height: '300px',
        background: '#eee'
      }}>
        {times(8, idx => <div key={idx} style={tileStyleForIndex(idx)} />)}
      </div>
    );
  }
}
