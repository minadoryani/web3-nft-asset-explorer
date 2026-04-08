import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const client = createThirdwebClient({
  clientId: "52cac541a8362f85f0322edc155e84e0",
});

const CONTRACT_ADDRESS = "0xfd8141d3E008ed2e9aeB90aeBF6C96d2D426Fd30";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [nfts, setNfts] = useState([]);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [transferTo, setTransferTo] = useState("");
  const [transferTokenId, setTransferTokenId] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const loadWallet = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Wallet:", error);
      }
    };

    loadWallet();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress("");
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (!walletAddress) {
      setEthBalance("");
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2.2/${walletAddress}/balance?chain=sepolia`,
          {
            headers: {
              "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
            },
          }
        );

        const data = await response.json();

        if (data?.balance) {
          setEthBalance(ethers.formatEther(data.balance));
        } else {
          setEthBalance("0");
        }
      } catch (error) {
        console.error("Fehler beim Laden der ETH-Balance:", error);
        setEthBalance("0");
      }
    };

    fetchBalance();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      setTokens([]);
      return;
    }

    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/tokens?chain=sepolia`,
          {
            headers: {
              "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
            },
          }
        );

        const data = await response.json();
        setTokens(data.result || []);
      } catch (error) {
        console.error("Fehler beim Laden der ERC20-Tokens:", error);
        setTokens([]);
      }
    };

    fetchTokens();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      setNfts([]);
      return;
    }

    const fetchNFTs = async () => {
      try {
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2.2/${walletAddress}/nft?chain=sepolia&format=decimal&media_items=true`,
          {
            headers: {
              "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
            },
          }
        );

        const data = await response.json();
        setNfts(data.result || []);
      } catch (error) {
        console.error("Fehler beim Laden der NFTs:", error);
        setNfts([]);
      }
    };

    fetchNFTs();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const sentResponse = await fetch(
          `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "alchemy_getAssetTransfers",
              params: [
                {
                  fromBlock: "0x0",
                  toBlock: "latest",
                  fromAddress: walletAddress,
                  category: ["external", "erc20", "erc721", "erc1155"],
                  maxCount: "0x5",
                  withMetadata: true,
                },
              ],
            }),
          }
        );

        const sentData = await sentResponse.json();

        const receivedResponse = await fetch(
          `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 2,
              method: "alchemy_getAssetTransfers",
              params: [
                {
                  fromBlock: "0x0",
                  toBlock: "latest",
                  toAddress: walletAddress,
                  category: ["external", "erc20", "erc721", "erc1155"],
                  maxCount: "0x5",
                  withMetadata: true,
                },
              ],
            }),
          }
        );

        const receivedData = await receivedResponse.json();

        const sentTransfers = sentData.result?.transfers || [];
        const receivedTransfers = receivedData.result?.transfers || [];

        const mergedTransfers = [...sentTransfers, ...receivedTransfers];

        const uniqueTransfers = mergedTransfers.filter(
          (tx, index, self) =>
            index ===
            self.findIndex(
              (item) =>
                item.hash === tx.hash &&
                item.from === tx.from &&
                item.to === tx.to &&
                String(item.value) === String(tx.value)
            )
        );

        uniqueTransfers.sort((a, b) => {
          const dateA = a.metadata?.blockTimestamp
            ? new Date(a.metadata.blockTimestamp).getTime()
            : 0;
          const dateB = b.metadata?.blockTimestamp
            ? new Date(b.metadata.blockTimestamp).getTime()
            : 0;
          return dateB - dateA;
        });

        setTransactions(uniqueTransfers.slice(0, 5));
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  const mintNFT = async () => {
    if (!window.ethereum) {
      alert("MetaMask ist nicht installiert");
      return;
    }

    if (!name || !imageUrl) {
      alert("Bitte Name und Bild-URL eingeben");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const abi = [
        "function mintNFT(address to, string memory tokenURI) public returns (uint256)",
      ];

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const metadata = {
        name: name,
        image: imageUrl,
        description: "NFT aus Teilprüfung 4",
      };

      const tokenURI = `data:application/json;base64,${btoa(
        JSON.stringify(metadata)
      )}`;

      const tx = await contract.mintNFT(walletAddress, tokenURI);
      await tx.wait();

      alert("NFT wurde erfolgreich erstellt");
      setName("");
      setImageUrl("");
    } catch (error) {
      console.error("Fehler beim Minten:", error);
      alert("Fehler beim Minten");
    }
  };

  const transferNFT = async () => {
    if (!window.ethereum) {
      alert("MetaMask ist nicht installiert");
      return;
    }

    if (!transferTo || transferTokenId === "") {
      alert("Bitte Empfänger-Adresse und Token ID eingeben");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const abi = [
        "function transferNFT(address from, address to, uint256 tokenId) public",
      ];

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.transferNFT(
        walletAddress,
        transferTo,
        transferTokenId
      );

      await tx.wait();

      alert("NFT wurde erfolgreich übertragen");
      setTransferTo("");
      setTransferTokenId("");
    } catch (error) {
      console.error("Fehler beim Übertragen:", error);
      alert("Fehler beim Übertragen des NFTs");
    }
  };

  return (
    <ThirdwebProvider client={client}>
      <div style={{ padding: "40px" }}>
        <h1>Mina Doryani - Teilprüfung 4</h1>

        <ConnectButton client={client} />

        <p>Verbundene Wallet: {walletAddress || "Keine Wallet verbunden"}</p>

        <h2>ETH Balance</h2>
        <p>{walletAddress ? `${ethBalance} ETH` : "Bitte Wallet verbinden"}</p>

        <h2>ERC20 Tokens</h2>
        {!walletAddress ? (
          <p>Bitte Wallet verbinden</p>
        ) : tokens.length === 0 ? (
          <p>Keine Tokens gefunden</p>
        ) : (
          tokens.map((token, index) => (
            <div key={index}>
              <p>
                {token.name} ({token.symbol}) -{" "}
                {token.balance_formatted ? token.balance_formatted : token.balance}
              </p>
            </div>
          ))
        )}

        <h2>NFTs</h2>
        {!walletAddress ? (
          <p>Bitte Wallet verbinden</p>
        ) : nfts.length === 0 ? (
          <p>Keine NFTs gefunden</p>
        ) : (
          nfts.map((nft, index) => {
            let parsedMetadata = null;

            try {
              parsedMetadata =
                typeof nft.metadata === "string"
                  ? JSON.parse(nft.metadata)
                  : nft.metadata;
            } catch (error) {
              parsedMetadata = null;
            }

            const imageUrlFromMetadata =
              parsedMetadata?.image ||
              nft.media?.media_collection?.high?.url ||
              nft.media?.media_collection?.medium?.url ||
              nft.media?.media_collection?.low?.url ||
              "";

            return (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p>Name: {parsedMetadata?.name || nft.name || "NFT ohne Namen"}</p>
                <p>Token ID: {nft.token_id}</p>
                <p>Contract: {nft.token_address}</p>
                {imageUrlFromMetadata && (
                  <img
                    src={imageUrlFromMetadata}
                    alt="NFT"
                    width="150"
                    style={{ display: "block", marginTop: "10px" }}
                  />
                )}
              </div>
            );
          })
        )}

        <h2>Letzte Transaktionen</h2>
        {!walletAddress ? (
          <p>Bitte Wallet verbinden</p>
        ) : transactions.length === 0 ? (
          <p>Keine Transaktionen gefunden</p>
        ) : (
          transactions.map((tx, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p>Hash: {tx.hash}</p>
              <p>Von: {tx.from || "Nicht verfügbar"}</p>
              <p>An: {tx.to || "Nicht verfügbar"}</p>
              <p>Wert: {tx.value ? `${tx.value} ETH` : "0 ETH"}</p>
              <p>
                Zeitstempel:{" "}
                {tx.metadata?.blockTimestamp
                  ? new Date(tx.metadata.blockTimestamp).toLocaleString()
                  : "Kein Zeitstempel verfügbar"}
              </p>
            </div>
          ))
        )}

        <h2>NFT erstellen</h2>

        <input
          type="text"
          placeholder="Name des NFTs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Bild URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <br />
        <br />

        <button onClick={mintNFT}>NFT minten</button>

        <h2>NFT übertragen</h2>

        <input
          type="text"
          placeholder="Empfänger-Adresse"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Token ID"
          value={transferTokenId}
          onChange={(e) => setTransferTokenId(e.target.value)}
        />

        <br />
        <br />

        <button onClick={transferNFT}>NFT übertragen</button>
      </div>
    </ThirdwebProvider>
  );
}

export default App;