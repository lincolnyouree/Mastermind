import React, { Component } from 'react';
import './App.css';
import GamePage from '../../pages/GamePage/GamePage';
import { Route, Switch } from 'react-router-dom';
import SettingsPage from '../SettingsPage/SettingsPage';

const colors = {
  Easy: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD'],
  Moderate: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968'],
  Difficult: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968', '#555E7B']
};

class App extends Component {
  constructor() {
    super();
    this.state = {...this.getInitialState(), difficulty: 'Easy'};
  }

  getInitialState() {
    return {
      selColorIdx: 0,
      guesses: [this.getNewGuess()],
      code: this.genCode(),
      elapsedTime: 0,
      isTiming: true
    };
  }

  getNewGuess() {
    return {
      code: [null, null, null, null],
      score: {
        perfect: 0,
        almost: 0
      }
    };
  }

  genCode() {
    let numColors = this.state && colors[this.state.difficulty].length;
    numColors = numColors || 4;
    return new Array(4).fill().map(dummy => Math.floor(Math.random() * numColors));
  }

  getWinTries() {
    let lastGuess = this.state.guesses.length - 1;
    return this.state.guesses[lastGuess].score.perfect === 4 ? lastGuess + 1 : 0;
  }

  handleTimerUpdate = () => {
    this.setState((curState) => ({elapsedTime: ++curState.elapsedTime}));
  }

  handleDifficultyChange = (level) => {
    this.setState({difficulty: level}, () => this.handleNewGameClick());
  }
  
  handleColorSelection = (colorIdx) => {
    this.setState({selColorIdx: colorIdx});
  }

  handleNewGameClick = () => {
    this.setState(this.getInitialState());
  }

  handlePegClick = (pegIdx) => {
    let currentGuessIdx = this.state.guesses.length - 1;

    let guessesCopy = [...this.state.guesses];
    let guessCopy = {...guessesCopy[currentGuessIdx]};
    let codeCopy = [...guessCopy.code];

    codeCopy[pegIdx] = this.state.selColorIdx;
    guessCopy.code = codeCopy;
    guessesCopy[currentGuessIdx] = guessCopy;

    this.setState({
        guesses: guessesCopy
    });
  }

  handleScoreClick = () => {
    let currentGuessIdx = this.state.guesses.length - 1;
    let guessCodeCopy = [...this.state.guesses[currentGuessIdx].code];
    let secretCodeCopy = [...this.state.code];

    let perfect = 0, almost = 0;

    guessCodeCopy.forEach((code, idx) => {
      if (secretCodeCopy[idx] === code) {
        perfect++;
        guessCodeCopy[idx] = secretCodeCopy[idx] = null;
      }
    });

    guessCodeCopy.forEach((code, idx) => {
      if (code === null) return;
      let foundIdx = secretCodeCopy.indexOf(code);
      if (foundIdx > -1) {
        almost++;
        secretCodeCopy[foundIdx] = null;
      }
    });

    let guessesCopy = [...this.state.guesses];
    let guessCopy = {...guessesCopy[currentGuessIdx]};
    let scoreCopy = {...guessCopy.score};

    scoreCopy.perfect = perfect;
    scoreCopy.almost = almost;
    guessCopy.score = scoreCopy;
    guessesCopy[currentGuessIdx] = guessCopy;

    if (perfect !== 4) guessesCopy.push(this.getNewGuess());

    this.setState({
      guesses: guessesCopy,
      isTiming: perfect !== 4
    });
  }

  render() {
    let winTries = this.getWinTries();
    return (
      <div>
        <header className='header-footer'>&nbsp;&nbsp;&nbsp;  M A S T E R M I N D</header>
        <Switch>
          <Route exact path='/' render={() =>
            <GamePage
              winTries={winTries}
              colors={colors[this.state.difficulty]}
              selColorIdx={this.state.selColorIdx}
              guesses={this.state.guesses}
              elapsedTime={this.state.elapsedTime}
              isTiming={this.state.isTiming}
              handleColorSelection={this.handleColorSelection}
              handleNewGameClick={this.handleNewGameClick}
              handlePegClick={this.handlePegClick}
              handleScoreClick={this.handleScoreClick}
              handleTimerUpdate={this.handleTimerUpdate}
            />
          } />
          <Route exact path='/settings' render={props => 
            <SettingsPage
              {...props} 
              colorsLookup={colors}
              difficulty={this.state.difficulty}
              handleDifficultyChange={this.handleDifficultyChange}
            />
          } />
        </Switch>
      </div>
    );
  }
}

export default App;
