# Tecnologie Internet, Federico Brandini & Federico Putamorsi
# Connect4 PeerJs
### Chat and play with friends
The project was developed for the course of **Tecnologie Internet** course [@Università di Parma](https://www.unipr.it). We're using **PeerJS** and **React** to build a Connect4 game based on WebRTC. 

### PeerJS

We used PeerJs that wraps the browser's WebRTC implementation to provide a complete, configurable, and easy-to-use peer-to-peer connection API. Equipped with nothing but an ID, a peer can create a P2P data or media stream connection to a remote peer.

### User interface

We used the beautiful [React-Boostrap](https://react-bootstrap.github.io/) components to **build our UI**. The library contains most of the UI components a developer will ever need.
 
### Requests to the REST API

We used [Express](https://expressjs.com/) to execute **requests** to the APIs. 

### Password hashing

We decided to use SHA3 512, to avoid saving and transmitting the password relating to the username in plain text.

### Username Microservice
We built a login service using **Node.js** and **Express** which allows you to use your username and password to play. You interface via API and in turn the service interfaces with a SQL db containing the required username and password.


## How to run

Clone the repository:

#### `git clone https://github.com/fedebrando/Forza4P2P`

and install the npm modules like you always do:

#### `npm install`

At first, start PeerJs Server:

#### peerjs you --port 9000 --path /forza4srv 

Then, install and active MySql Server. 

Run peerService.js with:

### node ./peerService.js

At the end, start the application:

#### `npm start`



