import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress } from "../../config";
import { Popup } from "reactjs-popup";
import { FaFileUpload } from "react-icons/fa";

const Upload = () => {
  const addFile = async (cid: string) => {
    console.log(cid);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.addCid(cid);
    console.log(response);
  };

  const encryptionSignature = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  //   const progressCallback = (progressData: any) => {
  //     let percentageDone =
  //       100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  //     console.log(percentageDone);
  //   };

  const deployEncrypted = async (e: any) => {
    console.log(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY);
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
      sig.signedMessage
      //   progressCallback
    );
    console.log(response);
    applyAccessConditions(response.data.Hash);
    addFile(response.data.Hash);
  };

  const applyAccessConditions = async (cid: string) => {
    const conditions = [
      {
        id: 1,
        chain: "Hyperspace",
        method: "getMember",
        standardContractType: "Custom",
        contractAddress: contractAddress,
        returnValueTest: {
          comparator: "==",
          value: "true",
        },
        parameters: [":userAddress"],
        inputArrayType: ["address"],
        outputType: "bool",
      },
    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );
    console.log("Access controls applied: ", response);
  };

  return (
    <div className="flex flex-row">
      <Popup
        trigger={
          <button className="border bg-[#2F3C7E] text-[#FBEAEB] rounded p-2 text-xl hover:bg-[#2F3C7E] hover:text-[#FBEAEB]">
            <FaFileUpload />
          </button>
        }
        position="center center"
        modal
      >
        <div className="bg-[#2F3C7E] text-[#FBEAEB] rounded-lg p-8 flex flex-col text-center w-[600px] items-center font-mono-general">
          <h2 className="text-lg">Add File</h2>
          <hr className="border border-white w-full my-4" />
          <p className="mb-4 text-left">
            Choose a file to upload.This file will be encrypted and can only be decrypted by members of
            this Zone. This is a 3 step process:
          </p>
          <ul className="text-left my-2">
            <li>1. Upload file with encryption</li>
            <li>2. Add access controls for this Zone</li>
            <li>3. Add CID to this Zone's smart contract</li>
          </ul>
          <p>

          </p>
          <input
            className="form-control
          block
          w-full
          text-sm
          text-black
          rounded
          transition
          ease-in-out
          bg-white
          p-2
          m-0
          w-[300px]
          mt-6"
            onChange={(e) => deployEncrypted(e)}
            type="file"
          />
        </div>
      </Popup>
    </div>
  );
};

export default Upload;
