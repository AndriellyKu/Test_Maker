import React, { useState } from "react";
import './AlunoHome.css';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoimgTM from '../../assets/imagens/logOtesteMaker.png';


const AlunoHome = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cards, setCards] = useState([]);
  const [showLoader, setShowLoader] = useState(false);


  const addCard = () => {
    setCards([...cards, { id: cards.length, name: "Novo Card" }]);
  };


  const deleteCard = () => {
    setCards(cards.slice(0, -1));
  };

r
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="all-all-container">
      <header className="d-flex justify-content-between align-items-center p-3">
        <div className="container_branding d-flex align-items-center">
          <div id="logo_tm">
            <img src={LogoimgTM} alt="Logo Test maker" />
          </div>
          <h1 className="logo-maker">Test Maker</h1>
        </div>
        <div className="profile-icon">
          <i className="bi bi-person-circle"></i>
        </div>
      </header>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        {!showCreateForm ? (
          <div id="create-card" className="card text-center" onClick={toggleCreateForm}>
            <div className="card-body">
              <i className="bi bi-plus-circle-fill display-1"></i>
              <p className="mt-3">Clique para criar sua prova</p>
            </div>
          </div>
        ) : (
          <div id="create-form" className="card text-center">
            <div className="card-body">
              <button id="close-btn" className="btn-close" onClick={toggleCreateForm}></button>
              <input type="text" id="exam-name" className="form-control mb-3" placeholder="Nome da Prova" />
              <textarea id="exam-description" className="form-control mb-3" placeholder="Descrição da Prova"></textarea>
              <button id="advance-btn" className="btn btn-primary">Avançar</button>
            </div>
          </div>
        )}
      </div>
      
      {showLoader && (
        <div id="loader" className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div id="card-section" className="container d-flex flex-column align-items-center mt-4">
        <div className="mb-3">
          <button id="generateCardBtn" className="btn btn-success" onClick={addCard}>
            Gerar Card
          </button>
          <button id="deleteCardBtn" className="btn btn-danger ms-2" onClick={deleteCard}>
            Deletar Card
          </button>
          <button id="returnPageBtn" className="btn btn-secondary ms-2">Voltar</button>
        </div>
        <div id="cardContainer" className="row g-4">
          {cards.map((card) => (
            <div key={card.id} className="card col-md-3">
              <div className="card-body">
                <h5 className="card-title">{card.name}</h5>
                <p className="card-text">Detalhes da prova aqui</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="containerPerguntas" className="container mt-4"></div>
    </div>
  );
};

export default AlunoHome;
