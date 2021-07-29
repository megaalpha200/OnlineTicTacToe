import React, { useState } from 'react';
import { connect } from 'react-redux';
import history from 'util/history';
import { toggleEditMarqueeText, updateMarqueeText, clearMarqueeText, updateLastUpdateDate } from 'actions/site_info';
import { clearAllSessions } from 'actions/session';
import { Badge, Button } from '@material-ui/core';
import { Edit as EditIcon, Close as CloseIcon, ClearAll as ClearIcon, Send as UpdateTextIcon, PersonAdd as NewUserIcon, DeleteSweep, AccountCircle as AccountIcon, Update as UpdateTimeIcon } from '@material-ui/icons';
import Console from 'components/User/Console.jsx';
import ChangeUserAccountDetailsModal from 'components/User/ChangeUserAccountDetailsDialog.jsx';
import WebPage from 'components/Helpers/WebPage.jsx';

const mapStateToProps = ({ session: { userId, username, isAdmin, isPseudoAdmin }, site_info: { canEditMarqueeText } }) => ({
    username,
    isAdmin: Boolean(userId) && Boolean(isAdmin),
    isPseudoAdmin: Boolean(userId) && Boolean(isPseudoAdmin),
    canEditMarqueeText
});

const mapDispatchToProps = dispatch => ({
    toggleEditMarqueeText: () => dispatch(toggleEditMarqueeText()),
    updateLastUpdateDate: () => dispatch(updateLastUpdateDate()),
    clearMarqueeText: () => dispatch(clearMarqueeText()),
    updateMarqueeText: () => dispatch(updateMarqueeText()),
    clearAllSessions: () => dispatch(clearAllSessions())
});

const Dashboard  = props => {
    const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] = useState(false);

    const marqueeEditActions = [];

    if (props.canEditMarqueeText) {
        marqueeEditActions.push({ name: 'Update Marquee Text', icon: <UpdateTextIcon />, onClick: () => props.updateMarqueeText() });
        marqueeEditActions.push({ name: 'Clear Marquee Text', icon: <ClearIcon />, onClick: () => props.clearMarqueeText() });
    }

    return(
        <WebPage pageTitle={`${(props.isAdmin || props.isPseudoAdmin) ? 'Admin ' : ''}Dashboard`} pageHeading={`${(props.isAdmin || props.isPseudoAdmin) ? 'Admin ' : ''}Dashboard`}
            adminSettingsFABActionData={
                {
                    actions: [
                        ...marqueeEditActions,
                        { name: (props.canEditMarqueeText) ? 'Close Marquee Text Editing' : 'Edit Marquee Text', icon: (props.canEditMarqueeText) ? <CloseIcon /> : <EditIcon />, onClick: () => props.toggleEditMarqueeText() },
                        { name: 'Set Last Update Timestamp', icon: <UpdateTimeIcon />, onClick: () => props.updateLastUpdateDate() },
                        { name: 'Update My Account Details', icon: <AccountIcon />, onClick: () => setIsAccountDetailsModalOpen(true) },
                        { name: 'Add New User', icon: <NewUserIcon />, onClick: () => history.push('/signup-new-user'), adminOnly: true },
                        { name: 'Clear User Sessions', icon: <DeleteSweep />, onClick: () => props.clearAllSessions(), adminOnly: true }
                    ],
                    keepOpen: false
                }
            }
        >
            <section>
                <ChangeUserAccountDetailsModal isOpen={isAccountDetailsModalOpen} onClose={() => setIsAccountDetailsModalOpen(false)} />
                <div className="dashboard-top-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="username-container" style={{ flexGrow: '10' }}>
                        {
                            (props.isAdmin || props.isPseudoAdmin)
                            ?
                                <Badge color={(props.isAdmin) ? "error" : "secondary"} badgeContent={`${(props.isAdmin) ? "" : "Pseudo " }Admin`}>
                                    <h1>Hi {props.username}&nbsp;</h1>
                                </Badge>
                            :
                                <h1>Hi {props.username}&nbsp;</h1>
                        }
                        <p>You are now logged in!</p>
                    </div>
                    <div className="account-details-btn-container" style={{ flexGrow: '1', textAlign: 'right' }}>
                        {
                            (!props.isAdmin && !props.isPseudoAdmin)
                            ?
                            <Button color="primary" variant="contained" onClick={() => setIsAccountDetailsModalOpen(true)}>Update My Account Details</Button>
                            :
                                ""
                        }
                    </div>
                </div>
                <br />
                <br />
                <Console />
                <br />
                <br />
            </section>
        </WebPage>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);