import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import factoryABI from "../../abis/factoryABI.json";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress, factoryAddress } from "../../config";

const Create = () => {
  const create = async () => {
    console.log("Hello")
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    console.log(contract, signer)
    const tx = await contract.deployAndInitialize();
    console.log(tx)
    const receipt = await tx.wait()
    console.log(receipt)
  };

  return (
    <div>
      <button className="rounded p-2 bg-white" onClick={() => create()}>
        Create
      </button>
    </div>
  );
};

export default Create;
