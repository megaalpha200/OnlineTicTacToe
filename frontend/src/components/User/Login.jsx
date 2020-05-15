import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from 'actions/session';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

import SHA256 from 'crypto-js/sha256';
import bcrypt from 'bcryptjs';

const mapStateToProps = ({ errors }) => ({
    errors
});

const mapDispatchToProps = dispatch => ({
    login: user => dispatch(login(user))
});

class Login extends Component {
    state = {
        login_email: '',
        login_password: '',
    };

    handleSubmit = e => {
        e.preventDefault();

        const { login_email, login_password } = this.state;

        const emailHash = bcrypt.hashSync(login_email, `$2b$10$${SHA256(login_email).toString().slice(-22)}`).slice(-40);
        const passHash = bcrypt.hashSync(login_password, `$2b$10$${SHA256(login_email + login_password).toString().slice(-22)}`).slice(-40);

        const user = {
            email: login_email,
            password: login_password,
            emailHash: emailHash,
            passwordHash: passHash
        };

        this.props.login(user);
    }

    handleChange = e => {
        const target = e.target;
        const name = target.name;

        if (name === "RESET_BTN") {
            this.setState({
                login_email: '',
                login_password: '',
            });
        }
        else {
            this.setState({
                [name]: target.value,
            });
        }
    }

    render() {
        return (
            <WebPage pageTitle="Login" pageHeading="Login">
                <section>
                    <p>{this.props.errors}</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="login_email">
                                Email:
                            </Label>
                            <Input type="email" name="login_email" onChange={this.handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="login_password">
                            Password:
                            </Label>
                            <Input type="password" name="login_password" onChange={this.handleChange} required />
                        </FormGroup>
                        <Button type="submit" color="success">Log In</Button>
                        &nbsp;
                        <Button type="reset" name="RESET_BTN" color="danger" onClick={this.handleChange}>Clear</Button>
                    </Form>
                    <br />
                    <Link to="/signup">Sign Up</Link>
                </section>
            </WebPage>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);