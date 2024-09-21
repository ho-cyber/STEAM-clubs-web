import React from 'react';
import './STEAMLoader.css'; // Import the CSS file

const Loader = () => {
  return (
    <div className="steam-loader">
      <div className="gear-container">
        <div className="gear gear1"></div>
        <div className="gear gear2"></div>
        <div className="gear gear3"></div>
      </div>
      <div className="star-container">
        <div className="star star1"></div>
        <div className="star star2"></div>
        <div className="star star3"></div>
      </div>
    </div>
  );
};

export default Loader;
