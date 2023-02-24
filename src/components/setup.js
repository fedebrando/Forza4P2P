import logo from '../img/logo.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Component } from "react";

class Setup extends Component {
    render() {
        return (
            <div className="App w-25">
                <Image className="mb-3" src={logo} width={100} rounded />
                <FloatingLabel
                    controlId="yourId"
                    label="Il tuo ID"
                    className="mb-3"
                >
                <Form.Control type="text" value={this.props.yourId} disabled readOnly/>
                </FloatingLabel>
                <FloatingLabel
                    controlId="opponentId"
                    label="ID del giocatore avversario"
                    className="mb-3"
                >
                <Form.Control type="text"/>
                </FloatingLabel>
                <Button variant="primary" onClick={() => this.props.onPlay()}>Invita</Button>
            </div>
        )
    }
}

export default Setup;