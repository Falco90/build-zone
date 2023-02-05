import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import { useEffect, useState } from "react";
import { contractAddress, owner } from "../../config";
import { Popup } from "reactjs-popup";
import { FaUser, FaUserMinus, FaUserPlus } from "react-icons/fa";

const Members = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.addMember(newMember).then(setIsLoading(false));
  };

  const removeMember = async (address: string, index: number) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeMember(address, index);
    console.log(response);
  };

  useEffect(() => {
    getMembers();
  }, []);

  const renderMembers = () => {
    return (
      <ul className="font-mono-general text-sm">
        {members!.map((member, index) => {
          return (
            <div>
              <li
                key={index}
                className="flex flex-row gap-2 items-center my-2 justify-between"
              >
                <FaUser />
                <p className="px-2">{member}</p>
                <button
                  className="border border-[#2F3C7E] rounded p-2 text-sm hover:bg-[#2F3C7E] hover:text-[#FBEAEB]"
                  onClick={() => removeMember(member, index)}
                >
                  <FaUserMinus />
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
    <div className="border-double border-4 border-[#2F3C7E] p-5 rounded-xl w-[500px]">
      <div className="flex flex-row gap-4 justify-between mb-8 items-center py-2">
        <h3 className="font-mono-general text-lg">Members:</h3>
        <Popup
          trigger={
            <button className="border bg-[#2F3C7E] text-[#FBEAEB] rounded p-2 text-xl hover:bg-[#2F3C7E] hover:text-[#FBEAEB]">
              <FaUserPlus />
            </button>
          }
          position="center center"
          modal
        >
          <div className="bg-[#2F3C7E] text-white rounded-lg p-8 flex flex-col text-center w-[600px] items-center font-mono-general">
            <h2 className="text-lg">Add Member</h2>
            <hr className="border border-white w-full my-4"/>
            <p className="mb-6 text-left">
              The member's address will be added to this Zone's smart contract.
              They will be able to decrypt any files that are shared within this
              Zone until the member is removed.
            </p>
            <h2 className="mb-2 text-sm">Enter Ethereum address:</h2>
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="text-black p-2 my-2"
            />
            {!isLoading ? (
              <button
                className="border border-2 bg-white font-bold text-[#2F3C7E] text-sm p-2 rounded mt-4 hover:bg-[#2F3C7E] hover:text-white hover:border-[#fff]"
                onClick={() => addMember()}
              >
                Submit
              </button>
            ) : (
              "loading"
            )}
          </div>
        </Popup>
      </div>
      {renderMembers()}
    </div>
  );
};

export default Members;
