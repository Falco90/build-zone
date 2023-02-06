import Create from "../components/zones";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full">
      <Header />
      <div className="flex flex-row gap-10">
        <div className="bg-white-100 p-5 w-[750px] rounded-xl border-double border-[#2F3C7E] border-4 font-mono-general flex flex-col items-center">
          <h1 className="text-xl mb-4 text-center font-mono-general text-[#2F3C7E]">
            Welcome to Safe Build Zone!
          </h1>
          <p className="mb-8">
            Here you can create a secure zone for sharing encrypted files with
            your fellow builders, artists, DAO members etcetera. No databases or
            centralized services, everything is fully decentralized powered by
            Filecoin and Lighthouse.storage.
          </p>
          <h2 className="text-xl mb-4 text-[#2F3C7E]">This is how it works:</h2>
          <p className="mb-4">
            For each Zone a new smart contract will be deployed where you as the
            owner can add members to collaborate with. Members can add encrypted
            files to the Zone, which can only be decrypted by other members on the smart contract.
          </p>
          <h2 className="text-xl mt-4 mb-6 text-[#2F3C7E]">
            Happy file sharing!
          </h2>
        </div>
        <Create />
      </div>
      <Footer />
    </div>
  );
}
