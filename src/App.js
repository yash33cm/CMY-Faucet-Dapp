import { useEffect, useState } from "react";
import "./App.css";
import getContract from "./ethereum/Faucet";
import { ethers } from "ethers";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState("");
  const [fcContract, setfcContract] = useState();
  const [success, setSuccess] = useState("");
  const [fail, setfail] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getConnectedAccounts();
    getChangedAccounts();
  }, [walletAddress]);

  const getChangedAccounts = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        window.ethereum.on("accountsChanged", (accounts) => {
          setWalletAddress(accounts[0]);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setWalletAddress("");
      console.log("please install metamask");
    }
  };

  const getConnectedAccounts = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        // const accounts = await window.ethereum.request({
        //   method: "eth_accounts",
        // });
        // console.log(accounts[0]);

        /*** using ethers ***/
        /*get provider*/
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setfcContract(getContract(provider));
        /* setting wallet address */
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("please install metamask");
    }
  };
  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* traditional way */
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // console.log(accounts[0]);

        /*** using ethers ***/
        /*get provider*/
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setfcContract(getContract(provider));
        /* setting wallet address */
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("please install metamask");
    }
  };

  const handleRequestToken = async () => {
    setSuccess("");
    setfail("");
    try {
      const ContractwithSigner = fcContract.connect(signer);
      const resp = await ContractwithSigner.requestToken();
      setSuccess("Token sent to your wallet address");
      setTransactionData(resp.hash);
    } catch (error) {
      setfail(error.message);
    }
  };
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen">
      <div className="h-16 bg-black bg-opacity-30 flex items-center justify-between ">
        <div className="flex items-center justify-center hover:cursor-pointer">
          <img
            className="rounded-full h-14 object-contain p-1 ml-5"
            src="/logo/CMY.jpg"
            alt="CMY"
          />
          <h1 className="text-white font-bold text-2xl ml-2">CMY-FAUCET</h1>
        </div>

        <div>
          <button
            onClick={connectWallet}
            className="bg-transparent text-white mr-3 px-3 py-2 rounded-lg font-bold  border-2 border-white hover:bg-white hover:text-black hover:transition-all hover:ease-in"
          >
            {walletAddress && walletAddress.length > 0
              ? `${walletAddress.substring(0, 10)}...${walletAddress.substring(
                  39
                )}`
              : "Connect to wallet"}
          </button>
        </div>
      </div>
      <div className="flex h-3/4 items-center justify-center">
        <div className="w-1/2  h-auto bg-white rounded-lg flex flex-col">
          <div className="flex flex-col items-center justify-center w-full border-b-2 border-gray-300 p-5 mt-7">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter wallet address to transfer CMY Token"
                defaultValue={walletAddress}
                className="w-[500px] h-10 outline-none px-2 py-1 border-2 border-gray-300 text-black  rounded-md "
              />
              <button
                onClick={handleRequestToken}
                className="ml-3 bg-[#455ACF] text-white font-bold rounded-md text-md p-2"
              >
                Send CMY
              </button>
            </div>
            <div className="w-full justify-center h-auto my-3">
              {success && (
                <div className="text-green-600 text-center">{success}</div>
              )}
              {fail && <div className="text-red-600 text-center">{fail}</div>}
            </div>
          </div>

          <div className="mt-4 p-5 mb-7">
            <div className="h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-tl-lg rounded-tr-lg">
              <h3 className="text-center pt-1 text-white text-xl font-bold">
                Your Transaction
              </h3>
            </div>
            <div className="border-2  border-b-gray-300 border-r-gray-300 border-l-gray-300 rounded-bl-lg rounded-br-lg p-1">
              <p>{transactionData ? `${transactionData}` : "--"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
