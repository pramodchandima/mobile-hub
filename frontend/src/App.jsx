import React, { useState } from 'react';
import ClothingStore from "./components/ClothingStore";
import AdminPanel from "./components/AdminPanel";


import BackgroundEffects from './components/common/BackgroundEffects';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <div className="relative z-10">
        {isAdmin ? <AdminPanel /> : <ClothingStore />}
      </div>
    </div>
  );
}

export default App;