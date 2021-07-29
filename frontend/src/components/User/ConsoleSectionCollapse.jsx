import React, { useState } from 'react';
import { Button, Collapse } from 'reactstrap';
import { Card, CardContent} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

const ConsoleSectionCollapse = props => {
    const [isSectionExpanded, setIsSectionExpanded] = useState((props.isOpen) ? true : false);

    const onSectionToggled = callback => {
        setIsSectionExpanded(!isSectionExpanded);
        if (callback) callback();
    }

    return (
        <div className="session-collapse-group-container" style={{ width: '100%' }}>
            <Button color="dark" className="section-collapse-group-title" style={{ width: '100%', fontSize: 'x-large' }} onClick={() => onSectionToggled(props.onSectionToggled)}>
                {props.title} {(isSectionExpanded) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Button>
            <br /><br />
            <Collapse isOpen={isSectionExpanded} style={{ maxWidth: '98%', margin: 'auto' }}>
                <div className="section-collapse-group-content">
                    <Card variant="elevation" style={{overflowY: "auto"}}>
                        <CardContent>
                            {props.children}
                        </CardContent>
                    </Card>
                    <br />
                </div>
            </Collapse>
        </div>
    );
};

export default ConsoleSectionCollapse;