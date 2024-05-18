import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useAccount } from 'wagmi';
import ConnectButton from './ConnectButton';
import { type BaseError, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import abi from '../abi/QuackoNFT.json';
import { CardText } from 'react-bootstrap';

function MintNFT() {
    const [totalSupply, setTotalSupply] = useState<bigint>()
    const [mintingLive, setMintingLive] = useState(false)
    const [totalMinted, setTotalMinted] = useState<bigint>()
    const [remainingSupply, setRemainingSupply] = useState<bigint>(0n)

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const quackoContract = {
        address: '0x8551C0507b1702CCEf14646d314c6c8932e944dc',
        abi: abi,
    } as const;

    const { data: contractReads } = useReadContracts({
        contracts: [
            {
                ...quackoContract,
                functionName: 'getTotalSupply',
            },
            {
                ...quackoContract,
                functionName: 'getTotalMinted',
            },
            {
                ...quackoContract,
                functionName: 'isMintLive',
            },
        ],
    });

    useEffect(() => {
        if (contractReads?.length) {
            setTotalSupply(contractReads[0]?.result as bigint)
            setTotalMinted(contractReads[1]?.result as bigint)
            setMintingLive(contractReads[2]?.result as boolean)
        }
    }, [contractReads])

    useEffect(() => {
        if (totalSupply !== undefined && totalMinted !== undefined) {
            setRemainingSupply(totalSupply - totalMinted);
        }
    }, [totalSupply, totalMinted]);

    const [count, setCount] = useState(0);
    const { address } = useAccount();

    const incrementCount = () => {
        if (count < 2 && count < remainingSupply) {
            setCount(count + 1);
        }
    };

    const decrementCount = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const mintNFT = async () => {
        try {
            writeContract({
                address: '0x8551C0507b1702CCEf14646d314c6c8932e944dc',
                abi,
                functionName: 'safeMint',
                args: [address, count],
            });
        } catch (error) {
            console.error('Error minting NFT:', error);
        }
    }

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    return (
        <Card style={{ width: '20rem', alignItems: 'center' }}>
            <Card.Body>
                {address ? (
                    <>
                        <Card.Text>
                            {typeof totalSupply === 'bigint' && typeof remainingSupply === 'bigint' ? (
                                `Total Minted ${totalSupply - remainingSupply} / ${totalSupply}`
                            ) : (
                                'Minted N/A out of N/A' // Or any suitable fallback value
                            )}
                        </Card.Text>
                        <CardText>
                            Max allocation per user: 2
                        </CardText>
                        <div className="d-flex justify-content-center">
                            <Button variant="secondary" size="sm" onClick={decrementCount}>
                                -
                            </Button>
                            <span className="mx-2">{count}</span>
                            <Button variant="secondary" size="sm" onClick={incrementCount}>
                                +
                            </Button>
                        </div>
                        <Button className="mt-3" onClick={mintNFT} disabled={count === 0}>
                            Mint {count} NFT(s)
                        </Button>
                    </>
                ) : (
                    <ConnectButton />
                )}
            </Card.Body>
            {!mintingLive && (
                <Card.Footer className="text-muted">
                    Minting not live
                </Card.Footer>
            )}
            {BigInt(remainingSupply) === 0n && (
                <Card.Footer className="text-danger">
                    Sold out
                </Card.Footer>
            )}
            <Modal show={isPending}>
                <Modal.Body>Minting your NFT(s)...</Modal.Body>
            </Modal>
        </Card>
    );
};

export default MintNFT;
