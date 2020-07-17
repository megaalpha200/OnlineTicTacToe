import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializeData, updateData, resetData, cleanUpData } from 'actions/game';
import { currentLocation } from 'util/helpers';
import WebPage from 'components/Helpers/WebPage.jsx';
import 'assets/TicTacToe/css/ticTacToeStyle.css';

const calculateWinner = (squares) => {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let line = 0; line < winningLines.length; line++) {
        const [a, b, c] = winningLines[line];
        var winner = null;

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner = (squares[a] === 'X') ? 1 : 2;
            return { winner: winner, winningLine: winningLines[line] };
        }
    }

    return { winner: null, winningLine: null };
}

const checkIfBoardFull = (squares) => {
    for (let square = 0; square < squares.length; square++) {
        if (squares[square] === null) return false;
    }

    return true;
}

const Square = (props) => {
    return (
        <button className={`game-square ${(props.isDraw) ? 'draw' : ''} ${(props.isHighlighted) ? 'highlighted' : ''}`} onClick={() => props.onSquareClicked(props.assignedPlayer, props.index, props.row, props.col)}>
            {props.value}
        </button>
    );
}

const GameBoard = (props) => {
    const generateSquares = (index) => {
        const row = (Math.floor(index / 3)) + 1;
        const col = (index % 3) + 1;

        return (
            <Square
                key={index}
                assignedPlayer={props.assignedPlayer}
                index={index}
                row={row}
                col={col}
                value={props.squareData[index]}
                isHighlighted={(props.winningLine && props.winningLine.includes(index))}
                isDraw={props.isDraw}
                onSquareClicked={props.onSquareClicked}
            />
        );
    }

    const generateRows = () => {
        const rows = [];

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const colStart = rowIndex * 3;
            const colLimit = (rowIndex + 1) * 3;

            const cols = [];

            for (let colIndex = colStart; colIndex < colLimit; colIndex++) {
                cols.push(generateSquares(colIndex));
            }

            rows.push(
                <div key={rowIndex} className="game-row">
                    {cols}
                </div>
            );
        }

        return rows;
    }

    return (
        <div className="game-board">
            {generateRows()}
        </div>
    );
}

class TicTacToe extends Component {
    componentDidMount = () => {
        const hasQuitGame = this.checkIfGameQuit(this.props);

        if (!hasQuitGame) {
            const pathArr = window.location.pathname.split('/');
            const urlSessionID = pathArr[pathArr.length - 1];
            let session_id = this.props.game.session_id;

            if (urlSessionID !== 'game') {
                session_id = urlSessionID;
            }

            this.props.initializeData(session_id, this.props.game.assignedPlayer);
        }
    };

    componentWillReceiveProps = (props) => {
        this.checkIfGameQuit(props);
    }

    checkIfGameQuit = (props) => {
        let hasQuitGame = false;

        if (props.game.hasQuitGame) {
            hasQuitGame = true;
            props.cleanUpData();
            window.location.href="/";
        }

        return hasQuitGame;
    }

    onSquareClicked = (player, index) => {
        const squares = this.props.game.game_board.slice();
        let isBoardFull = false;

        if (this.props.game.winningPlayer || player !== this.props.game.currPlayerTurn || this.props.game.isDraw || squares[index]) {
            return;
        }

        squares[index] = (this.props.game.currPlayerTurn === 1) ? 'X' : 'O';
        const calculateWinnerData = calculateWinner(squares);
        if (calculateWinnerData.winner === null) isBoardFull = checkIfBoardFull(squares);

        const gameData = {
            ...this.props.game,
            game_board: squares,
            currPlayerTurn: (this.props.game.currPlayerTurn === 1) ? 2 : 1,
            winningLine: calculateWinnerData.winningLine,
            winningPlayer: calculateWinnerData.winner,
            isDraw: isBoardFull,
        };

        this.props.updateData(gameData);
    }

    render() {
        return (
            <WebPage pageTitle="Tic Tac Toe" headerType="Alt">
                <button onClick={() => this.props.updateData({ ...this.props.game, hasQuitGame: true})}>Quit</button>
                <section className="game">
                    <GameBoard
                        assignedPlayer={this.props.game.assignedPlayer}
                        currPlayerTurn={this.props.game.currPlayerTurn}
                        squareData={this.props.game.game_board}
                        winningLine={this.props.game.winningLine}
                        isDraw={this.props.game.isDraw}
                        onSquareClicked={this.onSquareClicked}
                    />
                    {
                        (this.props.game.assignedPlayer === 1)
                        ?
                            <>
                                <br />
                                <h6 style={{ wordWrap: 'break-word' }}><u>Send this link to your friend to start playing:</u><br /><strong>{`${currentLocation}/game/${this.props.game.session_id}`}</strong></h6>
                            </>
                        :
                            ""
                    }
                </section>
                <br />
                {
                    (this.props.game.winningPlayer || this.props.game.isDraw)
                    ?
                        <>
                            <p><u>Winner:</u> <strong>{(this.props.game.isDraw) ? 'It\'s a Draw!' : `Player ${this.props.game.winningPlayer}`}</strong></p>
                            <br />
                            <button onClick={() => this.props.resetData(this.props.game.session_id)}>Reset</button>
                        </>
                    :
                        <></>
                }
                <br />
                <span style={{ wordWrap: 'break-word' }}>{JSON.stringify(this.props.game)}</span>
            </WebPage>
        );
    }
}

const mapStateToProps = ({ game }) => ({
    game
});

const mapDispatchToProps = dispatch => ({
    initializeData: (session_id, hasAssignedPlayer) => dispatch(initializeData(session_id, hasAssignedPlayer)),
    updateData: gameData => dispatch(updateData(gameData)),
    resetData: session_id => dispatch(resetData(session_id)),
    cleanUpData: () => dispatch(cleanUpData())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicTacToe);