import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Auth from './components/Auth';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 text-center mt-6 mb-4">
        Sussex-Brighton Uni Marketplace
      </h1>
      <Auth />
    </div>
  );
}

export default App
