import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RasyList } from './RasyList';
import { RasaFormularz } from './RasaFormularz';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderProvider } from './Loader';

export default function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <div className="App">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<RasyList />} />
            <Route path="/form" element={<RasaFormularz />} />
            <Route path="/form/:id" element={<RasaFormularz />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoaderProvider>
  );
}
