import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar,Avatar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import solana from "./NFT.gif";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import mylogo from "./Logo.png";



import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [numberofmint,setNumber]=useState(1);
  const handleChange=(e:any)=>{
    setNumber( e.target.value);
 }



  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsRemaining,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsRemaining(itemsRemaining);
 
      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        for(var i = 1 ; i <= numberofmint ; i ++){
   
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }}
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:10}}>
      <div style={{display:"flex",flexDirection:"row"}}>
      <Avatar
              alt="Remy Sharp"
              style={{
                width: "60px",
                height: "60px",
                
              }}
              variant="square"
              src={mylogo}
            />
        <span style={{fontSize:35,color:"#fdd700",fontFamily:"Cambria",marginTop:10,marginLeft:10}}>SolanaEagles</span>
      </div>
      <div >
       <Avatar
              alt="Remy Sharp"
              style={{
                width: "160px",
                height: "160px",
                marginTop:10
              }}
              variant="square"
              src={solana}
            />
            </div>
            <br/>
  <div>
      {wallet && (
        <h4 style={{fontSize:17,color:"#fdd700"}}>Wallet Address :  {shortenAddress(wallet.publicKey.toBase58() || "")}</h4>
      )}

      {wallet && <h4 style={{fontSize:17,color:"#fdd700"}}>Balance: {(balance || 0).toLocaleString()} SOL</h4>
}

{wallet &&
  <h4 style={{fontSize:17,color:"#fdd700"}}>Select number of NFTs :</h4>}
     {
  wallet &&
  
<form>
             <input type="radio" value="1" id="1"
               onChange={handleChange} name="number" />
             <label >&nbsp;<span style={{color:"#fdd700"}}>1</span></label>
             <br />

            <input type="radio" value="2" id="2"
              onChange={handleChange} name="number"/>
            <label style={{color:"#fdd700"}} >&nbsp;2</label><br />
            <input type="radio" value="3" id="3"
              onChange={handleChange} name="number"/>
            <label style={{color:"#fdd700"}}>&nbsp;3</label><br />
            <input type="radio" value="4" id="4"
              onChange={handleChange} name="number"/>
            <label style={{color:"#fdd700"}} >&nbsp;4</label><br />
            <input type="radio" value="5" id="5"
              onChange={handleChange} name="number"/>
            <label style={{color:"#fdd700"}} >&nbsp;5</label><br />
            <h4 style={{fontSize:17,color:"#fdd700"}}>You want to mint <span style={{color:"white"}}>{numberofmint}</span> NFTS</h4>
      
         </form>

      
      
      }
   
      </div>

      
      <div>
  
      </div>
      <div>

      <MintContainer >
        {!wallet ? (
          <ConnectButton style={{backgroundColor:"#fdd700",color:"black",width:"100%"}}><b>Connect Wallet</b></ConnectButton>
        ) : (
          <MintButton
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            variant="contained"
            style={{backgroundColor:"#fdd700",color:"black",width:"100%",marginBottom:50}}
          >
            {isSoldOut ? (
              "SOLD OUT"
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                "MINT"
              )
            ) : (
              <Countdown
                date={startDate}
                onMount={({ completed }) => completed && setIsActive(true)}
                onComplete={() => setIsActive(true)}
                renderer={renderCounter}
              />
            )}
          </MintButton>
        )}
      </MintContainer>
      </div>
      <div>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
      </div>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
