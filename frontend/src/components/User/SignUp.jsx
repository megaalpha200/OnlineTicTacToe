import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from 'actions/session';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

import SHA256 from 'crypto-js/sha256';
import bcrypt from 'bcryptjs';

const mapStateToProps = ({ errors }) => ({
    errors
});

const mapDispatchToProps = dispatch => ({
    signup: user => dispatch(signup(user))
});

const SignUp = ({errors, signup}) => {
    const handleSubmit = e => {
        e.preventDefault();

        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        const emailHash = bcrypt.hashSync(email, `$2b$10$${SHA256(email).toString().slice(-22)}`).slice(-40);
        const passHash = bcrypt.hashSync(password, `$2b$10$${SHA256(email + password).toString().slice(-22)}`).slice(-40);

        const user = {
            username: username,
            email: email,
            password: password,
            emailHash: emailHash,
            passwordHash: passHash
        };

        signup(user);
    }

    return (
        <WebPage pageTitle="Sign Up" pageHeading="Sign Up">
            <section>
                <p>{errors}</p>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="username">
                            Username:
                        </Label>
                        <Input type="text" name="username" required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">
                            Email:
                        </Label>
                        <Input type="email" name="email" required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">
                            Password:
                        </Label>
                        <Input type="password" name="password" required />
                    </FormGroup>
                    <Button type="submit" color="success">Submit</Button>
                </Form>
                <br />
                <Link to="/login">Log In</Link>
            </section>
        </WebPage>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);