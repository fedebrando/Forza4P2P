import Login from './components/login';
import SignIn from './components/signIn';
import Setup from './components/setup';
import Chat from './components/chat';
import AlertDismissible from './components/alertDismissible';
import Forza4 from './components/forza4';
import { Button } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

import { Component } from 'react';
import { Peer } from "peerjs";
import { sha3_512 } from 'js-sha3';

const peerCfg = {host: "localhost", port: 9000, path:"/forza4srv"}

let peer;
let conn = null;

class App extends Component {

  state = {
    signIn: false,
    login: null,
    play: false,
    alertMess: {variant: 'primary', heading: 'Benvenuto.', text: 'Effettua il login o registrati.', buttons: false},
    messages: [],
    board: [[null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]],
    turn: true
  };

  constructor() {
    super();

    $(window).on("beforeunload", function() { 
      conn.close();
      peer.close();
    });
  }

  resetBoardChat() {
    this.setState({
                    board: [[null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null]],
                    messages: []
                  });
  }

  componentDidMount() {
    document.title = "Forza4"
  }

  initPeer(id) {
    peer = new Peer(id, peerCfg);

    // set callback for received id
    peer.on('open', () => {});

    // set callback for received connection
    peer.on('connection', (connection) => {
      conn = connection;
      this.initConn();
      this.setState({alertMess: {variant: 'primary', heading: 'Invito', text: `Sei stato invitato a giocare con ${conn.peer}.`, buttons: true}});
    });
  }

  addMessage(mess) {
    let newMessages = this.state.messages;

    newMessages.push(mess);
    this.setState({messages: newMessages});
  }

  handleLogin = () => {
    let username = $('#username').val();
    let password = $('#password').val();

    fetch('http://localhost:4000/peer/' + username) // GET request to peerService
      .then((response) => {
          if (response.status == 404) { // not found
            this.setState({alertMess: {variant: 'danger', heading: 'Chi sei?', text: 'Non esiste ancora questo utente; registrati!', buttons: false}});
            return null;
          }
          return response.json();
      })
      .then((data) => {
          if (data) {
            if (data.PswHash == sha3_512(password)) {
              this.initPeer(username);
              this.setState({login: username, alertMess: {variant: 'primary', heading: 'Forza4', text: 'Manda un invito di gioco a qualcuno!', buttons: false}});
            }
            else
              this.setState({alertMess: {variant: 'danger', heading: 'Errore', text: 'La password inserita non è quella corretta.', buttons: false}});
          }
      })
      .catch((err) => {
          console.log(err.message);
      });
  }

