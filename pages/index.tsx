import Create from "../components/zones";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full">
      <Header />
      <div className="flex flex-row gap-10">
        <div className="bg-white-100 p-5 w-[750px] rounded-xl border-double border-[#2F3C7E] border-4 font-mono-general flex flex-col items-center">
          <h1 className="text-xl mb-4 text-center">
            Welcome to Safe Build Zone!
          </h1>
          <p className="mb-8">
            Here you can create a secure zone for sharing encrypted files with
            your fellow builders, artists, DAO members etc. No databases,
            everything is fully decentralized powered by Filecoin and
            Lighthouse.
          </p>
          <h2>This is how it works:</h2>
          <p>
            Creating a new Zone will deploy a smart contract you and your team.
            As the contract owner you can add members to the contract which can
            decrypt the files.
          </p>
        </div>
        <Create />
      </div>
      <Footer />
    </div>
  );
}
