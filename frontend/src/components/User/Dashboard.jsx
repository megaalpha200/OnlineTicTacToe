import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/session';
import { backendEndpoint } from 'util/helpers';
import SocketIOClient from 'socket.io-client';
import { Label, Input, Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

const socketEndpoint = `${backendEndpoint}/templatedb`;
const apiEndpoint = `${backendEndpoint}/api/template`;

const mapStateToProps = ({ session }) => ({
    session
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

class Dashboard extends Component {
    state = {
        testInput: "",
        receivedDataSockets: {
            data: '',
            timestamp: 0,
            date: "",
        },
        receivedDataAPI: {
            data: '',
            timestamp: 0,
            date: "",
        },
    };

    componentDidMount = () => {
        this.receiveTestDataViaSockets();
        this.receiveTestDataViaAPI();
    }

    sendTestDataViaSockets = () => {
        const socket = SocketIOClient(socketEndpoint);
    
        socket.on('testDataSendRes', data => {
            alert(data);
        });
    
        socket.emit('testDataSendReq', { _id: 1,  data: this.state.testInput });
    };

    sendTestDataViaAPI = async () => {
        const res = await fetch(`${apiEndpoint}/send`, { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({ _id: 1,  data: this.state.testInput }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        alert(data);
    }

    receiveTestDataViaSockets = () => {
        const socket = SocketIOClient(socketEndpoint);

        socket.on('testDataRetRes', data => {
            try {
                data.date = new Date(data.timestamp);
            
                this.setState({
                    receivedDataSockets: data,
                });
            }
            catch(e) {

            }
        });
    
        socket.emit('testDataRetReq', 1);
    }

    receiveTestDataViaAPI = async () => {
        const res = await fetch(`${apiEndpoint}/retrieve`, { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({ _id: 1}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        data.date = new Date(data.timestamp);

        this.setState({
            receivedDataAPI: data,
        });
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
                <Button color="primary" onClick={() => this.sendTestDataViaSockets()}>Send Test Data via Sockets</Button>
                &nbsp;
                <Button color="primary" onClick={() => this.receiveTestDataViaSockets()}>Receive Test Data via Sockets</Button>
                <br />
                <br />
                <h1>Sockets:</h1>
                <h2><u>Received Data:</u></h2>
                <p><u>Data Received:</u> {this.state.receivedDataSockets.data}</p>
                <p><u>Date Submitted:</u> {this.state.receivedDataSockets.date.toString()}</p>
                <br />
                <br />
                <Button color="primary" onClick={() => this.sendTestDataViaAPI()}>Send Test Data via API</Button>
                &nbsp;
                <Button color="primary" onClick={() => this.receiveTestDataViaAPI()}>Receive Test Data via API</Button>
                <br />
                <br />
                <h1>API Routes:</h1>
                <h2><u>Received Data:</u></h2>
                <p><u>Data Received:</u> {this.state.receivedDataAPI.data}</p>
                <p><u>Date Submitted:</u> {this.state.receivedDataAPI.date.toString()}</p>
            </section>
        </WebPage>
    );
   }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);