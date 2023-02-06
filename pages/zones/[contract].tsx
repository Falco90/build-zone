import Files from "../../components/files";
import Members from "../../components/members";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { MoonLoader } from "react-spinners";

export default function Zone() {
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
      <Footer />
    </div>
  );
}
