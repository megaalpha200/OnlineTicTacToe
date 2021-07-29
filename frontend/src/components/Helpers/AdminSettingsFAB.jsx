import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FAB from '@material-ui/core/Fab';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { Close, SettingsApplicationsOutlined, ExitToApp as LogOutIcon } from '@material-ui/icons';
import { connect } from 'react-redux';
import { logout } from 'actions/session';
import 'assets/Helpers/css/adminSettingsFABStyle.css';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    logOutButton: {
        backgroundColor: 'red',
        color: 'white'
    }
  }));

const AdminSettingsFAB = props => {
    const classes = useStyles();

    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => (!props.keepOpen) ? setIsOpen(false) : {};

    const renderActions = actions => {
        return actions.map(action => (
            <SpeedDialAction
                key={action.name}
                tooltipTitle={action.name}
                tooltipOpen={(action.showToolTip !== undefined) ? action.showToolTip : true}
                tooltipPlacement="right"
                icon={action.icon}
                onClick={action.onClick}
                hidden={props.isPseudoAdmin && action.adminOnly}
            />
        )).reverse();
    }

    const renderButton = () => {
        if (props.isAdmin || props.isPseudoAdmin) {
            return (
                <SpeedDial
                    ariaLabel="admin SpeedDial"
                    id="admin-settings-fab"
                    icon={<SpeedDialIcon openIcon={<Close />} icon={<SettingsApplicationsOutlined />} />}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    open={isOpen}
                    hidden={props.actions.length === 0}
                >
                    {renderActions(props.actions)}
                </SpeedDial>
            );
        }
        else if (props.isLoggedIn) {
            return (
                <FAB id="admin-settings-fab" variant="extended" className={classes.logOutButton} onClick={() => props.logout()}>
                    <LogOutIcon className={classes.extendedIcon} />
                    Log Out
                </FAB>
            );
        }
        else return "";
    }

    return renderButton();
}

AdminSettingsFAB.propTypes = {
    actions: PropTypes.arrayOf({ name: PropTypes.string, icon: PropTypes.object, onClick: PropTypes.func, showToolTip: PropTypes.bool, keepOpen: PropTypes.bool, adminOnly: PropTypes.bool }),
    keepOpen: PropTypes.bool,
}

AdminSettingsFAB.defaultProps = {
    actions: [],
    keepOpen: false,
}

const mapStateToProps = ({ session: { userId, isAdmin, isPseudoAdmin } }) => ({
    isLoggedIn: Boolean(userId),
    isAdmin: Boolean(userId) && Boolean(isAdmin),
    isPseudoAdmin: Boolean(userId) && Boolean(isPseudoAdmin)
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminSettingsFAB);