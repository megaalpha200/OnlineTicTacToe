import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from 'actions/session';
import { hashEmail, hashPassword } from 'util/helpers';
import { Form, FormGroup, Label, Input, Button, InputGroup, InputGroupAddon } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

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
        showPassword: false,
    };

    handleSubmit = e => {
        e.preventDefault();

        const { login_email, login_password } = this.state;

        const emailHash = hashEmail(login_email);
        const passHash = hashPassword(login_email, login_password);

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
                showPassword: false,
            });
        }
        else {
            this.setState({
                [name]: target.value,
            });
        }
    }

    togglePasswordShow = () => this.setState({ showPassword: !this.state.showPassword });

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
                            <Input type="email" name="login_email" value={this.state.login_email} onChange={this.handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="login_password">
                            Password:
                            </Label>
                            <InputGroup>
                                <Input type={(this.state.showPassword) ? 'text' : 'password'} name="login_password" value={this.state.login_password} onChange={this.handleChange} required />
                                <InputGroupAddon addonType="append">
                                    <Button color="light" onClick={this.togglePasswordShow}>
                                        {
                                            (this.state.showPassword)
                                            ?
                                                <span className="fas fa-eye-slash"></span>
                                            :
                                                <span className="fas fa-eye"></span>
                                        }
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <Button type="submit" color="success">Log In</Button>
                        &nbsp;
                        <Button type="reset" name="RESET_BTN" color="danger" onClick={this.handleChange}>Clear</Button>
                    </Form>
                    <br />
                    <Link to="/signup">Need an Account? Click Here to Create One!</Link>
                    <br />
                    <Link to="/">Home</Link>
                </section>
            </WebPage>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);