  handleSignIn = () => {
    let username = $('#newUsername').val();
    let password = $('#newPassword').val();
    let newPeer;

    newPeer = {Username: username, PswHash: sha3_512(password)}; // password will not be in the network (replay attack may be possible)

    fetch('http://localhost:4000/newPeer', {
      method: 'POST',
      body: JSON.stringify(newPeer),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      })
      .then((response) => {
        if (response.status == 201) // resource created (with unused location field)
          this.setState({signIn: false, alertMess: {variant: 'success', heading: 'Perfetto', text: 'La registrazione è avvenuta con successo; accedi.', buttons: false}});
        else
          this.setState({alertMess: {variant: 'danger', heading: 'Errore', text: 'Ricontrolla i valori inseriti.', buttons: false}});
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleSend = (obj) => {
    switch (obj.type) {
      case 'chat':
        this.addMessage({isOpponent: false, name: this.state.login, when: this.now(), text: obj.content});
        break;
      case 'move':
        this.setState({turn: false});
    }
    conn.send(obj);
  }

  now() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    return ((hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes));
  }

  handleReceive = (obj) => {
    switch (obj.type) {
      case 'chat':
        this.addMessage({isOpponent: true, name: conn.peer, when: this.now(), text: obj.content});
        break;
      case 'confirm':
        if (obj.content)
          this.setState({play: true, turn: false});
        else
          conn.close();
        break;
      case 'move':
        this.updateBoard(obj.content, 'opponent');
        this.setState({turn: true});
        break;
      case 'end':
        this.setState({alertMess: {variant: (obj.content == 'win' ? 'danger' : 'warning'), heading: (obj.content == 'win' ? 'Hai perso...' : 'Pareggio'), text: "La partita è terminata.", buttons: false}, turn: false});
        break;
    }
  }

  initConn() {
    conn.on('data', (data) => this.handleReceive(data)); // callback for received data
    conn.on('close', () => this.handleCloseConn()); // callback for closing connection
    conn.on('error', (err) => {this.setState({alertMess: {variant: 'danger', heading: 'Errore', text: err, buttons: false}})});
  }

  updateBoard(pos, value) {
    let newBoard = this.state.board;

    newBoard[pos.r][pos.c] = value;
    this.setState({board: newBoard});
  }

  handleCloseConn = () => {
    if (this.state.play)
      this.setState({play: false, alertMess: {variant: 'danger', heading: 'Disconnessione', text: "La connessione è stata interrotta.", buttons: false}});
    else
      this.setState({alertMess: {variant: 'danger', heading: 'Invito rifiutato', text: "L'invito è stato rifiutato.", buttons: false}});
    this.resetBoardChat();
  }

  handleCloseAlert = () => {
    this.setState({alertMess: {variant: 'none'}});
  }

  lastFreeRow(c) {
    let r;

    for (r = 0; r < 6; r++)
      if (this.state.board[r][c] != null)
        return r-1;
    return r-1;
  }

  countRemainderMe(lastPos, verse) {
    let currPos = lastPos;
    let countRemainder = -1;

    do {
      countRemainder++;
      currPos = {r: currPos.r + verse.dr, c: currPos.c + verse.dc};
    } while (0 <= currPos.r && currPos.r < 6 && 0 <= currPos.c && currPos.c < 7 && this.state.board[currPos.r][currPos.c] == 'me');

    return countRemainder;
  }

  countSequenceMe(lastPos, direction) {
    return 1 + this.countRemainderMe(lastPos, direction) + this.countRemainderMe(lastPos, {dr: -direction.dr, dc: -direction.dc});
  }

  isFull() {
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 7; c++)
        if (this.state.board[r][c] == null)
          return false;
    return true;
  }

  finish(lastPos) {
    let directions = [{dr: 1, dc: 0}, {dr: 1, dc: 1}, {dr: 0, dc: 1}, {dr: -1, dc: 1}];
    let sequence4 = false;

    directions.forEach((dir, i, arr) => {
      if (this.countSequenceMe(lastPos, dir) == 4) {
        sequence4 = true;
        arr.length = i + 1; // like break;
      }
    });
    if (sequence4)
      return 'win';
    if (this.isFull())
      return 'draw';
    return 'none';
  }

  handleMove = (e) => {
    let c = parseInt(e.target.id[4]);
    let r = this.lastFreeRow(c);
    let pos;
    let finish;

    if (r == -1)
      return;
    pos = {r: r, c: c};
    this.updateBoard(pos, 'me');
    this.handleSend({type: 'move', content: {r: r, c: c}});
    finish = this.finish(pos);
    if (finish != 'none') {
      if (finish == 'win')
        this.setState({alertMess: {variant: 'success', heading: 'Hai vinto!', text: "La partita è terminata.", buttons: false}, turn: false});
      else
        this.setState({alertMess: {variant: 'warning', heading: 'Pareggio', text: "La partita è terminata.", buttons: false}, turn: false});
      this.handleSend({type: 'end', content: finish});
    }
  }

  handlePlay = () => {
    let opponentId = $('#opponentId').val();

    if (opponentId == null || opponentId == "")
      return;
    conn = peer.connect(opponentId);
    conn.on('open', () => {
      this.initConn();
      this.setState({alertMess: {variant: 'primary', heading: 'Invito inviato', text: "Se e quando l'utente accetterà l'invito, la partita inizierà automaticamente.", buttons: false}});
    });
  }

  handleAccept = () => {
    this.handleSend({type: 'confirm', content: true});
    this.setState({alertMess: {variant: 'none'}, play: true, turn: true});
  }

  handleRefuse = () => {
    this.handleSend({type: 'confirm', content: false});
    conn.close();
  }

  render() {

    let mainComponent;

    if (this.state.login) {
      if (this.state.play)
        mainComponent = <>
                          <div className='d-flex justify-content-center' style={{width: '80%'}}>
                            <Forza4 turn={this.state.turn} board={this.state.board} onMove={(e) => this.handleMove(e)}/>
                            <Chat turn={this.state.turn} messages={this.state.messages} onSend={(obj) => this.handleSend(obj)}/>
                          </div>
                          <Button className='m-3' variant='outline-danger' onClick={() => {
                            conn.close();
                          }}>Abbandona</Button>
                        </>;
      else
        mainComponent = <>
                          <Setup yourId={peer.id} onPlay={() => this.handlePlay()}/>
                          <Button className='m-3' variant="danger" onClick={() => {
                            this.setState({login: null});
                            peer.close();
                          }}>Esci</Button>
                        </>;
    }
    else if (this.state.signIn)
      mainComponent = <>
                        <SignIn onBackFromSignIn={() => this.handleBackFromSignIn()} onSignIn={() => this.handleSignIn()}/>
                        <Button className='m-3' variant='secondary' onClick={() => {this.setState({signIn: false})}}>Torna indietro</Button>
                      </>;
    else
      mainComponent = <>
                        <Login onLogin={() => this.handleLogin()}/>
                        <Button className='m-3' variant='secondary' onClick={() => {this.setState({signIn: true})}}>Registrati</Button>
                      </>;

    return (
      <>
        <header className="App-header">
          <AlertDismissible
            alertMess={this.state.alertMess}
            onClose={this.handleCloseAlert}
            onAccept={this.handleAccept}
            onRefuse={this.handleRefuse}
          />
          {mainComponent}
        </header>
      </>
    );
  }
}

export default App;
