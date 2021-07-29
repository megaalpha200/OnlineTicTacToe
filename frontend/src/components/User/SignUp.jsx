import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { signup } from 'actions/session';
import { hashEmail, hashPassword } from 'util/helpers';
import { Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

const BASIC_USER = 'basic';
const PSEUDO_ADMIN_USER = 'pseudo_admin';
const TRUE_ADMIN_USER = 'true_admin';

const mapStateToProps = ({ errors, session: { userId, isAdmin } }) => ({
    isAdmin: Boolean(userId) && Boolean(isAdmin),
    errors
});

const mapDispatchToProps = dispatch => ({
    signup: user => dispatch(signup(user))
});

const SignUp = ({errors, signup, isAdmin}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isAdminSelected, setIsAdminSelected] = useState(false);
    const [userType, setUserType] = useState(BASIC_USER);

    const handleInputsOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'username':
                setUsername(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleCheckboxOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'is_admin':
                if (isAdminSelected) {
                    setUserType(BASIC_USER);
                }
                else {
                    setUserType(PSEUDO_ADMIN_USER);
                }

                setIsAdminSelected(!isAdminSelected);
                break;
            default:
                break;
        }
    }

    const handleRadioButtonOnChange = e => {
        const name = e.target.name;

        switch (name) {
            case 'user_type':
                setUserType(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleFormClear = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setIsAdminSelected(false);
        setUserType(BASIC_USER);
    }

    const handleSubmit = e => {
        e.preventDefault();

        const emailHash = hashEmail(email);
        const passHash = hashPassword(email, password);

        const user = {
            username: username,
            email: email,
            password: password,
            emailHash: emailHash,
            passwordHash: passHash,
            user_type: userType
        };

        signup(user);
    }

    const togglePasswordShow = () => setShowPassword(!showPassword);

    const renderAdminOptions = isAdmin => {
        if (isAdmin) {
            return (
                <FormGroup onChange={handleRadioButtonOnChange} value={userType} check>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Label check>
                            <Input type="radio" name="user_type" value={TRUE_ADMIN_USER} checked={userType === TRUE_ADMIN_USER} />
                            True Admin
                        </Label>
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Label check>
                            <Input type="radio" name="user_type" value={PSEUDO_ADMIN_USER} checked={userType === PSEUDO_ADMIN_USER} />
                            Pseudo Admin
                        </Label>
                </FormGroup>
            )
        }
        else return "";
    }

    return (
        <WebPage pageTitle="Sign Up" pageHeading="Sign Up">
            <section>
                <p style={{ color: 'red' }}>{errors}</p>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="username">
                            Username:
                        </Label>
                        <Input type="text" name="username" value={username} onChange={handleInputsOnChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">
                            Email:
                        </Label>
                        <Input type="email" name="email" value={email} onChange={handleInputsOnChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">
                            Password:
                        </Label>
                        <InputGroup>
                            <Input type={(showPassword) ? 'text' : 'password'} name="password" value={password} onChange={handleInputsOnChange} required />
                            <InputGroupAddon addonType="append">
                                <Button color="light" onClick={togglePasswordShow}>
                                    {
                                        (showPassword)
                                        ?
                                            <span className="fas fa-eye-slash"></span>
                                        :
                                            <span className="fas fa-eye"></span>
                                    }
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    {
                        (isAdmin)
                        ?
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" name="is_admin" value={isAdminSelected} onClick={handleCheckboxOnChange} />
                                    Is Admin?
                                </Label>
                                {renderAdminOptions(isAdminSelected)}
                            </FormGroup>
                        :
                            ""
                    }
                    <br />
                    <Button type="submit" color="success">Submit</Button>
                    &nbsp;
                    <Button type="reset" color="danger" onClick={() => handleFormClear()}>Clear</Button>
                </Form>
                <br />
                {
                    (isAdmin)
                    ?
                        <Link to="/dashboard">Back to Dashboard</Link>
                    :
                        <Link to="/login">Have an Account? Click Here to Log In!</Link>

                }
            </section>
        </WebPage>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);