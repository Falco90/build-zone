import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import factoryABI from "../../abis/factoryABI.json";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress, factoryAddress } from "../../config";
import { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Create = () => {
  const [zones, setZones] = useState<string[]>([]);

  const create = async () => {
    console.log("Hello");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    console.log(contract, signer);
    const tx = await contract.deployAndInitialize();
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
  };

  const getZones = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
    const response = await contract.getZones();
    setZones(response);
    console.log(zones);
    // const receipt = await tx.wait();
    // console.log(receipt);
  };

  useEffect(() => {
    getZones();
  }, []);

  const renderZones = () => {
    return (
      <ul className="w-full font-mono-general">
        {zones.map((zone, index) => {
          return (
            <div>
              <li
                className="my-1 flex flex-row p-2 items-center justify-between"
                key={index}
              >
                <p>{zone}</p>
                <a href={`/zones/${zone}`}>
                  <button>
                    <FaArrowAltCircleRight className="text-xl" />
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
        <p>My Zones:</p>
        {renderZones()}
      </div>
      <button className="rounded p-2 bg-white" onClick={() => create()}>
        Create Zone
      </button>
    </div>
  );
};

export default Create;
