import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { initializeData, updateData, resetData, cleanUpData } from 'actions/game';
import { currentLocation } from 'util/helpers';
import { Share, Chat, ExitToApp as QuitIcon, Refresh, SportsEsports as GameIcon } from '@material-ui/icons';
import ReactSnackbar from 'react-js-snackbar';
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

const TicTacToe = props => {
    const [isSnackbarShowing, setIsSnackbarShowing] = useState(false);
    const [hasPlayerJoinedFirstTime, setHasPlayerJoinedFirstTime] = useState(false);

    useEffect(() => {
        const hasQuitGame = checkIfGameQuit(props);

        if (!hasQuitGame) {
            const pathArr = window.location.pathname.split('/');
            const urlSessionID = pathArr[pathArr.length - 1];
            let session_id = props.game._id;

            if (urlSessionID !== 'game') {
                session_id = urlSessionID;
            }

            props.initializeData(session_id, props.game.assignedPlayer);
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setHasPlayerJoinedFirstTime(props.game.hasPlayerJoined);

    // eslint-disable-next-line
    }, [props.game.hasPlayerJoined]);

    useEffect(() => {
        checkIfGameQuit(props);

    // eslint-disable-next-line
    }, [props.game.hasQuitGame]);

    useEffect(() => {
        const showSnackbar = () => {
            if (isSnackbarShowing) return;
    
            setIsSnackbarShowing(true);
            setTimeout(() => {
                setIsSnackbarShowing(false);
            }, 2000);
        }

        // if (props.game.hasPlayerJoined !== undefined && props.game.hasPlayerJoined !== props.game.assignedPlayer) showSnackbar();
        if (props.game.hasPlayerJoined !== undefined) showSnackbar();
        
        // eslint-disable-next-line
    },[props.game.hasPlayerJoined, props.game.assignedPlayer]);

    const checkIfGameQuit = (props) => {
        let hasQuitGame = false;

        if (props.game.hasQuitGame) {
            hasQuitGame = true;
            props.cleanUpData();
            window.location.href="/";
        }

        return hasQuitGame;
    }

    const quitGame = () => {
        const res = window.confirm('Are you sure you want to quit the game?');

        if (res) {
            props.updateData({ ...props.game, hasQuitGame: true});
        }
    }

    const onSquareClicked = (player, index) => {
        const squares = props.game.game_board.slice();
        let isBoardFull = false;

        if (props.game.winningPlayer || player !== props.game.currPlayerTurn || props.game.isDraw || squares[index]) {
            return;
        }

        squares[index] = (props.game.currPlayerTurn === 1) ? 'X' : 'O';
        const calculateWinnerData = calculateWinner(squares);
        if (calculateWinnerData.winner === null) isBoardFull = checkIfBoardFull(squares);

        const gameData = {
            ...props.game,
            game_board: squares,
            currPlayerTurn: (props.game.currPlayerTurn === 1) ? 2 : 1,
            winningLine: calculateWinnerData.winningLine,
            winningPlayer: calculateWinnerData.winner,
            isDraw: isBoardFull,
        };

        delete gameData.hasPlayerJoined;

        props.updateData(gameData);
    }

    const shareNavAction = {label: 'Play With Friend', icon: <Share />, isShare: true, shareUrl: `${currentLocation}/game/${props.game._id}`, noHighlight: true};
    const resetGameAction = {label: 'Reset', icon: <Refresh />, onClick: () => props.resetData(props.game._id), noHighlight: true, isSelected: true};
    const bottomNavData = {
        navActions: [
            {label: 'Chat', icon: <Chat />, onClick: () => alert('This feature is not yet implemented!'), noHighlight: true},
            // {label: 'Reset', icon: <Refresh />, onClick: () => props.resetData(props.game._id), noHighlight: true},
            {label: 'Quit', icon: <QuitIcon />, onClick: () => quitGame(), noHighlight: true}
        ]
    };
    
    if (props.game.assignedPlayer === 1 && !hasPlayerJoinedFirstTime) bottomNavData.navActions.unshift(shareNavAction);
    if (props.game.winningPlayer || props.game.isDraw) bottomNavData.navActions.unshift(resetGameAction);

    return (
        <WebPage pageTitle="Tic Tac Toe" headerType="Alt" showBottomNav bottomNavData={bottomNavData}>
            <section className="game">
                <p>Player {props.game.currPlayerTurn}'s Turn!</p>
                <br />
                <GameBoard
                    assignedPlayer={props.game.assignedPlayer}
                    currPlayerTurn={props.game.currPlayerTurn}
                    squareData={props.game.game_board}
                    winningLine={props.game.winningLine}
                    isDraw={props.game.isDraw}
                    onSquareClicked={onSquareClicked}
                />
            </section>
            <br />
            {
                (props.game.winningPlayer || props.game.isDraw)
                ?
                    <>
                        <p><u>Winner:</u> <strong>{(props.game.isDraw) ? 'It\'s a Draw!' : `Player ${props.game.winningPlayer}`}</strong></p>
                        <br />
                        {/* <button onClick={() => props.resetData(props.game._id)}>Reset</button> */}
                    </>
                :
                    <></>
            }
            <br />
            <span style={{ wordWrap: 'break-word' }}>{JSON.stringify(props.game)}</span>

            <ReactSnackbar Icon={<GameIcon />} Show={isSnackbarShowing}>
                Player {props.game.hasPlayerJoined} has joined!
            </ReactSnackbar>
        </WebPage>
    );
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