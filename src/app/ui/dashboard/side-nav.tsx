import { Brain, PowerIcon } from "lucide-react";
import Link from "next/link";
import NavLinks from "./nav-links";

export default function Sidenav() {
  return (
    <aside className="flex h-full flex-col px-3 py-4 md:px-4">
      <Link href={"/"} className="p-10">
        <div className="flex m-auto justify-center items-center gap-2 w-12 h-12 rounded-xl bg-linear-to-br from-green-700 to-green-500">
          <Brain className="h-10 w-10" color="white" />
        </div>
        <p className="font-bold text-center">Aura AI</p>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-50 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </aside>
  );
}
