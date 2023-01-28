import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import Web3Modal from "web3modal";
import { useState } from "react";
import Admin from "../components/admin";

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
        contractAddress: "0xa27bC320252d51EEAA24BCCF6cc003979E485860",
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
    console.log(signedMessage);
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

  return (
    <div className="container flex flex-col p-6">
      <h1 className="text-3xl">Safe Build Zone</h1>
      <div>
        <p>Upload encrypted file</p>

        <input onChange={(e) => deployEncrypted(e)} type="file" />
      </div>
      <div>
        <p>Upload normal file</p>
        {CID}

        <input onChange={(e) => deploy(e)} type="file" />
      </div>
      <div>
        <ul>
          <li className="flex flex-row gap-5">
            <p>File</p> <button onClick={() => decrypt()}>View File</button>
          </li>
          <li className="flex flex-row gap-5">
            <p>File</p> <button onClick={() => decrypt()}>View File</button>
          </li>
          <li className="flex flex-row gap-5">
            <p>File</p> <button onClick={() => decrypt()}>View File</button>
          </li>
          <li className="flex flex-row gap-5">
            <p>File</p> <button onClick={() => decrypt()}>View File</button>
          </li>
        </ul>
      </div>
      <button onClick={() => decrypt()}>decrypt</button>
      <button onClick={() => applyAccessConditions()}>
        Apply Access Control
      </button>
      {fileURL ? (
        <a href={fileURL} target="_blank">
          viewFile
        </a>
      ) : null}
      <Admin />
    </div>
  );
}
