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
          alert(data.message || "Erro ao carregar as turmas.");
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar turmas:", error);
        alert("Erro de conexão. Tente novamente mais tarde.");
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
      alert("Por favor, insira o código da turma.");
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
          alert("Você já está nessa turma.");
        } else {
          addCard({
            _id: data.turma._id,
            name: data.turma.nome,
            turma: data.turma.turma,
            professor: data.turma.professorNome,
            professorPic: data.turma.professorPic, // Foto do professor
            background: data.turma.background, // Fundo da turma
          });
          alert(data.message);
        }
      } else {
        alert(data.message || "Erro ao entrar na turma");
      }
    } catch (error) {
      console.error("Erro ao entrar na turma:", error);
      alert("Erro de conexão. Tente novamente mais tarde.");
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

      <div className="create-class-container d-flex justify-content-center align-items-center min-vh-100">
        {!showCreateForm ? (
          <div
            id="create-class-card"
            className="create-card animate__animated animate__fadeIn"
            onClick={toggleCreateForm}
          >
          </div>
        ) : (
          <div
            id="join-class-form"
            className="join-class-card animate__animated animate__zoomIn"
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
                className="created-class-card col-md-3 animate__animated animate__fadeIn"
                onClick={() =>
                  navigate("/salaaluno", {
                    state: { turma: card },
                  })
                }
              >
                <div className="created-card-body">
                  <i
                    className="bi bi-trash delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(card._id);
                    }}
                  ></i>
                  {card.background && (
                    <div
                      className="created-class-card"
                      style={{ backgroundImage: `url(${card.background})` }}
                    >
                      <div className="sec-color">
                        <h5 className="card-title">{card.name}</h5>
                        <p className="card-text">{card.turma}</p>
                        <p className="card-text">{card.professor}</p>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-start mt-2">
                    {card.professorPic && (
                      <img
                        src={card.professorPic}
                        alt="Foto do Professor"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="ms-2">
                      <p className="m-0">Professor: {card.professor}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Você ainda não está em nenhuma turma.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlunoHome;
