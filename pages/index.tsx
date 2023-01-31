import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import Web3Modal from "web3modal";
import { useState } from "react";
import Admin from "../components/admin";
import Files from "../components/files";
import contractABI from "../abis/contractABI.json";
import Members from "../components/members";
import { contractAddress } from "../config";

export default function Home() {
  const [fileURL, setFileURL] = useState<string>("");
  const [encryptedCID, setEncryptedCID] = useState("");
  const [CID, setCID] = useState<string>("");

  const deploy = async (e: any) => {
    // Push file to lighthouse node
    const output = await lighthouse.upload(
      e,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      progressCallback
    );
    console.log("File Status:", output);
    /*
      output:
        {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setCID(output.data.Hash);
  };

  const sign_auth_message = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };

  const applyAccessConditions = async () => {
    const cid = encryptedCID;

    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "Hyperspace",
        method: "get",
        standardContractType: "Custom",
        contractAddress: "0x42AD3aE0B79Fa253ab732eba8FCF38864Ad4abf0",
        returnValueTest: {
          comparator: "==",
          value: "1",
        },
        parameters: [":userAddress"],
        inputArrayType: ["address"],
        outputType: "uint256",
      },
    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    /*
      accessCondition(publicKey, cid, signedMessage, conditions, aggregator)
        Parameters:
          publicKey: owners public key
          CID: CID of file to decrypt
          signedMessage: message signed by owner of publicKey
          conditions: should be in format like above
          aggregator: aggregator to apply on conditions
    */
    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );
    console.log(response);
  };

  /* Decrypt file */
  const decrypt = async () => {
    // Fetch file encryption key
    const cid = encryptedCID; //replace with your IPFS CID
    console.log("Encrypted CID: ", encryptedCID);
    const { publicKey, signedMessage } = await sign_auth_message();
    console.log("public key: ", publicKey, "signed message: ", signedMessage);
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    /*
      Response: blob
    */

    // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
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

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  /* Deploy file along with encryption */
  const deployEncrypted = async (e: any) => {
    console.log(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY);
    /*
       uploadEncrypted(e, publicKey, accessToken, uploadProgressCallback)
       - e: js event
       - publicKey: wallets public key
       - accessToken: your api key
       - signedMessage: message signed by the owner of publicKey
       - uploadProgressCallback: function to get progress (optional)
    */
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
      sig.signedMessage,
      progressCallback
    );
    console.log(response);
    setEncryptedCID(response.data.Hash);
    addFile(response.data.Hash);
    /*
      output:
        {
          Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
          Size: "318557",
          Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
        }
      Note: Hash in response is CID.
    */
  };

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

  return (
    <div className="flex flex-col items-center bg-gray-200">
      <h1 className="text-3xl">Safe Build Zone</h1>
      <div className="bg-gray-100 p-5">
        {/* <p>Upload encrypted file</p> */}

        <input
          className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          onChange={(e) => deployEncrypted(e)}
          type="file"
        />
        <button
          className="bg-yellow-100 rounded p-2"
          onClick={() => applyAccessConditions()}
        >
          Apply Access Control
        </button>
      </div>
      {/* <div>
        <p>Upload normal file</p>
        {CID}

        <input onChange={(e) => deploy(e)} type="file" />
      </div> */}
      <button onClick={() => decrypt()}>decrypt</button>
      {fileURL ? (
        <a href={fileURL} target="_blank">
          viewFile
        </a>
      ) : null}
      <Admin />
      <Files />
      <Members />
    </div>
  );
}
