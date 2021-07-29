import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { callAPIAsync } from 'util/helpers';
// import * as contactFormAPI from 'util/api/contact_form';
import * as sessionsAPI from 'util/api/sessions';
import { clearUserSessions } from 'actions/session';
import { Button, Spinner, InputGroup, Input, InputGroupAddon, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import { Card, CardContent } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import ConsoleSectionCollapse from 'components/User/ConsoleSectionCollapse.jsx';
import UserDataContainer from 'components/User/UserDataContainer.jsx';
// import InnerLoadingPage from 'components/Helpers/InnerLoadingPage.jsx';

const Console = props => {
    // const [forms, setForms] = useState([/* {formTimestamp:'', formId: ''}*/]);
    // const [formDataSkipCursor, setFormDataSkipCursor] = useState(0);
    // const [currSelectedFormID, setCurrSelectedFormID] = useState(null);
    // const [formData, setFormData] = useState(null);
    // const [canRetFormsData, setCanRetFormsData] = useState(true);
    // const [canDeleteFormData, setCanDeleteFormData] = useState(false);

    const [users, setUsers] = useState([]);
    const [currSelectedUserID, setCurrSelectedUserID] = useState(null);
    const [canRetUsersData, setCanRetUsersData] = useState(true);

    const [numberOfActiveSessions, setNumberOfActiveSessions] = useState(0);
    const [canRetNumberOfActiveSessions, setCanRetNumberOfActiveSessions] = useState(true);

    const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);

    useEffect(() => {
        const retNumberOfActiveSessions = async () => {
            const responseJSON = await callAPIAsync(sessionsAPI.getNumberOfActiveSessions(), 'Unable to retrieve number of active sessions!');

            if (responseJSON.status === 200) {
                setNumberOfActiveSessions(responseJSON.result);
                setCanRetNumberOfActiveSessions(false);
            }
        }

        if (canRetNumberOfActiveSessions) retNumberOfActiveSessions();

        // eslint-disable-next-line
    }, [canRetNumberOfActiveSessions]);

    // useEffect(() => {
    //     const retFormsData = async formDataSkipCursor => {
    //         const responseJSON = await callAPIAsync(contactFormAPI.retrieveFormTimestamps(formDataSkipCursor), 'Unable to retrieve form timestamps!');
    //         const newForms = forms;

    //         if (responseJSON.status === 200) {
    //             responseJSON.result.timestamps.forEach((doc) => {
    //                 newForms.push({formTimestamp: `${new Date(doc.timestamp)}`, formId: doc._id});
    //             });
    
    //             setFormDataSkipCursor(responseJSON.result.skipCursor);
    //             setForms(newForms);
    //             setCanRetFormsData(false);
    //         }
    //     }

    //     if (canRetFormsData && props.isAdmin) retFormsData(formDataSkipCursor);

    //     // eslint-disable-next-line
    // }, [canRetFormsData]);

    // useEffect(() => {
    //     const retFormData = async formID => {
    //         const responseJSON = await callAPIAsync(contactFormAPI.retrieveFormData(formID), 'Unable to retrieve form data!');
    //         setFormData(responseJSON.result);
    //     }

    //     if (currSelectedFormID) {
    //         setFormData(null);
    //         retFormData(currSelectedFormID);
    //     }
    // }, [currSelectedFormID]);

    // useEffect(() => {
    //     const deleteForm = async formID => {
    //         const res = window.confirm('Are you sure you want to delete this form data?');
    
    //         if (res) {
    //             const responseJSON = await callAPIAsync(contactFormAPI.deleteFormData(formID), 'Unable to delete form data!');
            
    //             if (responseJSON.status === 200) {    
    //                 alert('Form Deleted!');
    //                 window.location.reload();
    //             }
    //         }
    //         else setCanDeleteFormData(false);
    //     }

    //     if (canDeleteFormData) deleteForm(currSelectedFormID);

    //     // eslint-disable-next-line
    // }, [canDeleteFormData]);

    useEffect(() => {
        const retUsersData = async () => {
            const responseJSON = await callAPIAsync(sessionsAPI.getUsersList(), 'Unable to retrieve users list!');

            if (responseJSON.status === 200) {
                setUsers(responseJSON.result);
                setCanRetUsersData(false);
            }
        }

        if (canRetUsersData && props.isAdmin) retUsersData();

        // eslint-disable-next-line
    }, [canRetUsersData]);

    // const clearSelectedForm = () => {
    //     setCurrSelectedFormID(null);
    //     setFormData(null);
    // }

    const clearSelectedUser = () => {
        setCurrSelectedUserID(null);
    }

    // const displayForm = (formData) => {
    //     var form = '';

    //     if (formData !== null) {
    //         const titleUnderline = (<div class="d-flex justify-content-center"><p style={{border: '4px solid black', width: '30%'}}></p><br /></div>);
    //         form = (  
    //             <Card variant="elevation" style={{ maxHeight: '800px', backgroundColor: '#C4C4C4', color: 'black', textAlign: 'center', overflowY: 'auto' }}>
    //                 <CardContent>
    //                     {/* <Button style={{ backgroundColor: 'red' }} onClick={() => clearSelectedForm()}>&times;</Button><br /><br /> */}
    //                     <p><b>DATE</b>{titleUnderline}{new Date(formData.timestamp).toString()}</p>
    //                     <p><b>NAME</b>{titleUnderline}{formData.name}</p>
    //                     <p><b>EMAIL ADDRESS</b>{titleUnderline}{formData.email}</p>
    //                     <p><b>PHONE NUMBER</b>{titleUnderline}{formData.phone_number}</p>
    //                     <p><b>MESSAGE</b>{titleUnderline}{formData.message}</p>
    //                 </CardContent>
    //                 <br />
    //                 <Button color="danger" onClick={() => setCanDeleteFormData(true)}>Delete?</Button>
    //             </Card>
    //         );
    //     }
    //     else if (currSelectedFormID !== null) {
    //         form = <InnerLoadingPage />;
    //     }

    //     return form;
    // }

    // const displayFormsList = (forms, isAdmin) => {
    //     if (isAdmin) {
    //         const formsList = [];
        
    //         if (forms !== null && forms.length !== 0) {
    //             forms.forEach((formInfo) => {
    //                 formsList.push(
    //                     <li>
    //                         <Button color="link" onClick={() => setCurrSelectedFormID(formInfo.formId)}>{formInfo.formTimestamp}</Button>
    //                     </li>
    //                 );
    //                 formsList.push(<br />);
    //             });
        
    //             if (formDataSkipCursor !== 0 && canRetFormsData) {
    //                 formsList.push(<InnerLoadingPage spinnerOnly={true} align="left" size={0.5} />);
    //             }
    //             else if (formDataSkipCursor !== 0) {
    //                 formsList.push(<Button color="link" onClick={() => setCanRetFormsData(true)}>more...</Button>);
    //             }
    //         }
    //         else {
    //             formsList.push(<h1>No Submitted Forms to Display!</h1>);
    //         }

    //         return (
    //             <ConsoleSectionCollapse title="Submitted Forms" onSectionToggled={() => clearSelectedForm()}>
    //                 <div style={{maxHeight: "750px", overflowY: "auto"}}>
    //                     <ul>
    //                         {formsList}
    //                     </ul>
    //                     <br />
    //                     {displayForm(formData)}
    //                 </div>
    //                 <br />
    //             </ConsoleSectionCollapse>
    //         );
    //     }

    //     return "";
    // }

    const displayUsersList = (users, isAdmin) => {
        if (isAdmin) {
            const usersList = [];
        
            if (users !== null && users.length !== 0) {
                users.forEach((userInfo) => {
                    usersList.push(
                        <li>
                            <Button color="link" onClick={() => setCurrSelectedUserID(userInfo._id)}>{userInfo.username}</Button>
                        </li>
                    );
                    usersList.push(<br />);
                });
            }
            else {
                usersList.push(<h1>No Users to Display!</h1>);
            }

            return (
                <ConsoleSectionCollapse title="Users">
                    <ul>
                        {usersList}
                    </ul>
                    <br />
                    <UserDataContainer
                        userId={currSelectedUserID}
                        currentUsername={props.username}
                        clearSelectedUser={clearSelectedUser}
                    />
                </ConsoleSectionCollapse>
            );
        }

        return "";
    }

    const displayUserSessionStats = () => {
        return (
            <ConsoleSectionCollapse title="Session Stats" isOpen>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            Active Sessions
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input value={numberOfActiveSessions} style={{ backgroundColor: 'white', fontSize: '24px', textAlign: 'center' }} disabled />
                    <InputGroupButtonDropdown addonType="append" isOpen={isSessionDropdownOpen} toggle={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}>
                        <Button color="light" style={{ backgroundColor: '#E9ECEF', borderColor: '#ced4da' }} onClick={() => setCanRetNumberOfActiveSessions(true)}>
                            <span style={{ color: 'blue', fontSize: 'large', cursor: 'pointer' }}>
                                {
                                    (canRetNumberOfActiveSessions)
                                    ?
                                        <Spinner style={{ color: 'blue' }} size="sm" type="grow" />
                                    :
                                        <Refresh />
                                }
                            </span>
                        </Button>
                        <DropdownToggle split color="light" style={{ backgroundColor: '#E9ECEF', borderColor: '#ced4da' }} />
                        <DropdownMenu>
                            <DropdownItem header>Session Options</DropdownItem>
                            <DropdownItem onClick={props.clearUserSessions}>Clear All My Current Sessions</DropdownItem>
                        </DropdownMenu>
                    </InputGroupButtonDropdown>
                </InputGroup>
                <br />
            </ConsoleSectionCollapse>
        );
    }

    return(
        <section>
            {displayUserSessionStats()}
            {/* {displayFormsList(forms, props.isAdmin || props.isPseudoAdmin)} */}
            {displayUsersList(users, props.isAdmin)}
            <br />
        </section>
    );
}

const mapStateToProps = ({ session: { userId, username, isAdmin, isPseudoAdmin } }) => ({ // site_info: { canEditMarqueeText }
    username,
    isAdmin: Boolean(userId) && Boolean(isAdmin),
    isPseudoAdmin: Boolean(userId) && Boolean(isPseudoAdmin)
});

const mapDispatchToProps = dispatch => ({
    clearUserSessions: () => dispatch(clearUserSessions(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Console);