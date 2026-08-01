import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';

export default function Layout() {
  return <>
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 container mx-auto md:w-6/12 w-8/12">
        <Outlet />
      </main>

      <Footer />
    </div>
  </>
  
}
