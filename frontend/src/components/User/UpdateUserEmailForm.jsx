import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { changeEmail } from 'actions/session';
import { hashEmail, hashPassword } from 'util/helpers';
import { DialogContent, DialogContentText, FormControl, Input, InputLabel, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AccountDetailsDialogAppBar from 'assets/User/js/AccountDetailsDialogAppBar';

const mapStateToProps = ({ errors, session: { userId, email } }) => ({
    userId,
    old_email: email,
    errors
});

const mapDispatchToProps = dispatch => ({
    changeEmail: user => dispatch(changeEmail(user))
});

const UpdateUserEmailForm = ({ showForm, onFormClose, errors, userId, old_email, changeEmail }) => {
    const [newEmail, setNewEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorsState, setErrorState] = useState(errors);

    const handleInputsOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'new_email':
                setNewEmail(e.target.value);
                break;
            case 'confirm_password':
                setConfirmPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleFormClear = () => {
        setNewEmail('');
        setConfirmPassword('');
        setErrorState('');
        setShowPassword(false);
    }

    const handleSubmit = e => {
        e.preventDefault();

        try {
            const emailHash = hashEmail(newEmail);
            const confirmPasswordHash = hashPassword(old_email, confirmPassword);
            const newPasswordHash = hashPassword(newEmail, confirmPassword);

            const user = {
                userId: userId,
                email: newEmail,
                emailHash: emailHash,
                password: confirmPassword,
                oldPasswordHash: confirmPasswordHash,
                newPasswordHash: newPasswordHash
            };

            changeEmail(user);

        }
        catch {
            setErrorState(['Please make sure that your new email is valid!']);
        }
    }

    const togglePasswordShow = () => setShowPassword(!showPassword);

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
                        <AccountDetailsDialogAppBar title="Update Email Address" onClose={onFormClose} onUpdate={() => document.getElementById('submit-btn').click()} innerMenu />
                        <DialogContent>
                            <DialogContentText>
                                Please complete the following to change your email address:
                            </DialogContentText>
                            <DialogContentText>
                                <p style={{ color: 'red' }}>{errorsState}</p>
                            </DialogContentText>
                            <FormControl fullWidth style={{ marginBottom: '0.3rem' }}>
                                <InputLabel htmlFor="new_email">New Email Address</InputLabel>
                                <Input
                                    autoFocus
                                    id="new_email"
                                    name="new_email"
                                    variant="outlined"
                                    type="email"
                                    value={newEmail}
                                    onChange={handleInputsOnChange}
                                    required
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="confirm_password">Confirm Password</InputLabel>
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={(showPassword) ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={handleInputsOnChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordShow}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
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
)(UpdateUserEmailForm);