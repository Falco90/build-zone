import Files from "../../components/files";
import Members from "../../components/members";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { MoonLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Zone() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center h-[100vh]">
      <Header />
      {router.isReady ? (
        <div className="flex flex-row gap-10">
          <Files contractAddress={router.query.contract} />
          <Members contractAddress={router.query.contract} />
        </div>
      ) : (
        <MoonLoader />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </div>
  );
}
