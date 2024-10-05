import React from 'react';
import LogoimgTM from '../assets/imagens/logOtesteMaker.png'

const HeaderH = ({ profilePic }) => {
  return (
    <header className="d-flex justify-content-between align-items-center p-3">
      <div className="container_branding d-flex align-items-center">
        <div id="logo_tm">
          <img src={LogoimgTM} alt="Logo Test Maker" className="img-fluid" />
        </div>
        <h1 className="logo-maker">Test Maker</h1>
      </div>
      <div className="profile-icon">
        {profilePic && (
          <img
            src={profilePic}
            alt="Foto do Professor"
            className="rounded-circle"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        )}
      </div>
    </header>
  );
};

export default HeaderH;
