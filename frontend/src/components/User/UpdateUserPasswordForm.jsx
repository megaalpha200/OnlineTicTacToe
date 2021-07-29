import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { changePassword } from 'actions/session';
import { hashEmail, hashPassword } from 'util/helpers';
import { DialogContent, DialogContentText, FormControl, Input, InputLabel, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AccountDetailsDialogAppBar from 'assets/User/js/AccountDetailsDialogAppBar';

const mapStateToProps = ({ errors, session: { userId, email } }) => ({
    userId,
    email,
    errors
});

const mapDispatchToProps = dispatch => ({
    changePassword: user => dispatch(changePassword(user))
});

const UpdateUserPasswordForm = ({ showForm, onFormClose, errors, userId, email, changePassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorsState, setErrorState] = useState(errors);

    const handleInputsOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'old_password':
                setOldPassword(e.target.value);
                break;
            case 'new_password':
                setNewPassword(e.target.value);
                break;
            case 'confirm_new_password':
                setConfirmNewPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleFormClear = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setErrorState('');
        setShowPassword(false);
    }

    const handleSubmit = e => {
        e.preventDefault();

        try {
            if (newPassword !== confirmNewPassword) {
                throw Error("");
            }

            const emailHash = hashEmail(email);
            const oldPassHash = hashPassword(email, oldPassword);
            const newPassHash = hashPassword(email, newPassword);



            const user = {
                userId: userId,
                emailHash: emailHash,
                oldPassword: oldPassword,
                oldPasswordHash: oldPassHash,
                newPassword: newPassword,
                newPasswordHash: newPassHash
            };

            changePassword(user);

        }
        catch {
            setErrorState(['Please make sure that your new passwords match!']);
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
                        <AccountDetailsDialogAppBar title="Update Password" onClose={onFormClose} onUpdate={() => document.getElementById('submit-btn').click()} innerMenu />
                        <DialogContent>
                            <DialogContentText>
                                Please complete the following to change your password:
                            </DialogContentText>
                            <DialogContentText>
                                <p style={{ color: 'red' }}>{errorsState}</p>
                            </DialogContentText>
                            <FormControl fullWidth style={{ marginBottom: '0.3rem' }}>
                                <InputLabel htmlFor="old_password">Old Password</InputLabel>
                                <Input
                                    autoFocus
                                    id="old_password"
                                    name="old_password"
                                    variant="outlined"
                                    type={(showPassword) ? "text" : "password"}
                                    value={oldPassword}
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
                            <FormControl fullWidth style={{ marginBottom: '0.3rem' }}>
                                <InputLabel htmlFor="new_password">New Password</InputLabel>
                                <Input
                                    
                                    id="new_password"
                                    name="new_password"
                                    type={(showPassword) ? "text" : "password"}
                                    value={newPassword}
                                    onChange={handleInputsOnChange}
                                    tabIndex={1}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordShow}
                                                edge="end"
                                            >
                                                {(showPassword) ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    required
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="confirm_new_password">Confirm New Password</InputLabel>
                                <Input
                                    id="confirm_new_password"
                                    name="confirm_new_password"
                                    type={(showPassword) ? "text" : "password"}
                                    value={confirmNewPassword}
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
)(UpdateUserPasswordForm);