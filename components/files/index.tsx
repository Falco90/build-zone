import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { contractAddress } from "../../config";
import Upload from "./upload";

type File = {
  cid: string;
  url: string;
};

const Files = () => {
  const [files, setFiles] = useState<File[]>([]);

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
    const { publicKey, signedMessage } = await sign_auth_message();
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);

    const url = URL.createObjectURL(decrypted);

    const newFiles: File[] = [...files];
    newFiles[index].url = url;
    setFiles(newFiles);
  };

  const removeFile = async (index: number) => {
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
                className="my-1 flex flex-row gap-2 p-2 items-center justify-between"
                key={index}
              >
                <p className="px-2 text-sm">{file.cid}</p>
                <div className="flex flex-row gap-2">
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
                </div>
              </li>
              <hr />
            </div>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-gray-100 p-5 w-[750px]">
      <div className="flex flex-row w-full justify-between p-2 items-center mb-4">
        <p className="font-bold">Files:</p>
        <button className="rounded p-2 bg-orange-200 text-sm">Add file</button>
      </div>
      {renderList()}
    </div>
  );
};

export default Files;
