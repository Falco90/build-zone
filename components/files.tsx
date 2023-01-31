import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../abis/contractABI.json";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";

const Files = () => {
  const [cids, setCids] = useState<string[]>([]);

  const contractAddress = "0x42AD3aE0B79Fa253ab732eba8FCF38864Ad4abf0";
  const getFiles = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.getFiles();
    setCids(response);
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

  const decrypt = async (cid: string) => {
    // Fetch file encryption key
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
    // setFileURL(url);
  };

  const removeFile = async (index: number) => {
    console.log(index)
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeCid(index);
    console.log(response);
  };

  useEffect(() => {
    getFiles();
  }, []);

  const renderList = () => {
    return (
      <ul className="w-[600px]">
        {cids.map((cid, index) => {
          return (
            <li
              className="bg-white my-1 flex flex-row gap-2 p-2 items-center"
              key={cid}
            >
              <p className="px-2">{cid}</p>
              <button
                className="bg-purple-300 rounded p-2"
                onClick={() => decrypt(cid)}
              >
                Decrypt
              </button>
              <button className="bg-orange-300 rounded p-2" onClick={() => removeFile(index)}>Remove</button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-gray-100 p-5 w-[600px]">
      <h3>Current files:</h3>
      {renderList()}
    </div>
  );
};

export default Files;
