// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import App from './App';
import React from 'react';

import { render, screen } from '@testing-library/react';
import SignIn from './components/signIn';
import Setup from './components/setup';
import Forza4 from './components/forza4';
import Login from './components/login' ;
import AlertDismissible from './components/alertDismissible';
import Message from './components/message';
import Chat from './components/message';

test('renders the landing page', () => {

    render(<App />);

    expect(screen.getByRole("button", { name: "Entra" })).toBeEnabled();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('renders the login page', () => {

    render(<Login />);

    expect(screen.getByRole("button", { name: "Entra" })).toBeEnabled();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('renders the sign in page', () => {

    render(<SignIn />);
    
    expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrati" })).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('check sign in buttons functions', () => {

    render(<SignIn />);
    
    expect(screen.getByRole("button", { name: "Registrati" })).toBeDisabled();
  });

  test('renders the home page', () => {

    render(<Setup />);
    
    expect(screen.getByRole("textbox", { name: "Il tuo ID" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "ID del giocatore avversario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invita" })).toBeEnabled();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('renders the message', () => {

    let message = {isOpponent: true, name: "", when: "", text: ""};
    render(<Message message = {message} />);

    
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('renders the alert dismissable', () => {

    let alertMess = {variant: 'primary', heading: 'Benvenuto.', text: 'Effettua il login o registrati.', buttons: false};
    render(<AlertDismissible alertMess={alertMess}/>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test('renders the chat', () => {

    let message = {isOpponent: true, name: "", when: "", text: ""};
    render(<Chat turn={true} message={message}/>);

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test('conncetion to api and get request', () => {

    let username = "fedebrando";

    fetch('http://localhost:4000/peer/' + username)
      .then((data) => {
          expect(data != null);
      })
  });

  test('conncetion to api and put request', () => {

    fetch('http://localhost:4000/newpeer/')
      .then((data) => {
          expect(data.status == 201);
      })
  });
