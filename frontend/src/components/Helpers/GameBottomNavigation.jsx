import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ShareButton from 'components/Helpers/ShareButton.jsx';

const useStyles = makeStyles({
  container: {
    width: '100%',
    bottom: 0,
    position: 'fixed',
  },
  root: {
    width: '100%',
    backgroundColor: '#333333',
    zIndex: 9990,
  },
  rootActionIcons: {
    color: '#CC3300',
  },
  selectedActionIcons: {
    color: '#FFD000',
  }
});

const GameBottomNavigation = props => {
    const classes = useStyles();
    const [bottomNavVal, setBottomNavVal] = useState(-1);

    useEffect(() => {
      setBottomNavVal(-1);
    }, [props.navActions]);

    const renderNavActions = navActions => {
      var renderedNavActions = [];

      renderedNavActions = navActions.map((action, index) => {
        const onActionClick = () => {
          action.onClick();

          if (action.noHighlight) setBottomNavVal(-1);
        }

        if (action.isSelected && bottomNavVal !== index && bottomNavVal === -1) setBottomNavVal(index);

        const renderedNavAction = (
          <BottomNavigationAction
            classes={{ root: classes.rootActionIcons, wrapper: (index === bottomNavVal) ? classes.selectedActionIcons : {} }}
            label={action.label}
            icon={action.icon}
            onClick={onActionClick}
            showLabel
          />
        );

          if (action.isShare) {
            return (
              <ShareButton
                title="Let's play some Tic Tac Toe! 😀"
                url={action.shareUrl}
                target={renderedNavAction}
              />
            );
          }
          else {
            return renderedNavAction;
          }
        });

      

      return renderedNavActions;
    }
  
    return (
      <div className={classes.container}>
        <BottomNavigation
          value={bottomNavVal}
          onChange={(_, newValue) => {
            setBottomNavVal(newValue);
          }}
          showLabels
          className={classes.root}
        >
          {renderNavActions(props.navActions)}
        </BottomNavigation>
      </div>
    );
}

GameBottomNavigation.propTypes = {
  navActions: PropTypes.shape({ label: PropTypes.string.isRequired, icon: PropTypes.object }).isRequired,
};

GameBottomNavigation.defaultProps = {
  navActions: [],
}

export default GameBottomNavigation;