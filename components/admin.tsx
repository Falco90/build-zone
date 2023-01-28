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
    const response = await contract.addMember("0xEf10921373d3862d48458c0893975eB5ABB994dc", 1);
    console.log(response);
  };

  const removeMember = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeMember(address);
    console.log(response)
  };

  const removeFile = async (index: number) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeFile(index);
    console.log(response)
  };

  return (
    <div>
      <button onClick={() => addMember()}>Add Member</button>
      <button onClick={() => removeMember()}>Remove Member</button>
      <button onClick={() => removeFile(0)}>Remove File</button>
    </div>
  );
};

export default Admin;
