import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import { useEffect, useState } from "react";
import { contractAddress, owner } from "../../config";

const Members = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>("");

  const getMembers = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const members = await contract.getMembers();
    console.log(members);
    setMembers(members);
  };

  const addMember = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.addMember(newMember);
    console.log(response);
  };

  const removeMember = async (address: string) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeMember(address);
    console.log(response);
  };

  useEffect(() => {
    getMembers();
  }, []);

  const renderMembers = () => {
    return (
      <ul>
        {members!.map((member) => {
          return (
            <div>
              <li className="flex flex-row gap-2 items-center my-2">
                <p>{member}</p>
                <button
                  className="bg-red-300 rounded p-2 text-sm"
                  onClick={() => removeMember(member)}
                >
                  Remove
                </button>
              </li>
              <hr />
            </div>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-gray-100 p-5">
      <div className="flex flex-row gap-4">
        <h3 className="text-sm">Members:</h3>
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
        />
        <button onClick={() => addMember()}>Add Member</button>
      </div>
      {renderMembers()}
    </div>
  );
};

export default Members;
