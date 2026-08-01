import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className=" bg-[#D9CFC7] text-white w-full mx-auto  border border-default ">
  <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
    <span className="block text-sm text-black text-center">
      © 2026{" "}
      <Link to={'/'} className="hover:underline">
        Social App™
      </Link>
      . All Rights Reserved.
    </span>
  </div>
</footer>

}
