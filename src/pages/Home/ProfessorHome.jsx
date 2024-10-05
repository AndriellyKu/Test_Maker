import React, { useState, useEffect } from "react";
import './ProfessorHome.css';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoimgTM from '../../assets/imagens/logOtesteMaker.png';
import TextRevealCSS from '../../components/TextRevealCSS';
import { Formik, Form, Field } from 'formik';


import background1 from '../../assets/imagens/bg1.webp';
import background2 from '../../assets/imagens/bg2.jpg';
import background3 from '../../assets/imagens/bg3.webp';
import background4 from '../../assets/imagens/bg4.avif';
import background5 from '../../assets/imagens/bg5.avif';
import background6 from '../../assets/imagens/bg6.avif';

const ProfessorHome = () => {
  const [turmas, setTurmas] = useState([]); 
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const [showLoader, setShowLoader] = useState(false); 
  const [profilePic, setProfilePic] = useState(''); 
  const [professorName, setProfessorName] = useState(''); 


  useEffect(() => {
    fetch('/api/professor-data')
      .then((response) => response.json())
      .then((data) => {
        setProfessorName(data.name); 
        setProfilePic(data.profilePic);
      })
      .catch((error) => console.error('Erro ao buscar dados do professor:', error));
  }, []);


  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const deleteTurma = () => {
    setTurmas(turmas.slice(0, -1));
  };

  return (
    <div className="all-all-container">
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
              style={{ width: '50px', height: '50px', objectFit: 'cover', }}
            />
          )}
        </div>
      </header>


      <div className="container d-flex flex-column align-items-center min-vh-100">
        {!showCreateForm && turmas.length === 0 ? (
          <div className="text-center mt-5">
            <i className="bi bi-chalkboard display-1"></i>
            <TextRevealCSS text="Crie sua primeira turma!" className="custom-class" />
            <button className="btn-frt-crt" onClick={toggleCreateForm}>Criar Turma</button>
          </div>
        ) : (
          <>
            {showCreateForm && (
              <div className="card card-criacionado mt-4 p-4">
                <Formik
                  initialValues={{ name: '', turma: '', background: background1 }}
                  onSubmit={(values, { resetForm }) => {
                    setTurmas([...turmas, { ...values, professor: professorName }]);
                    resetForm();
                    setShowCreateForm(false);
                  }}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <h3 className="">Criar Nova Turma</h3>
                      <Field
                        type="text"
                        name="name"
                        className="fundo-cor-cinza "
                        placeholder="Nome da Sala"
                      />
                      <Field
                        type="text"
                        name="turma"
                        className="fundo-cor-cinza"
                        placeholder="Turma"
                      />
                      <label>Escolha uma imagem de fundo:</label>
                      <div className="d-flex mb-3">
                        {[background1, background2, background3, background4, background5, background6].map((bg, index) => (
                          <img
                            key={index}
                            src={bg}
                            alt={`background ${index + 1}`}
                            className={`tub-n-borda img-thumbnail me-2 ${values.background === bg ? 'selected' : ''}`}
                            style={{ width: '100px', cursor: 'pointer' }}
                            onClick={() => setFieldValue('background', bg)}
                          />
                        ))}
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <button type="submit" className="btn-crt">Criar</button>
                        <button type="button" className="btn-cncl" onClick={toggleCreateForm}>Cancelar</button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {turmas.length > 0 && (
              <div className="container mt-4">
                <h2 className="text-center mb-4">Suas Turmas</h2>
                <div className="row g-4">
                  {turmas.map((turma, index) => (
                    <div key={index} className="col-md-3">
                      <div className="card" style={{ backgroundImage: `url(${turma.background})`, backgroundSize: 'cover' }}>
                        <div className="card-criado text-left">
                          {profilePic && (
                            <img
                              src={profilePic}
                              alt="Foto do Professor"
                              className="rounded-circle mb-3"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="sec-color">
                            <h5 className="card-title">{turma.name}</h5>
                            <p className="card-text">{turma.turma}</p>
                            <p className="card-text">{professorName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}


                  <div className="col-md-3">
                    <div className="card criar-nova-turma-card" onClick={toggleCreateForm}>
                      <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <i className="bi bi-plus-lg display-1"></i> 
                        <h5 className="card-title mt-3">Criar Nova Turma</h5> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showLoader && (
        <div id="loader" className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorHome;
