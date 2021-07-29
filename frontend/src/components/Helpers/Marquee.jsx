import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText, Form } from 'reactstrap';
import { initializeMarquee, shrinkHeader, isHeaderShrunk, setHeaderShrinkGrow } from 'assets/Helpers/js/headerFunctions';
import 'assets/Helpers/css/marqueeStyle.css';

const Marquee = (props) => {
    const [canEditMarquee, setCanEditMarquee] = useState(props.isEditMode);
    const [currMarqueeText, setCurrMarqueeText] = useState(null);
    const [isHeaderShrunkLocal, setIsHeaderShrunkLocal] = useState(isHeaderShrunk());

    useEffect(() => {
        if (props.isEditMode) {
            console.log(isHeaderShrunk());
            setIsHeaderShrunkLocal(isHeaderShrunk());
            shrinkHeader();
        }
        else {
            setHeaderShrinkGrow(isHeaderShrunkLocal);
        }

        setCanEditMarquee(props.isEditMode);

        // eslint-disable-next-line
    }, [props.isEditMode]);

    useEffect(() => {
        initializeMarquee();
        setCurrMarqueeText(props.marqueeText);
    }, [props.marqueeText, canEditMarquee]);

    const onMarqueeTextChange = marqueeText => {
        setCurrMarqueeText(marqueeText);
        props.setMarqueeText(marqueeText);
    }

    return (
        <div>
            {
                (props.isAdmin)
                ?
                    (canEditMarquee)
                    ?
                        <Form>
                            <InputGroup>
                                <InputGroupText addonType="prepend">Marquee Text</InputGroupText>
                                <Input value={(currMarqueeText == null) ? "" : currMarqueeText} onChange={(e) => onMarqueeTextChange(e.target.value)} />
                                {
                                    (props.isEditMode === undefined)
                                    ?
                                        [
                                            <InputGroupAddon addonType="append"><Button color="success" onClick={() => props.updateMarqueeText(currMarqueeText)}>Submit</Button></InputGroupAddon>,
                                            <InputGroupAddon addonType="append"><Button color="danger" type="reset" onClick={() => onMarqueeTextChange(null)}>Clear</Button></InputGroupAddon>
                                        ]
                                    :
                                        ""
                                }
                                <InputGroupAddon addonType="append"><Button color="warning" onClick={() => { setCanEditMarquee(!canEditMarquee); props.toggleEditMode(); }}>Exit</Button></InputGroupAddon>
                            </InputGroup>
                        </Form>
                    :
                        (props.isEditMode === undefined)
                        ?
                            <Button id="edit_marque_text_btn" color="danger" onClick={() => setCanEditMarquee(!canEditMarquee)}>Edit Marquee Text</Button>
                        :
                            ""
                :
                    ""
            }
            {
                (props.marqueeText || currMarqueeText)
                ?
                    <div className="marquee">
                        <p onDoubleClick={(props.isAdmin) ? () => { setCanEditMarquee(!canEditMarquee); props.toggleEditMode(); } : () => {}}>{(canEditMarquee) ? ReactHtmlParser(currMarqueeText) : ReactHtmlParser(props.marqueeText)}</p>
                    </div>
                :
                    ""
            }
        </div>
    );
};

Marquee.propTypes = {
    marqueeText: PropTypes.string,
    updateMarqueeText: PropTypes.func,
    setMarqueeText: PropTypes.func,
    isAdmin: PropTypes.bool,
    isEditMode: PropTypes.bool,
    toggleEditMode: PropTypes.func,
}

Marquee.defaultProps = {
    marqueeText: null,
    updateMarqueeText: () => {},
    setMarqueeText: () => {},
    isAdmin: false,
    isEditMode: false,
    toggleEditMode: () => {},
}

export default Marquee;