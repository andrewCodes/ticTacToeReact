import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const init = function () { // we call this function immediately on page load to set up the game and can call it anytime to start a new game

    // The Square component renders a single <button>

    function Square(props) {
        return (
            <button
                className="square"
                onClick={props.onClick}
            >
                {props.value}
            </button>
        );
    }

    // the Board renders 9 squares

    class Board extends React.Component {

        renderSquare(i) {
            return ( // wrap in parentheses so that JavaScript doesn’t insert a semicolon after return and break our code.
                <Square
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                />
            );
        }

        render() {

            return (
                <div className="game-board">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                </div>
            );
        }
    }

    //   The Game component renders a board

    class Game extends React.Component {
        constructor(props) {
            super(props); // need to always call super when defining the constructor of a subclass. All React component classes that have a constructor should start with a super(props) call.
            this.state = {  // "state" allows components to remember things (e.g. whether a button has been clicked already)
                history: [{
                    squares: Array(9).fill(null)
                }],
                stepNumber: 0,
                xIsNext: true,
            };
        }

        handleClick(i) {
            const history = this.state.history.slice(0, this.state.stepNumber + 1); // ensures that if we go back to a previous move and then make a new move from that point, we throw away all the “future” history
            const current = history[history.length - 1];
            const squares = current.squares.slice(); // using "slice" creates a new copy of "squares" array after every move. This means we can more easily add a feature that allows us to move back and forth between the current and previous moves
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext, // this will be true if the number that we’re changing stepNumber to is even
            });
        }

        jumpTo(step) {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
            });
        }

        render() {
            const history = this.state.history;
            const current = history[this.state.stepNumber]; // renders the currently selected move according to stepNumber i.e. will show the most recent move or a previous move if we select a previous move
            const winner = calculateWinner(current.squares);

            const moves = history.map((step, move) => {
                // const restartIcon = 
                const desc = move ?
                    move :
                    '';
                return (
                    <li className="game-moves__list-item" key={move}>
                        <button className="game-moves__btn" onClick={() => this.jumpTo(move)}>{desc}<i className="fas fa-sync"></i></button>
                    </li>
                );
            });

            let status;

            if (winner) {
                status = (this.state.xIsNext ? 'Player 2' : 'Player 1') + ' wins!';
            } else if (history.length === 10) {
                status = `It's a draw`
            } else {
                status = 'Your move, ' + (this.state.xIsNext ? 'player 1' : 'player 2');
            }

            return (
                <div className="game">
                    <div className="game-info">
                        <div>{status}</div>
                    </div>
                    <div className="game-board-holder">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-moves">
                        <ol className="game-moves__list">{moves}</ol>
                    </div>

                    <button className="new-game-btn" onClick={init}>New game</button>
                </div>
            );
        }
    }

    // ========================================

    ReactDOM.render(
        <Game />,
        document.getElementById('root')
    );

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

};

init();