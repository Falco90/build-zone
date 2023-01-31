import { ethers } from "ethers";
import contractABI from "../abis/contractABI.json";
import Web3Modal from "web3modal";

const Admin = () => {
  const contractAddress = "0xa27bC320252d51EEAA24BCCF6cc003979E485860";

  const addMember = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log(contract);
    const response = await contract.addMember(
      "0xEf10921373d3862d48458c0893975eB5ABB994dc",
      1
    );
    console.log(response);
  };

  const removeMember = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeMember(
      "0xEf10921373d3862d48458c0893975eB5ABB994dc"
    );
    console.log(response);
  };

  const removeFile = async (index: number) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeFile(index);
    console.log(response);
  };

  return (
    <div className="my-5 w-[500px] flex flex-col items-center bg-gray-100 p-5">
      <h3 className="text-center">Admin Panel:</h3>
      <div className="flex flex-row gap-2 my-2">
        <button
          className="bg-green-300 p-2 rounded-lg"
          onClick={() => addMember()}
        >
          Add Member
        </button>
        <button
          className="bg-blue-300 p-2 rounded-lg"
          onClick={() => removeMember()}
        >
          Remove Member
        </button>
        <button
          className="bg-red-300 p-2 rounded-lg"
          onClick={() => removeFile(0)}
        >
          Remove File
        </button>
      </div>
    </div>
  );
};

export default Admin;
