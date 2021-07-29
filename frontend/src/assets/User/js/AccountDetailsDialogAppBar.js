import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Close as CloseIcon, ArrowBack as BackIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }));

const AccountDetailsDialogAppBar = ({title, onClose, onUpdate, innerMenu}) => {
    const classes = useStyles();

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                    { (innerMenu) ? <BackIcon /> : <CloseIcon /> }
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                {
                    (onUpdate)
                    ?
                    <Button autoFocus color="inherit" onClick={onUpdate}>
                        Update
                    </Button>
                    :
                        ""
                }
            </Toolbar>
        </AppBar>
    );
}

export default AccountDetailsDialogAppBar;