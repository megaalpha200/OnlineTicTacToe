import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { changeUsername } from 'actions/session';
import { DialogContent, DialogContentText, FormControl, Input, InputLabel } from '@material-ui/core';
import AccountDetailsDialogAppBar from 'assets/User/js/AccountDetailsDialogAppBar';

const mapStateToProps = ({ errors, session: { userId, username } }) => ({
    userId,
    old_username: username,
    errors
});

const mapDispatchToProps = dispatch => ({
    changeUsername: user => dispatch(changeUsername(user))
});

const UpdateUsernameForm = ({ showForm, onFormClose, errors, userId, old_username, changeUsername }) => {
    const [newUsername, setNewUsername] = useState('');
    const [errorsState, setErrorState] = useState(errors);

    const handleInputsOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'new_username':
                setNewUsername(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleFormClear = () => {
        setNewUsername('');
        setErrorState('');
    }

    const handleSubmit = e => {
        e.preventDefault();

        try {

            const user = {
                userId: userId,
                username: newUsername
            };

            changeUsername(user);

        }
        catch {
            setErrorState(['Please make sure that your new username is valid!']);
        }
    }

    useEffect(() => {
        setErrorState(errors);
    }, [errors]);

    const handleClose = useCallback(() => {
        handleFormClear();
    }, []);

    useEffect(() => {
        if (!showForm) handleClose();
    }, [showForm, handleClose]);

    return (
        <div>
            {
                (showForm)
                ?
                    <form onSubmit={handleSubmit} method="post">
                        <AccountDetailsDialogAppBar title="Update Username" onClose={onFormClose} onUpdate={() => document.getElementById('submit-btn').click()} innerMenu />
                        <DialogContent>
                            <DialogContentText className="user-detail-container">
                                <p className="user-detail">
                                    Current Username: <strong>{old_username}</strong>
                                </p>
                            </DialogContentText>
                            <DialogContentText>
                                Please complete the following to change your username:
                            </DialogContentText>
                            <DialogContentText>
                                <p style={{ color: 'red' }}>{errorsState}</p>
                            </DialogContentText>
                            <FormControl fullWidth style={{ marginBottom: '0.3rem' }}>
                                <InputLabel htmlFor="new_username">New Username</InputLabel>
                                <Input
                                    autoFocus
                                    id="new_username"
                                    name="new_username"
                                    variant="outlined"
                                    type="text"
                                    value={newUsername}
                                    onChange={handleInputsOnChange}
                                    required
                                />
                            </FormControl>
                        </DialogContent>
                        <button id="submit-btn" type="submit" hidden></button>
                    </form>
                :
                    ""
            }
        </div>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateUsernameForm);