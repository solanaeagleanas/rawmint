import { useEffect, useState } from "react";
import styled from "styled-components";
import {Avatar } from "@material-ui/core";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import mylogo from "./Logo.png";



import {
  getCandyMachineState,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
 
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);


  const wallet = useAnchorWallet();
 


  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

    })();
  };


 
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
     
  <div>
      {wallet && (
        <h4 style={{fontSize:17,color:"#fdd700"}}>Wallet Address :  {shortenAddress(wallet.publicKey.toBase58() || "")}</h4>
      )}

 
{wallet && <p>Total Available: {itemsAvailable}</p>}

{wallet && <p>Redeemed: {itemsRedeemed}</p>}

{wallet && <p>Remaining: {itemsRemaining}</p>}
      </div>

      
      <div>
  
      </div>
      <div>
      <ConnectButton style={{backgroundColor:"#fdd700",color:"black",width:"100%"}}><b>Connect Wallet</b></ConnectButton>
      
       </div>
      <div>
      </div>
    </main>
  );
};

export default Home;
