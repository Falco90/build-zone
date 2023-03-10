import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "../../abis/contractABI.json";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import Upload from "./upload";
import { FaEye, FaKey, FaTrash, FaEyeSlash, FaFile } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type File = {
  cid: string;
  url: string;
};

const Files = ({ contractAddress }) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    console.log("FILES: ", contractAddress);
    getCids();
  }, []);

  const getCids = async () => {
    console.log("contract: ", contractAddress);
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

    const fileType = "image/jpeg";
    try {
      const decrypted = await lighthouse.decryptFile(
        cid,
        keyObject.data.key,
        fileType
      );

      const url = URL.createObjectURL(decrypted);

      const newFiles: File[] = [...files];
      newFiles[index].url = url;
      setFiles(newFiles);
      toast.success("Succes");
    } catch (error) {
      console.log("Error", error);
      toast.warning("failed");
    }
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

  const renderList = () => {
    return (
      <ul className="w-full font-mono-general">
        {files.map((file, index) => {
          return (
            <div key={index}>
              <li
                className="my-1 flex flex-row p-2 items-center justify-between"
                
              >
                <FaFile />
                <p className="px-2 text-md text-[#2F3C7E]">{file.cid}</p>
                <div className="flex flex-row gap-2">
                  <button
                    className="border border-[#2F3C7E] rounded p-2 text-sm hover:bg-[#2F3C7E] hover:text-[#FBEAEB]"
                    onClick={() => decrypt(file.cid, index)}
                  >
                    <FaKey />
                  </button>
                  <a href={file.url} target="_blank">
                    <button
                      className={
                        file.url
                          ? "border border-[#2F3C7E] rounded p-2 text-sm hover:bg-[#2F3C7E] hover:text-[#FBEAEB]"
                          : "p-2 rounded text-sm border-gray-500"
                      }
                      disabled={!file.url ? true : false}
                    >
                      {!file.url ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </a>
                  <button
                    className="border border-[#2F3C7E] rounded p-2 text-sm hover:bg-[#2F3C7E] hover:text-[#FBEAEB]"
                    onClick={() => removeFile(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
              <hr className="text-[#2F3C7E]" />
            </div>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white-100 p-5 w-[750px] rounded-xl border-double border-[#2F3C7E] border-4">
      <div className="flex flex-row w-full justify-between p-2 items-center mb-4">
        <p className="text-lg font-[#2F3C7E] font-mono-general">Files:</p>
        <Upload contractAddress={contractAddress} />
      </div>
      {renderList()}
    </div>
  );
};

export default Files;
