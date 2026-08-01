import { RouterProvider } from 'react-router-dom';
import './App.css';
import { UserDataProvider } from './context/UserContext';
import { route } from './routes/Router';
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
          <UserDataProvider>
            <Toaster/>
              <RouterProvider router={route}></RouterProvider>
          </UserDataProvider>
    </>
  )
}

export default App
