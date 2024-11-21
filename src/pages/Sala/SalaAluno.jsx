import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./SalaAluno.css";
import Cabecalio from "../../components/Cabecalio";

const API_URL = import.meta.env.VITE_API_URL;

const SalaAluno = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const turma = location.state?.turma || {};

  const [alunos, setAlunos] = useState([]);
  const [provas, setProvas] = useState([]); // Armazenar as provas
  const [showLoader, setShowLoader] = useState(false);

  const token = localStorage.getItem("token");

  const listarAlunosDaTurma = async (turmaId) => {
    setShowLoader(true);
    try {
      const response = await axios.get(`${API_URL}/turmas/${turmaId}/alunos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao listar alunos:", error);
      setAlunos([]);
    } finally {
      setShowLoader(false);
    }
  };

  const listarProvasDaTurma = async (turmaId) => {
    setShowLoader(true);
    try {
      const response = await axios.get(`${API_URL}/turmas/${turmaId}/provas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filtra as provas que estão liberadas
      const provasLiberadas = response.data.filter(prova => prova.liberada);
      setProvas(provasLiberadas);
    } catch (error) {
      console.error("Erro ao listar provas:", error);
      setProvas([]);
    } finally {
      setShowLoader(false);
    }
  };
  

  useEffect(() => {
    if (turma._id) {
      listarAlunosDaTurma(turma._id); // Função para listar alunos
      listarProvasDaTurma(turma._id); // Função para listar provas
    } else {
      alert("Erro ao carregar a turma. Redirecionando...");
      navigate("/alunohome");
    }
  }, [turma]);

  return (
    <div className="professor-sala-container">
      <Cabecalio />
      <div className="professor-sala-content d-flex">
        <div className="professor-sala-sidebar">
          <p className="alunos-lista-t">Alunos</p>
          <ul className="professor-sala-alunos-list">
            {alunos.length > 0 ? (
              alunos.map((aluno) => (
                <li key={aluno._id} className="professor-sala-aluno">
                  <img
                    src={aluno.profilePicture || "/default.jpg"}
                    alt={aluno.username || "Aluno"}
                    className="professor-sala-aluno-img rounded-circle"
                  />
                  <span className="professor-sala-aluno-name">
                    {aluno.username || "Nome não disponível"}
                  </span>
                </li>
              ))
            ) : (
              <p>Nenhum aluno encontrado para esta turma.</p>
            )}
          </ul>
        </div>

        <div className="professor-sala-provas-content">
          <h3 className="avlc-text">Conteúdo da turma</h3>
          <h4>Provas</h4>
          <div className="row provas-display">
            {provas.length > 0 ? (
              provas.map((prova) => (
                <div key={prova._id} className="col-md-4 professor-sala-prova-card">
                  <div className="card-prova-cria">
                    <div className="card-body">
                      <h5 className="card-title">{prova.title}</h5>
                      <p className="card-text">{prova.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma prova disponível para esta turma.</p>
            )}
          </div>
        </div>
      </div>

      {showLoader && (
        <div className="loader-overlay">
          <div className="loader"></div>
          <p>Carregando...</p>
        </div>
      )}
    </div>
  );
};

export default SalaAluno;
