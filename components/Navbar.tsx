import Link from 'next/link';
import Image from 'next/image';

import Logo from '@/public/logo.svg';

interface NavbarProps {
  selectedItem: string | null;
}

const Navbar = ({ selectedItem }: NavbarProps) => {
  return (
    <header className="h-14 flex flex-row items-baseline justify-between px-3 py-2 box-border bg-[#EF233C] text-white">
      <h1 className="text-3xl font-bold">
        <Image src={Logo} alt="Logo" height="32" className="mt-1.5 ml-2.5" />
      </h1>

      <nav>
        <ul className="flex flex-row gap-4">
          <li>
            <Link
              href="/assembly"
              className={selectedItem === 'assembly' ? 'underline' : ''}
            >
              Assembly
            </Link>
          </li>
          <li>
            <Link
              href="/monitoring"
              className={selectedItem === 'monitoring' ? 'underline' : ''}
            >
              Monitoring
            </Link>
          </li>
        </ul>
      </nav>

      <span>Account</span>
    </header>
  );
};

export default Navbar;
