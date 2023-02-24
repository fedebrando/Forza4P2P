DROP DATABASE IF EXISTS Forza4;
CREATE DATABASE Forza4;
USE Forza4;

CREATE TABLE Peer
(
	Username VARCHAR(15) NOT NULL CHECK(Username <> ''),
    PswHash CHAR(128) NOT NULL CHECK(PswHash <> ''),
    PRIMARY KEY (Username)
);