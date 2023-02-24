import logo from '../img/logo.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Component } from "react";

class Login extends Component {
    render() {
        return (
            <div className="App w-25">
                <Image className="mb-3" src={logo} width={200} rounded />
                <FloatingLabel
                    controlId="username"
                    label="Username"
                    className="mb-3"
                >
                <Form.Control type="text"/>
                </FloatingLabel>
                <FloatingLabel
                    controlId="password"
                    label="Password"
                    className="mb-3"
                >
                <Form.Control type="password"/>
                </FloatingLabel>
                <Button id = "btnlogin" variant="primary" onClick={() => this.props.onLogin()}>Entra</Button>
            </div>
        )
    }
}

export default Login;