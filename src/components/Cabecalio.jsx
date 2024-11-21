import React, { useState, useEffect } from 'react';
import LogoimgTM from '../assets/imagens/logOtesteMaker.png';

const API_URL = import.meta.env.VITE_API_URL;

const Cabecalio = () => {
  const [profilePic, setProfilePic] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/professor-data`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados do professor:', data);
        
        
        setProfilePic(data.profilePic);
        setUsername(data.username || data.name); 
      } catch (error) {
        console.error('Erro ao buscar dados do professor:', error);
        setError('Erro ao carregar informações do professor');
      }
    };

    fetchProfessorData();
  }, []);

  return (
    <header className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#333' }}>
      <div className="container_branding d-flex align-items-center">
        <div id="logo_tm">
          <img src={LogoimgTM} alt="Logo Test Maker" className="img-fluid" />
        </div>
        <h1 className="logo-maker ms-2">Test Maker</h1>
      </div>

      <div className="d-flex align-items-center">
        {error ? (
          <span className="text-danger me-2">{error}</span>
        ) : (
          <>
            <span className="NomePerfilHeader me-2 text-white"  style={{ fontSize: '1.1rem', fontWeight: '400' }}>
              {username || 'Professor'}
            </span>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Foto do Professor"
                className="rounded-circle"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary"
                style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <i className="bi bi-person-circle" style={{ fontSize: '24px', color: 'white' }}></i>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Cabecalio;
