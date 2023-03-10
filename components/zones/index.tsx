import { ethers } from "ethers";
import Web3Modal from "web3modal";
import factoryABI from "../../abis/factoryABI.json";
import { factoryAddress } from "../../config";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaDotCircle } from "react-icons/fa";

const Create = () => {
  const [zones, setZones] = useState<string[]>([]);

  const create = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    console.log(contract, signer);
    const tx = await contract.deployAndInitialize();
    const receipt = await tx.wait();
  };

  const getZones = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    const response = await contract.getZones();
    setZones(response);
  };

  useEffect(() => {
    getZones();
  }, []);

  const renderZones = () => {
    return (
      <ul className="w-full font-mono-general">
        {zones.map((zone, index) => {
          return (
            <div key={index}>
              <li className="my-1 flex flex-row p-2 items-center justify-between">
                <FaDotCircle className="text-[#2F3C7E]" />
                <p>{zone}</p>
                <a href={`/zones/${zone}`}>
                  <button className="border border-[#2F3C7E] rounded p-2 text-sm hover:bg-[#2F3C7E] hover:text-[#FBEAEB]">
                    <FaArrowLeft />
                  </button>
                </a>
              </li>
              <hr className="text-[#2F3C7E]" />
            </div>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <div className="bg-white-100 p-5 w-[600px] rounded-xl border-double border-[#2F3C7E] border-4 font-mono-general">
        <div className="flex flex-row w-full justify-between p-2 items-center mb-4">
          <p className="text-lg font-mono-general">My Zones:</p>
          <button
            className="border bg-[#2F3C7E] text-[#FBEAEB] rounded p-2 text-xl hover:bg-[#2F3C7E] hover:text-[#FBEAEB]"
            onClick={() => create()}
          >
            <FaPlus />
          </button>
        </div>
        {renderZones()}
      </div>
    </div>
  );
};

export default Create;
