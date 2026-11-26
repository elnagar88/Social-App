import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import PageLoader from '../components/UI/PageLoader';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 pt-24 container mx-auto px-4 sm:px-0 sm:w-10/12 md:w-8/12 lg:w-6/12">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
