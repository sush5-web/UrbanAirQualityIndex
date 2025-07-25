import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Map from './components/Map';

const App: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <Map />
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default App;