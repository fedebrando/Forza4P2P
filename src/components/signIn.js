import logo from '../img/logo.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Component } from "react";
import $ from 'jquery';

class SignIn extends Component {

    state = {
        invalidUsername: true,
        invalidPassword: true
    }

    handleInput = () => {
        let probUsername = $('#newUsername').val();

        if (probUsername == '' && !this.state.invalidUsername) {
            this.setState({invalidUsername: true});
            return;
        }

        fetch('http://localhost:4000/peer/' + probUsername) // GET request to peerService
        .then((response) => {
          if (response.status == 404 && this.state.invalidUsername) { // not found
            this.setState({invalidUsername: false});
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (!this.state.invalidUsername)
            this.setState({invalidUsername: true});
        })
        .catch((err) => {
          console.log(err.message);
        });     
    }

    render() {
        return (
            <div className="App w-25">
                <Image className="mb-3" src={logo} width={100} rounded />
                <FloatingLabel
                    controlId="newUsername"
                    label="Username"
                    className="mb-3"
                >
                <Form.Control onInput={() => this.handleInput()} isInvalid={this.state.invalidUsername} type="text"/>
                <Form.Control.Feedback type="invalid">
                    {this.state.invalidUsername ? 'Il nome utente inserito esiste già o non è valido.' : ''}
                </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                    controlId="newPassword"
                    label="Password"
                    className="mb-3"
                >
                <Form.Control type="password" onInput={() => {
                    this.setState({invalidPassword: $('#newPassword').val() == ''});
                }} />
                </FloatingLabel>
                <Button variant="primary" onClick={() => this.props.onSignIn()} disabled={this.state.invalidUsername || this.state.invalidPassword}>Registrati</Button>
            </div>
        )
    }
}

export default SignIn;