import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/session';
import { backendEndpoint } from 'util/helpers';
import SocketIOClient from 'socket.io-client';
import { Label, Input, Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

const endpoint = `${backendEndpoint}/templatedb`;

const mapStateToProps = ({ session }) => ({
    session
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

class Dashboard extends Component {
    state = {
        testInput: "",
        receivedData: {
            data: '',
            timestamp: 0,
            date: "",
        },
    };

    componentDidMount = () => {
        this.receiveTestData();
    }

    sendTestData = () => {
        const socket = SocketIOClient(endpoint);
    
        socket.on('testDataSendRes', data => {
            alert(data);
        });
    
        socket.emit('testDataSendReq', { _id: 1,  data: this.state.testInput});
    };

    receiveTestData = () => {
        const socket = SocketIOClient(endpoint);

        socket.on('testDataRetRes', data => {
            data.date = new Date(data.timestamp)
            
            this.setState({
                receivedData: data,
            });
        });
    
        socket.emit('testDataRetReq', 1);
    }

    handleChange = e => {
        const target = e.target;
        const name = target.name;

        this.setState({
            [name]: target.value,
        });
    }

   render() {
    return(
        <WebPage pageTitle="Dashboard" pageHeading="Dashboard">
            <section>
                <h1>Hi {this.props.session.username}</h1>
                <p>You are now logged in!</p>
                <Button color="danger" onClick={this.props.logout}>Log Out</Button>
                <br />
                <br />
                <Label for="testInput">Test Data:</Label>
                <Input name="testInput" type="text" onChange={this.handleChange} />
                <br />
                <br />
                <Button color="primary" onClick={() => this.sendTestData()}>Send Test Data</Button>
                &nbsp;
                <Button color="primary" onClick={() => this.receiveTestData()}>Receive Test Data</Button>
                <br />
                <br />
                <h2><u>Received Data:</u></h2>
                <p><u>Data Received:</u> {this.state.receivedData.data}</p>
                <p><u>Date Submitted:</u> {this.state.receivedData.date.toString()}</p>
            </section>
        </WebPage>
    );
   }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);