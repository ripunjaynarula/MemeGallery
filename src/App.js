import React, { useEffect, useState } from "react";
// import GITHUBLogo from "./assets/GITHUB-logo.svg";
import "./App.css";

// Constants
const GITHUB_HANDLE = "ripunjaynarula";
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;

const App = () => {
  const TEST_GIFS = [
    "https://media.giphy.com/media/olAik8MhYOB9K/giphy.gif",
    "https://media.giphy.com/media/Zgo2A2oOpbGhQdf09T/giphy.gif",
    "https://media.giphy.com/media/HzX8pvJLdT01oyAIot/giphy.gif",
    "https://media.giphy.com/media/Ry1MOAeAYXvRVQLPw3/giphy.gif",
    "https://media.giphy.com/media/XCrNuIxkoVqQbG55MP/giphy.gif",
    "https://media.giphy.com/media/w9t0aFMjahdxpKKvzN/giphy.gif",

  ];
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter GIF link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.
  
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      {/* This was solely added for some styling fanciness */}
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">Your Meme GIF Gallery</p>
          <p className="sub-text">
            Store your Meme collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {/* We just need to add the inverse here! */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
        {/* <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /> */}
          <button
            className="connect-wallet-button cta-button"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Built by @${GITHUB_HANDLE}`}</button>
        </div>
      </div>
    </div>
  );
};

export default App;
