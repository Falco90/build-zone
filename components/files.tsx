import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../abis/contractABI.json";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress } from "../config";

type File = {
  cid: string;
  url: string;
};

const Files = () => {
  const [files, setFiles] = useState<File[]>([]);

  // const contractAddress = "0x42AD3aE0B79Fa253ab732eba8FCF38864Ad4abf0";
  const getCids = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const cids = await contract.getFiles();
    const newFiles = cids.map((cid: string) => {
      return {
        cid: cid,
        url: "",
      };
    });
    setFiles(newFiles);
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

  const decrypt = async (cid: string, index: number) => {
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
    const newFiles: File[] = [...files];
    newFiles[index].url = url;
    setFiles(newFiles);
    console.log(files);

    // setFileURL(url);
  };

  const removeFile = async (index: number) => {
    console.log(index);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const response = await contract.removeCid(index);
    console.log(response);
  };

  useEffect(() => {
    getCids();
  }, []);

  const renderList = () => {
    return (
      <ul className="w-full">
        {files.map((file, index) => {
          return (
            <div>
              <li
                className="my-1 flex flex-row gap-2 p-2 items-center"
                key={index}
              >
                <p className="px-2">{file.cid}</p>
                <button
                  className="bg-purple-300 rounded p-2 text-sm"
                  onClick={() => decrypt(file.cid, index)}
                >
                  Decrypt
                </button>
                <a href={file.url} target="_blank">
                  <button
                    className="bg-pink-300 rounded p-2 text-sm"
                    disabled={!file.url ? true : false}
                  >
                    View
                  </button>
                </a>
                <button
                  className="bg-orange-300 rounded p-2 text-sm"
                  onClick={() => removeFile(index)}
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
    <div className="bg-gray-100 p-5 w-[700px]">
      <h3>Files:</h3>
      {renderList()}
    </div>
  );
};

export default Files;
