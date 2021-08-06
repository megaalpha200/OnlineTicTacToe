import React, { useState, useEffect, useCallback } from 'react';
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

const Square = ({ row, col, index, value, assignedPlayer, isDraw, isHighlighted, onSquareClicked }) => {
    return (
        <button className={`game-square ${(isDraw) ? 'draw' : ''} ${(isHighlighted) ? 'highlighted' : ''}`} onClick={() => onSquareClicked(assignedPlayer, index, row, col)}>
            {value}
        </button>
    );
}

const GameBoard = ({ squareData, winningLine, isDraw, assignedPlayer, onSquareClicked }) => {
    const generateSquares = (index) => {
        const row = (Math.floor(index / 3)) + 1;
        const col = (index % 3) + 1;

        return (
            <Square
                key={index}
                assignedPlayer={assignedPlayer}
                index={index}
                row={row}
                col={col}
                value={squareData[index]}
                isHighlighted={(winningLine && winningLine.includes(index))}
                isDraw={isDraw}
                onSquareClicked={onSquareClicked}
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

const TicTacToe = ({ game, initializeData, updateData, resetData, cleanUpData }) => {
    const [isSnackbarShowing, setIsSnackbarShowing] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [hasPlayerJoinedFirstTime, setHasPlayerJoinedFirstTime] = useState(false);

    const initializeGame = useCallback(() => {
        const pathArr = window.location.pathname.split('/');
        const urlSessionID = pathArr[pathArr.length - 1];
        let session_id = game._id;

        if (urlSessionID !== 'game') {
            session_id = urlSessionID;
        }

        if (!game.hasQuitGame) initializeData(session_id, game.assignedPlayer);
    }, [game._id, game.assignedPlayer, game.hasQuitGame, initializeData]);

    const updateGameData = useCallback(data => {
        const gameData = {
            ...game,
            ...data
        };

        delete gameData.hasPlayerJoined;

        updateData(gameData);
    }, [updateData, game]);

    const checkIfGameQuit = useCallback((hasQuitGame) => {
        if (hasQuitGame) {
            cleanUpData();
            window.location.href="/";
        }

        return hasQuitGame;
    }, [cleanUpData]);

    const showSnackbar = useCallback((hasPlayerJoined) => {
        if (!game.hasP2Joined && (hasPlayerJoined === game.assignedPlayer)) {
            setSnackbarMsg('Click on \'Share\' to play with a friend!');
            setHasPlayerJoinedFirstTime(game.hasP2Joined);
        }
        else if (hasPlayerJoined === game.assignedPlayer) {
            setSnackbarMsg('You have joined the game!');
            setHasPlayerJoinedFirstTime(game.hasP2Joined);
        }
        else {
            setSnackbarMsg(`Player ${hasPlayerJoined} has joined!`);
            setHasPlayerJoinedFirstTime(hasPlayerJoined);
        }

        setIsSnackbarShowing(true);
        setTimeout(() => {
            setIsSnackbarShowing(false);
            if (!game.hasQuitGame) updateGameData({ hasP2Joined: game.hasP2Joined });
        }, 2000);
    }, [game.assignedPlayer, game.hasP2Joined, game.hasQuitGame, updateGameData]);

    useEffect(() => {
        const hasQuitGame = checkIfGameQuit(game.hasQuitGame);

        if (!hasQuitGame) {
            initializeGame();
        }
    }, [game.hasQuitGame, checkIfGameQuit, initializeGame]);

    useEffect(() => {
        if (game.hasPlayerJoined) {
            showSnackbar(game.hasPlayerJoined);
        }
    }, [game.hasPlayerJoined, showSnackbar]);

    const quitGame = () => {
        const res = window.confirm('Are you sure you want to quit the game?');

        if (res) {
            updateGameData({ hasQuitGame: true });
        }
    }

    const onSquareClicked = (player, index) => {
        const squares = game.game_board.slice();
        let isBoardFull = false;

        if (game.winningPlayer || player !== game.currPlayerTurn || game.isDraw || squares[index]) {
            return;
        }

        squares[index] = (game.currPlayerTurn === 1) ? 'X' : 'O';
        const calculateWinnerData = calculateWinner(squares);
        if (calculateWinnerData.winner === null) isBoardFull = checkIfBoardFull(squares);

        const gameData = {
            game_board: squares,
            currPlayerTurn: (game.currPlayerTurn === 1) ? 2 : 1,
            winningLine: calculateWinnerData.winningLine,
            winningPlayer: calculateWinnerData.winner,
            isDraw: isBoardFull,
        };

        updateGameData(gameData);
    }

    const shareNavAction = {label: 'Share', icon: <Share />, isShare: true, shareUrl: `${currentLocation}/game/${game._id}`, noHighlight: true};
    const resetGameAction = {label: 'Reset', icon: <Refresh />, onClick: () => resetData(game._id), noHighlight: true, isSelected: true};
    const bottomNavData = {
        navActions: [
            {label: 'Chat', icon: <Chat />, onClick: () => alert('This feature is not yet implemented!'), noHighlight: true},
            // {label: 'Reset', icon: <Refresh />, onClick: () => resetData(game._id), noHighlight: true},
            {label: 'Quit', icon: <QuitIcon />, onClick: () => quitGame(), noHighlight: true}
        ]
    };

    if (game.assignedPlayer === 1 && !hasPlayerJoinedFirstTime) bottomNavData.navActions.unshift(shareNavAction);
    if (game.winningPlayer || game.isDraw) bottomNavData.navActions.unshift(resetGameAction);

    return (
        <WebPage pageTitle="Tic Tac Toe" headerType="Alt" showBottomNav bottomNavData={bottomNavData}>
            <section className="game">
                <p>Player {game.currPlayerTurn}'s Turn!</p>
                <br />
                <GameBoard
                    assignedPlayer={game.assignedPlayer}
                    currPlayerTurn={game.currPlayerTurn}
                    squareData={game.game_board}
                    winningLine={game.winningLine}
                    isDraw={game.isDraw}
                    onSquareClicked={onSquareClicked}
                />
            </section>
            <br />
            {
                (game.winningPlayer || game.isDraw)
                ?
                    <>
                        <p><u>Winner:</u> <strong>{(game.isDraw) ? 'It\'s a Draw!' : `Player ${game.winningPlayer}`}</strong></p>
                        <br />
                    </>
                :
                    <></>
            }
            <br />
            <span style={{ wordWrap: 'break-word' }}>{JSON.stringify(game)}</span>

            <ReactSnackbar Icon={<GameIcon />} Show={isSnackbarShowing}>
                {snackbarMsg}
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