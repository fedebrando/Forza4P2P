import React, { Component } from "react";
import $ from 'jquery';
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBBtn,
  MDBCardFooter,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import Message from "./message";

class Chat extends Component {

  state = {
    invalidMessage: true
  }

  render() {
    return (
      <MDBContainer fluid style={{width: '35%'}}>
        <MDBCard>
          <MDBCardHeader
            className="d-flex justify-content-between align-items-center p-3"
            style={{ borderTop: "4px solid blue" }}
          >
          <h5 className="mb-0">{this.props.turn ? 'Tocca a te!' : "Attendi la mossa dell'avversario"}</h5>
          </MDBCardHeader>
          <MDBCardBody id='bodyChat' style={{height: '350px', overflowY: 'scroll'}}>
              {this.props.messages.map((mess, i) => (<Message key={i} message={mess} />))}
          </MDBCardBody>
          <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
            <MDBInputGroup className="mb-0">
              <input
                className="form-control"
                placeholder="Scrivi un messaggio..."
                type="text"
                id="messText"
                onInput={() => {
                  this.setState({invalidMessage: $('#messText').val() == ''});
                }}
              />
              <MDBBtn id="btnSend" color="primary" style={{paddingTop: ".55rem", height: '40px', width: '60px'}} disabled={this.state.invalidMessage} onClick={() => {
                this.props.onSend({type: 'chat', content: $("#messText").val()});
                $("#messText").val("");
                this.setState({invalidMessage: true});
              }}>
                Invia
              </MDBBtn>
            </MDBInputGroup>
          </MDBCardFooter>
        </MDBCard>
      </MDBContainer>
    );
  }
}

export default Chat;
