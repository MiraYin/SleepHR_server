import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";


// class Square extends React.Component {
//   render() {
//     return (
//       //  Doing onClick={alert('click')} would alert immediately instead of when the button is clicked.
//       // Whenever this.setState is called, an update to the component is scheduled,
//       // causing React to merge in the passed state update and rerender the component along with its descendants.
//       // when the square is clicked, it calls the onClick function that was passed by Board. 
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
// use functional component
function Square(props){
  return (
    <button className="square" onClick={() => props.onClick()}>
    {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    /* custom component Square in JSX syntax */
    // each React component is a real JS object, can be stored and passed around
    // pass a value prop to the Square
    // e split the returned element into multiple lines for readability,
    // and added parentheses around it so that JavaScript doesn’t insert 
    // a semicolon after return and break our code.
    // passing down two props from Board to Square: value and onClick
    return (<Square 
      value={this.props.squares[i]} 
      // once square listener listen a click, square will call this onClick that is passed to it
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    /// call in Board’s render function to check if anyone has won the game 
    // and make the status text show “Winner: [X/O]” when someone wins.

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
// React components can have state by setting this.state in the constructor
  constructor(props) {
    //  need to explicitly call super(); when defining the constructor of a subclass
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // We call .slice() to copy the squares array instead of mutating the existing array.
    // immutability is important: increase component and overall application performance.
    // 1. Easier Undo/Redo and Time Travel
    // 2. Tracking Changes
    // 3. Determining When to Re-render in React: Since immutable data can more easily 
    // determine if changes have been made, it also helps to determine when a component 
    // requires being re-rendered
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
        // ignore the click if someone has already won the game or if a square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares,}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    // Note how whenever Board’s state changes, the Square components rerender automatically.
    // Square no longer keeps its own state; 
    // it receives its value from its parent Board and informs its parent when it’s clicked. 
    // We call components like this controlled components.
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
           />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


