import React, {useEffect} from 'react';
import './App.css';

export default function App() {

  useEffect(() => {
    fetch('https://api.unsplash.com/photos?client_id=DEqHqd-689CYP8Jbq92-ic3kEc74G4XbbTSD-DC_D-U')
      .then(res => res.json())
      .then(data => {

      })
  }, [])

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form>
        <input type="text" placeholder="Search Unsplash..." />
        <button>Search</button>
      </form>

      <div className="image-grid">
        {[...Array(100)].map((_, index) => (
          <div className="image" key={index}>
            <img src="https://placekitten.com/g/1920/1080" alt="Sample" />
          </div>
        ))}
      </div>
    </div>
  );
}
