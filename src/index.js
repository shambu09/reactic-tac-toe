import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => {
					this.props.handleClick(i);
				}}
			/>
		);
	}

	render() {
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
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					player: "X",
					moves: 0,
					win: false,
					draw: false,
				},
			],
			step: 0,
		};
		this.handleClick = this.handleClick.bind(this);
		this.jumpState = this.jumpState.bind(this);
	}

	handleClick(i) {
		if (
			this.state.history[this.state.step].win ||
			this.state.history[this.state.step].draw ||
			this.state.history[this.state.step].squares[i]
		)
			return;

		let history = this.state.history.slice(0, this.state.step + 1);
		history = history.concat(this.update(i));
		this.setState({
			history: history,
			step: history.length - 1,
		});
	}

	jumpState(move) {
		this.setState({ step: move });
	}

	update(i) {
		let squares = this.state.history[this.state.step].squares.slice();
		let player = this.state.history[this.state.step].player;
		let moves = this.state.history[this.state.step].moves;
		let win = false;
		let draw = false;

		if (squares[i] == null) {
			squares[i] = player;
			moves += 1;
		} else return this.state.history[this.state.step];

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
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				win = true;
			}
		}

		if (!win) {
			player = player === "X" ? "O" : "X";
			draw = moves === 9 ? true : false;
		}

		return {
			squares,
			player,
			moves,
			win,
			draw,
		};
	}

	render() {
		let status = `Next player: ${
			this.state.history[this.state.step].player
		}`;

		if (this.state.history[this.state.step].draw) {
			status = "Match Drawn ~_~";
		}

		if (this.state.history[this.state.step].win) {
			status = `Player ${
				this.state.history[this.state.step].player
			} Won!`;
		}
		const moves = this.state.history.map((_, move) => {
			const step = move ? "Go to move #" + move : "Go to Game start";
			return (
				<li key={move}>
					<button
						onClick={() => {
							this.jumpState(move);
						}}
					>
						{step}
					</button>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.state.history[this.state.step].squares}
						handleClick={this.handleClick}
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
