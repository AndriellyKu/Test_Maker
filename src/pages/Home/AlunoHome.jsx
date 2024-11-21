import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AlunoHome.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cabecalio from "../../components/Cabecalio";

const API_URL = import.meta.env.VITE_API_URL;

const AlunoHome = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cards, setCards] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [classCode, setClassCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurmas = async () => {
      setShowLoader(true);
      try {
        const response = await fetch(`${API_URL}/alunos/listar-turmas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCards(data.turmas || []);
        } else {
          console.error("Erro ao buscar turmas:", data.message);
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar turmas:", error);

      } finally {
        setShowLoader(false);
      }
    };

    fetchTurmas();
  }, []);

  const addCard = (newClass) => {
    setCards([...cards, newClass]);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleJoinClass = async () => {
    if (!classCode.trim()) {

      return;
    }

    setShowLoader(true);

    try {
      const response = await fetch(`${API_URL}/alunos/entrar-na-turma`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ codigo: classCode }),
      });

      const data = await response.json();

      if (response.ok) {
        const turmaExists = cards.some((card) => card._id === data.turma._id);
        if (turmaExists) {
        } else {
          addCard({
            _id: data.turma._id,
            name: data.turma.nome,
            turma: data.turma.turma,
            professor: data.turma.professorNome,
            professorPic: data.turma.professorPic, // Foto do professor
            background: data.turma.background, // Fundo da turma
          });
        
        }
      } else {
      }
    } catch (error) {
      console.error("Erro ao entrar na turma:", error);
    } finally {
      setShowLoader(false);
      setShowCreateForm(false);
      setClassCode("");
    }
  };

  const handleDeleteClass = (cardId) => {
    setCards(cards.filter((card) => card._id !== cardId));
  };

  return (
    <div className="aluno-home-container">
      <Cabecalio />

      <div className="create-class-container d-flex justify-content-center align-items-center min-vh-50">
        {!showCreateForm ? (
          <div
            id="create-class-card"
            className="create-card animate_animated animate_fadeIn"
            onClick={toggleCreateForm}
          >
            <div className="create-card-body">
              <i className="bi bi-plus-circle-fill display-1"></i>
              <p className="mt-3">Clique para entrar em uma nova turma</p>
            </div>
          </div>
        ) : (
          <div
            id="join-class-form"
            className="join-class-card animate_animated animate_zoomIn"
          >
            <div className="join-card-body">
              <button
                id="close-btn"
                className="btn-close"
                onClick={toggleCreateForm}
              ></button>
              <input
                type="text"
                id="class-code"
                className="form-control mb-3"
                placeholder="Código da Turma"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
              <button
                id="enter-class-btn"
                className="btn btn-primary"
                onClick={handleJoinClass}
              >
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>

      {showLoader && (
        <div
          id="loader"
          className="d-flex justify-content-center loader-animation"
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div
        id="class-cards-section"
        className="container d-flex flex-column align-items-center mt-4"
      >
        <div id="classCardsContainer" className="row g-4">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card._id}
                className="created-class-card col-12 col-md-6 col-lg-4 animate_animated animate_fadeIn"
                onClick={() =>
                  navigate("/salaaluno", {
                    state: { turma: card },
                  })
                }
              >
                <div
                  className="created-card-body"
                  style={{ backgroundImage: `url(${card.background})` }}
                >
                  <i
                    className="bi bi-trash delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(card._id);
                    }}
                  ></i>
                  <div className="sec-color">
                    <h5 className="card-title">{card.name}</h5>
                    <p className="card-text">{card.turma}</p>
                    <p className="card-text">{card.professor}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Você ainda não está em nenhuma turma.</p>
          )}
        </div>
      </div>
      <div className="extensao-tamanho-borda"></div>
    </div>
  );
};

export default AlunoHome;
