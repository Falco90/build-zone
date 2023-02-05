import Files from "../../components/files";
import Members from "../../components/members";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/header";

export default function Zone() {
  const [contractAddress, setContractAddress] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    console.log(router);
    setContractAddress(router.asPath.substring(router.asPath.lastIndexOf("/") + 1));
    console.log("PARENT: ", contractAddress)
  }, []);

  return (
    <div className="flex flex-col items-center">
        <Header />
      <div className="flex flex-row gap-10">
        <Files  />
        <Members />
      </div>
    </div>
  );
}
