import Link from "next/link";
import Image from "next/image";
import { NavItem } from "src/types";
import UserDropdown from "./UserDropdown";

const Header = ({ items }: { items: NavItem[] }) => {
  return (
    <header className="flex w-full items-center justify-between bg-yello-theme p-4">
      <div className="flex items-center">
        <Image
          src="/flindersuni_main_logo_black.png"
          alt="Flinders University Logo"
          width={100}
          height={40}
          className="mr-4"
        />
        <nav className="flex space-x-4 text-black">
          {items.map((item) => (
            <Link href={item.href} key={item.href} className="flex items-center space-x-1">
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <UserDropdown />
    </header>
  );
};

export default Header;
