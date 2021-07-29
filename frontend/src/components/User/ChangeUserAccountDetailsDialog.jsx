import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { resetWasUserDetailUpdatedFlag } from 'actions/session';
import { clearErrors } from 'actions/error';
import { Dialog, DialogContent, Button, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import AccountDetailsDialogAppBar from 'assets/User/js/AccountDetailsDialogAppBar';
import UpdateUserEmailForm from 'components/User/UpdateUserEmailForm.jsx';
import UpdateUserPasswordForm from 'components/User/UpdateUserPasswordForm.jsx';
import UpdateUsernameForm from 'components/User/UpdateUsernameForm.jsx';
import 'assets/User/css/changeUserAccountDetailsDialogStyle.css';

const mapStateToProps = ({ session: { email, username, wasUserDetailUpdated } }) => ({
    email,
    username,
    wasUserDetailUpdated
});

const mapDispatchToProps = dispatch => ({
    resetWasUserDetailUpdatedFlag: () => dispatch(resetWasUserDetailUpdatedFlag()),
    clearErrors: () => dispatch(clearErrors())
});

const ChangeUserAccountDetailsDialog = ({isOpen, onClose, email, username, wasUserDetailUpdated, resetWasUserDetailUpdatedFlag, clearErrors}) => {
    const [showMainContent, setShowMainContent] = useState(true);
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const showForm = setShowForm => {
        setShowForm(true);
        setShowMainContent(false);
    }

    const hideForms = useCallback(() => {
        setShowUsernameForm(false);
        setShowEmailForm(false);
        setShowPasswordForm(false);
        setShowMainContent(true);
        clearErrors();
    }, [clearErrors]);

    const handleClose = useCallback(() => {
        hideForms();
    }, [hideForms]);

    useEffect(() => {
        if (!isOpen) handleClose();
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (wasUserDetailUpdated) {
            hideForms();
            resetWasUserDetailUpdatedFlag();
        }
    }, [wasUserDetailUpdated, resetWasUserDetailUpdatedFlag, hideForms]);

    return (
        <Dialog fullScreen open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title" style={{ zIndex: '9999' }}>
            {
                (showMainContent)
                ?
                    <div>
                        <AccountDetailsDialogAppBar title="Account Details" onClose={onClose} />
                        <DialogContent>
                            <List>
                                <ListItem button className="user-detail-container" onClick={() => showForm(setShowUsernameForm)}>
                                    <ListItemText primary="Username" secondary={<strong>{username}</strong>} />
                                    <Button onClick={() => showForm(setShowUsernameForm)}>Update</Button>
                                </ListItem>
                                <Divider />
                                <ListItem button className="user-detail-container" onClick={() => showForm(setShowEmailForm)}>
                                    <ListItemText primary="Email" secondary={<strong>{email}</strong>} />
                                    <Button onClick={() => showForm(setShowEmailForm)}>Update</Button>
                                </ListItem>
                                <Divider />
                                <ListItem button className="user-detail-container" onClick={() => showForm(setShowPasswordForm)}>
                                    <ListItemText primary="Password" secondary={<strong>{[...new Array(15)].map(() => `\u25CF`)}</strong>} />
                                    <Button onClick={() => showForm(setShowPasswordForm)}>Update</Button>
                                </ListItem>
                                <Divider />
                            </List>
                        </DialogContent>
                    </div>
                :
                    ""
            }
            <UpdateUsernameForm showForm={showUsernameForm} onFormClose={hideForms} />
            <UpdateUserEmailForm showForm={showEmailForm} onFormClose={hideForms} />
            <UpdateUserPasswordForm showForm={showPasswordForm} onFormClose={hideForms} />
        </Dialog>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangeUserAccountDetailsDialog);