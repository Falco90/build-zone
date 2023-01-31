import Files from "../components/files";
import Members from "../components/members";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl">Safe Build Zone</h1>
      <div className="flex flex-row gap-10">
        <Files />
        <Members />
      </div>
    </div>
  );
}
