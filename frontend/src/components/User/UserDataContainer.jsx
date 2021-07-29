import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input } from 'reactstrap';
import { Card, CardContent } from '@material-ui/core';
import { callAPIAsync } from 'util/helpers';
import InnerLoadingPage from 'components/Helpers/InnerLoadingPage.jsx';
import * as sessionsAPI from 'util/api/sessions';

const BASIC_USER = 'basic';
const PSEUDO_ADMIN_USER = 'pseudo_admin';
const TRUE_ADMIN_USER = 'true_admin';

const determineUserType = (userType) => {
    switch (userType) {
        case BASIC_USER:
            return 'Basic User';
        case PSEUDO_ADMIN_USER:
            return 'Pseudo Admin';
        case TRUE_ADMIN_USER:
            return 'True Admin';
        default:
            return 'Basic User';
    }
}

const UserDataContainer = props => {
    const [userData, setUserData] = useState(null);
    const [selectedUserTypeVal, setSelectedUserTypeVal] = useState(BASIC_USER);
    const [canEditUserData, setCanEditUserData] = useState(false);
    const [canSaveUserData, setCanSaveUserData] = useState(false);
    const [canDeleteUserData, setCanDeleteUserData] = useState(false);

    useEffect(() => {
        const retUserData = async userID => {
            const responseJSON = await callAPIAsync(sessionsAPI.getUserData(userID), 'Unable to retrieve user data!');

            const retUserData = responseJSON.result
            setUserData(retUserData);
            setSelectedUserTypeVal(retUserData.user_type);
        }

        if (props.userId || (props.userId && !canSaveUserData)) {
            setUserData(null);
            retUserData(props.userId);
        }
    }, [props.userId, canSaveUserData]);

    useEffect(() => {
        const structureNewData = (userData, selectedUserTypeVal) => {
            const newData = { ...userData };

            delete newData._id;
            newData.user_type = selectedUserTypeVal;

            return newData;
        }

        const saveUserData = async userID => {
            const res = window.confirm('Are you sure you want to modify this user?');
    
            if (res) {
                const responseJSON = await callAPIAsync(sessionsAPI.modifyUserData(userID, structureNewData(userData, selectedUserTypeVal)), 'Unable to modify user data!');
            
                if (responseJSON.status === 200) {    
                    alert('User Modified!');
                    setCanEditUserData(false);
                    setCanSaveUserData(false);
                }
            }
            else setCanSaveUserData(false);
        }

        if (canSaveUserData) saveUserData(userData._id, selectedUserTypeVal);

        // eslint-disable-next-line
    }, [canSaveUserData]);

    useEffect(() => {
        const deleteUser = async userID => {
            const res = window.confirm('Are you sure you want to delete this user?');
    
            if (res) {
                const responseJSON = await callAPIAsync(sessionsAPI.deleteUserData(userID), 'Unable to delete user data!');
            
                if (responseJSON.status === 200) {    
                    alert('User Deleted!');
                    window.location.reload();
                }
            }
            else setCanDeleteUserData(false);
        }

        if (canDeleteUserData) deleteUser(userData._id);

        // eslint-disable-next-line
    }, [canDeleteUserData]);

    const displayUserType = (user_type, canEdit) => {
        const userType = determineUserType(user_type);

        if (canEdit) {
            return (
                <FormGroup style={{ width: '40%', margin: '0 auto' }}>
                    <p><b>USER TYPE:</b>{titleUnderline}</p>
                    <Input type="select" name="user-type" value={selectedUserTypeVal} onChange={(e) => setSelectedUserTypeVal(e.target.value)}>
                        <option value={BASIC_USER}>Basic User</option>
                        <option value={PSEUDO_ADMIN_USER}>Pseudo Admin</option>
                        <option value={TRUE_ADMIN_USER}>True Admin</option>
                    </Input>
                </FormGroup>
            )
        }
        else {
            return <p><b>USER TYPE</b>{titleUnderline}{userType}</p>
        }
    }

    const titleUnderline = (<div class="d-flex justify-content-center"><p style={{border: '4px solid black', width: '30%'}}></p><br /></div>);

    const renderModButtons = canEdit => {
        if (canEdit) {
            return (
                <div>
                    <Button color="success" onClick={() => setCanSaveUserData(true)}>Save</Button>&nbsp;
                    <Button color="light" onClick={() => { setCanEditUserData(false); setSelectedUserTypeVal(userData.user_type); }}>Cancel</Button>
                </div>
            )
        }
        else {
            return (
                <div>
                    {
                        (props.currentUsername !== userData.username)
                        ?
                            [
                                <Button color="primary" onClick={() => setCanEditUserData(true)}>Edit</Button>,
                                <span>&nbsp;</span>,
                                <Button color="danger" onClick={() => setCanDeleteUserData(true)}>Delete?</Button>
                            ]
                        :
                            <p style={{ color: 'red', fontWeight: 'bolder', fontSize: 'larger' }}>This is you!</p>
                    }
                </div>
            );
        }
    }

    const renderContainer = canEdit => {
        if (!props.userId) return '';

        return (
            (userData)
            ?
                <Card variant="elevation" style={{ maxHeight: '500px', backgroundColor: '#C4C4C4', color: 'black', textAlign: 'center', overflowY: 'auto' }}>
                    <CardContent>
                        <Button style={{ backgroundColor: 'red' }} onClick={() => props.clearSelectedUser()}>&times;</Button><br /><br />
                        <p><b>USER ID</b>{titleUnderline}{userData._id}</p>
                        <p><b>USERNAME</b>{titleUnderline}{userData.username}</p>
                        {displayUserType(userData.user_type, canEdit)}
                    </CardContent>
                    <br />
                    {renderModButtons(canEdit)}
                </Card>
            :
                <InnerLoadingPage />
        );
    }

    return renderContainer(canEditUserData);
}

export default UserDataContainer;