import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress } from "../../config";

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

  const progressCallback = (progressData: any) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  /* Deploy file along with encryption */
  const deployEncrypted = async (e: any) => {
    console.log(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY);
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
      sig.signedMessage,
      progressCallback
    );
    console.log(response);
    applyAccessConditions(response.data.Hash);
    addFile(response.data.Hash)
  };

  const applyAccessConditions = async (cid: string) => {
    // Conditions to add
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
    <div className="flex flex-row bg-white">
        <p>Upload encrypted file:</p>
      <input
        className="form-control
          block
          w-full
        text-sm
          text-gray-700
          rounded
          transition
          ease-in-out
          m-0"
        onChange={(e) => deployEncrypted(e)}
        type="file"
      />
    </div>
  );
};

export default Upload;
