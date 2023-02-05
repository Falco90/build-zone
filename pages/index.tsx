import Create from "../components/create";
import Header from "../components/header";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="flex flex-col items-center">
        <p>
          Welcome to Safe Build Zone. Where you can create a secure zone for
          sharing encrypted files with your fellow builders, artists, DAO
          members etc.
        </p>
        <Create />
      </div>
    </div>
  );
}
