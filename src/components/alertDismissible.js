import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

class AlertDismissible extends Component {
    render() {
        if (this.props.alertMess.variant !== 'none')
            return (
                <Alert className='mb-3 w-50' variant={this.props.alertMess.variant} onClose={() => this.props.onClose()} dismissible={!this.props.alertMess.buttons}>
                    <Alert.Heading>{this.props.alertMess.heading}</Alert.Heading>
                    <p>{this.props.alertMess.text}</p>
                    {this.props.alertMess.buttons ?
                        <>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button className="mx-2" onClick={() => this.props.onAccept()} variant="outline-primary">
                                    Accetta
                                </Button>
                                <Button onClick={() => this.props.onRefuse()} variant="outline-danger">
                                    Rifiuta
                                </Button>
                            </div>
                        </> :
                        <></> 
                    }
                </Alert>
            );
        else
            return (<></>);
    }
}

export default AlertDismissible;