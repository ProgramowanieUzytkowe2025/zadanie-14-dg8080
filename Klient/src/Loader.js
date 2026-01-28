import { createContext, useState, useContext } from 'react';

const loaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <loaderContext.Provider value={{ setLoading }}>
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          justifyContent: 'center', alignItems: 'center', color: 'white'
        }}>
          <h1>Wczytywanie...</h1>
        </div>
      )}
      {children}
    </loaderContext.Provider>
  );
};

export const useLoader = () => useContext(loaderContext);