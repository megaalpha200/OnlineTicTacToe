import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import history from "util/history";
import { initializeData, updateData, resetData, cleanUpData, sendChatMessage, clearMessageReceivedFlag } from 'actions/game';
import { currentLocation } from 'util/helpers';
import { Collapse, Badge } from "@material-ui/core";
import { Share, Chat, ExitToApp as QuitIcon, Refresh, SportsEsports as GameIcon, SupervisorAccount as ConsoleIcon } from '@material-ui/icons';
import ReactSnackbar from 'react-js-snackbar';
import WebPage from 'components/Helpers/WebPage.jsx';
import 'assets/TicTacToe/css/ticTacToeStyle.css';

const chatAnnouncementMP3 = '/AnnouncementRingtone.mp3';

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

const TicTacToe = ({ game, initializeData, updateData, resetData, cleanUpData, sendChatMessage, clearMessageReceivedFlag, isAdmin }) => {
    const [isSnackbarShowing, setIsSnackbarShowing] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [hasPlayerJoinedFirstTime, setHasPlayerJoinedFirstTime] = useState(false);

    const [displayChat, setDisplayChat] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [isChatNotificationVisible, setIsChatNotificationVisible] = useState(false);
    const [chatNotificationCount, setChatNotificationCount] = useState(0);

    let chatEndRef = useRef();

    const initializeGame = () => {
        const pathArr = window.location.pathname.split('/');
        const urlSessionID = pathArr[pathArr.length - 1];
        let session_id = game._id;

        if (urlSessionID !== 'game') {
            session_id = urlSessionID;
        }

        if (!game.hasQuitGame) initializeData(session_id, game.assignedPlayer);
    };

    const updateGameData = data => {
        const gameData = {
            ...game,
            ...data
        };

        delete gameData.hasPlayerJoined;
        delete gameData.chatMessages;

        updateData(gameData);
    };

    const checkIfGameQuit = useCallback((hasQuitGame) => {
        if (hasQuitGame) {
            cleanUpData();
            window.location.href="/";
        }

        return hasQuitGame;
    }, [cleanUpData]);

    const showSnackbar = (hasPlayerJoined) => {
      if (game.assignedPlayer !== undefined) {
        if (!game.hasP2Joined) {
            setSnackbarMsg('Click on \'Share\' to play with a friend!');
            setHasPlayerJoinedFirstTime(game.hasP2Joined);
        }
        else if (hasPlayerJoined) {
          if (hasPlayerJoined === game.assignedPlayer) {
              setSnackbarMsg('You have joined the game!');
              setHasPlayerJoinedFirstTime(game.hasP2Joined);
          }
          else {
              setSnackbarMsg(`Player ${hasPlayerJoined} has joined!`);
              setHasPlayerJoinedFirstTime(hasPlayerJoined);
          }

          if (!game.hasQuitGame) updateGameData({ hasP2Joined: game.hasP2Joined });
        }

        setIsSnackbarShowing(true);
        setTimeout(() => {
            setIsSnackbarShowing(false);
        }, 2000);
      }
    };

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

    const quitGame = () => {
        const res = window.confirm('Are you sure you want to quit the game?');

        if (res) {
            updateGameData({ hasQuitGame: true });
        }
    }

    const handleSubmitChatMessage = async (e) => {
        e.preventDefault();

        const msgData = {
            session_id: game._id,
            assignedPlayer: game.assignedPlayer,
            message: chatMessage
        }

        await sendChatMessage(msgData);
        setChatMessage("");
    }

    const showChatNotification = () => {
        setIsChatNotificationVisible(true);
        setChatNotificationCount(chatNotificationCount + 1);
    }

    const resetChatNotification = () => {
        setIsChatNotificationVisible(false);
        setChatNotificationCount(0);
    }

    const handleChatToggleButtonClick = () => {
        if (!displayChat) resetChatNotification();
        setDisplayChat(!displayChat);
    }

    const renderChatMessages = messages => {
        let renderedChatMessage = [];

        if (messages) {
            renderedChatMessage = messages.map(message => (
                <p><strong>{`Player ${(message.assignedPlayer === 1) ? 'X' : 'O'}`}</strong>: {message.body}</p>
            ));
        }

        return (
            <div style={{ height: '1rem' }}>
                {renderedChatMessage}
                <div ref={(el) => { chatEndRef = el; }} />
                {/*<div style={{ float:"left", clear: "both" }}*/}
                {/*     ref={(el) => { this.messagesEnd = el; }}>*/}
                {/*</div>*/}
            </div>
        );
    }

    const scrollChatToBottom = (smooth = true) => {
        const scrollData = { behavior: 'smooth' };
        if (!smooth) delete scrollData.behavior;

        chatEndRef.scrollIntoView(scrollData);
    }

    useEffect(() => {
        initializeGame();
        scrollChatToBottom(false);

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
      checkIfGameQuit(game.hasQuitGame);
    }, [game.hasQuitGame, checkIfGameQuit]);

    useEffect(() => {
      showSnackbar(game.hasPlayerJoined);

        // eslint-disable-next-line
    }, [game.hasPlayerJoined, game.assignedPlayer]);

    useEffect(() => {
        if (game.assignedPlayer !== undefined && game.chatMessages !== undefined) {
            const chatSound = new Audio(chatAnnouncementMP3);
            const onPlay = () => chatSound.play();

            const isMsgForPlayer = (game.chatMessages.length > 0) ? game.chatMessages[game.chatMessages.length-1].assignedPlayer !== game.assignedPlayer : true;

            if (game.hasReceivedMessage && isMsgForPlayer) {
                showChatNotification();
                chatSound.addEventListener('canplaythrough', onPlay);
            }

            return () => {
                if (chatSound && !game.hasReceivedMessage) {
                    chatSound.pause();
                    chatSound.removeEventListener('canplaythrough', onPlay);
                }

                clearMessageReceivedFlag();
            };
        }

        // eslint-disable-next-line
    }, [game.hasReceivedMessage, displayChat, clearMessageReceivedFlag]);


    useEffect(() => {
        scrollChatToBottom();
    });

    const shareNavAction = {label: 'Share', icon: <Share />, isShare: true, shareUrl: `${currentLocation}/game/${game._id}`, noHighlight: true};
    const resetGameAction = {label: 'Reset', icon: <Refresh />, onClick: () => resetData(game._id, game.hasP2Joined), noHighlight: true, isSelected: true};
    const adminDashboardAction = {label: 'Dashboard', icon: <ConsoleIcon />, onClick: () => history.push('/dashboard'), noHighlight: true};
    const bottomNavData = {
        navActions: [
            {label: 'Chat', icon: <Badge color="secondary" badgeContent={chatNotificationCount} invisible={!isChatNotificationVisible}><Chat /></Badge>, onClick: () => handleChatToggleButtonClick() },
            // {label: 'Reset', icon: <Refresh />, onClick: () => resetData(game._id, game.hasP2Joined), noHighlight: true},
            {label: 'Quit', icon: <QuitIcon />, onClick: () => quitGame(), noHighlight: true}
        ]
    };

    if (game.assignedPlayer === 1 && !hasPlayerJoinedFirstTime) bottomNavData.navActions.unshift(shareNavAction);
    if (game.winningPlayer || game.isDraw) bottomNavData.navActions.unshift(resetGameAction);
    if (isAdmin) bottomNavData.navActions.unshift(adminDashboardAction);

    const playerTurnMessage = `You are ${(game.assignedPlayer === 1) ? 'X' : 'O'}! It is ${(game.currPlayerTurn === game.assignedPlayer) ? 'your' : (game.currPlayerTurn === 1) ? 'X\'s' : 'O\'s'} turn!`;
    const winnerMessage =  (game.winningPlayer === 1) ? 'X Wins!' : 'O Wins!';
    const gameOverMessage = `${(game.isDraw) ? "Game Over! It's a draw!" : (game.winningPlayer === game.assignedPlayer) ? 'Congratulations! You Win!' : `gg! ${winnerMessage}`}`;

    return (
        <WebPage pageTitle="Tic Tac Toe" pageHeading={(game.winningPlayer || game.isDraw) ? gameOverMessage : playerTurnMessage} showBottomNav bottomNavData={bottomNavData}>
            <section className="game" style={{ backgroundColor: '#FFFFFF' }}>
                <GameBoard
                    assignedPlayer={game.assignedPlayer}
                    currPlayerTurn={game.currPlayerTurn}
                    squareData={game.game_board}
                    winningLine={game.winningLine}
                    isDraw={game.isDraw}
                    onSquareClicked={onSquareClicked}
                />
            </section>
            <Collapse id="chat-collapse" in={displayChat} timeout="auto">
                <div id="chat-container">
                    <section id="chat">
                        {renderChatMessages(game.chatMessages)}
                    </section>
                    <form id="chat-message-field-container" onSubmit={handleSubmitChatMessage} method="post">
                        <input id="chat-message-field-input" name="chat-message-field" onChange={(e) => setChatMessage(e.target.value)} onClick={() => resetChatNotification()} value={chatMessage} autoComplete="off" />
                        <button type="submit" id="chat-message-field-btn">Submit</button>
                    </form>
                </div>
            </Collapse>
            <span>Chat Sound Credits: <a href="https://twitch.tv/Kitboga" target="new_tab">Kitboga</a></span>
            {/*<span style={{ wordWrap: 'break-word', overflow: 'auto', flex: '5%' }}>{JSON.stringify(game)}</span>*/}

            <ReactSnackbar Icon={<GameIcon />} Show={isSnackbarShowing}>
                {snackbarMsg}
            </ReactSnackbar>
        </WebPage>
    );
}

const mapStateToProps = ({ game, session: { userId, isAdmin } }) => ({
    game,
    isAdmin: Boolean(userId) && Boolean(isAdmin)
});

const mapDispatchToProps = dispatch => ({
    initializeData: (session_id, hasAssignedPlayer) => dispatch(initializeData(session_id, hasAssignedPlayer)),
    updateData: gameData => dispatch(updateData(gameData)),
    resetData: (session_id, hasP2Joined) => dispatch(resetData(session_id, hasP2Joined)),
    cleanUpData: () => dispatch(cleanUpData()),
    sendChatMessage: (msgData) => dispatch(sendChatMessage(msgData)),
    clearMessageReceivedFlag: () => dispatch(clearMessageReceivedFlag()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicTacToe);