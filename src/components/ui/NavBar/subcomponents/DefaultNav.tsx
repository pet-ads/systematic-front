import NavItem from "./NavItem";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { SiAddthis } from "react-icons/si";
import { GiArchiveRegister } from "react-icons/gi";
import { IoLibrarySharp } from "react-icons/io5";

interface IDefaultNavigation {
  navSize: string;
}

const routes = [
  { path: "/landing", icon: GiArchiveRegister, title: "LandingPage" },
  { path: "/", icon: IoLibrarySharp, title: "My reviews" },
  { path: "/newRevision", icon: SiAddthis, title: "New Revision" },
  { path: "/homepage", icon: FaHome, title: "Homepage" }

];

export default function DefaultNavigation({ navSize }: IDefaultNavigation) {
  return (
    <>
      {routes.map((route, index) => (
        <Link key={index} to={route.path}>
          <NavItem navSize={navSize} icon={route.icon} title={route.title} />
        </Link>
      ))}
    </>
  );
}
