import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Container, Col, Row } from 'react-bootstrap';
import ConnectButton from './components/ConnectButton';
import { type BaseError, useReadContracts } from 'wagmi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import backgroundImage from './images/background.jpg'; // Make sure this path is correct
import quackoSoccer from './images/quackosoccer.jpg';
import quackoTennis from './images/quackotennis.jpg';
import quackoShred from './images/quckoshred.jpg'
import MintNFT from './components/MintNFT';
import quackoABI from './abi/QuackoNFT.json';

function App() {

    return (
        <div className="App">
            <div style={{ backgroundImage: `url(${backgroundImage})` }} className="background-image"></div>


            <div className="connect-button-container">
                <ConnectButton />
            </div>

            {/* Row of Three Cards */}
            <Container className="my-5 py-5">
                <MintNFT />
                <Row className="g-4 justify-content-center">
                    {[quackoSoccer, quackoTennis, quackoShred].map((imageSrc, index) => (
                        <Col key={index} md={4}>
                            <Card className="custom-card">
                                <Card.Img variant="top" src={imageSrc} className="card-image" />
                                <Card.Body>

                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default App;