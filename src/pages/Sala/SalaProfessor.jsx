import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SalaProfessor.css";
import Cabecalio from "../../components/Cabecalio";

const API_URL = import.meta.env.VITE_API_URL;

const SalaProfessor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const turma = location.state?.turma || {}; // Obtém a turma passada pela rota

  localStorage.setItem("professorId", turma.professorId);
  localStorage.setItem("turmaId", turma._id);
  
  const [alunos, setAlunos] = useState([]);
  const [provasCriadas, setProvasCriadas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [novaProva, setNovaProva] = useState({ title: "", description: "" });
  const [showLoader, setShowLoader] = useState(false);
  const [showCodigo, setShowCodigo] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [codigoSala, setCodigoSala] = useState(turma.codigo || "N/A");
  const [mediaGeral, setMediaGeral] = useState(0);

  const token = localStorage.getItem("token");

  async function listarAlunosDaTurma(turmaId) {
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
    }
  }

  async function calcularMediaGeral(turmaId) {
    try {
      const response = await axios.get(`${API_URL}/turmas/${turmaId}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMediaGeral(response.data.media || 0);
    } catch (error) {
      console.error("Erro ao calcular média geral:", error);
      setMediaGeral(0);
    }
  }

  const handleCreateProva = async (event) => {
    event.preventDefault();
    setShowLoader(true);
  
    console.log("Criando prova com dados:", novaProva); // Verifique os dados da nova prova
  
    try {
      const response = await axios.post(
        `${API_URL}/provas/criar-prova`,
        {
          ...novaProva,
          professorId: turma.professorId,
          turmaId: turma._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Prova criada com sucesso:", response.data);
    
  
      setProvasCriadas((prev) => [...prev, response.data]);
      setNovaProva({ title: "", description: "" });
      setShowForm(false);
  
      navigate("/maker", { state: { prova: response.data, turma } });
    } catch (error) {
      setShowLoader(false);
      console.error("Erro ao criar a prova:", error);
  
      if (error.response && error.response.status === 401) {
        
      } else {
        
      }
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaProva((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    const formElement = document.querySelector(".form-criar-prova");
    if (!showForm) {
      setShowForm(true);
      formElement?.classList.add("aparece");
      formElement?.classList.remove("desaparece");
    } else {
      formElement?.classList.add("desaparece");
      formElement?.classList.remove("aparece");
      setTimeout(() => setShowForm(false), 300);
    }
  };

  // Função para listar as provas da turma
  async function listarProvasDaTurma(turmaId) {
    try {
      const response = await axios.get(`${API_URL}/provas/${turmaId}/provas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProvasCriadas(response.data); // Atualiza a lista de provas criadas
    } catch (error) {
      console.error("Erro ao listar provas:", error);
      setProvasCriadas([]); // Em caso de erro, manter lista vazia
    }
  }

  useEffect(() => {
    if (turma._id) {
      listarAlunosDaTurma(turma._id);
      calcularMediaGeral(turma._id);
      listarProvasDaTurma(turma._id); // Chama a função para listar as provas
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
                <li key={aluno.id || aluno._id} className="professor-sala-aluno">
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
          <div className="codigo-e-media">
            <button className="show-codigo-btn" onClick={() => setShowCodigo(!showCodigo)}>
              Revelar Código da Sala
            </button>
          </div>

          {showCodigo && <div className="codigo-sala">Código da Sala: {codigoSala}</div>}


          <h3 className="avlc-text">Avaliações</h3>
          <div className="row provas-display">
            {provasCriadas.length > 0 ? (
              provasCriadas.map((prova) => (
                <div key={prova.id || prova._id} className="col-md-4 professor-sala-prova-card">
                  <div className="card-prova-cria">
                    <div className="card-body">
                      <h5 className="card-title">{prova.title}</h5>
                      <p className="card-text">{prova.description}</p>
                      <button
                        className="btn "
                        onClick={() => navigate("/resultadosprovamaker", { state: { perguntasGeradas: prova.perguntas, prova: prova, turma, alunosDaTurma:alunos } })}
                      >
                        Ver mais
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma prova encontrada para esta turma.</p>
            )}
          </div>


          <button className="criar-prova-btn" onClick={toggleForm}>
            <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>+</span>
            Criar Nova Prova
          </button>

          {showForm && (
            <div className="form-criar-prova">
              <form onSubmit={handleCreateProva}>
                <div className="form-group">
                  <label htmlFor="title">Título da Prova</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={novaProva.title}
                    onChange={handleInputChange}
                    required
                    className="form-control cor-fundo-menu-sala"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descrição da Prova</label>
                  <textarea
                    id="description"
                    name="description"
                    value={novaProva.description}
                    onChange={handleInputChange}
                    required
                    className="form-control cor-fundo-menu-sala"
                  />
                </div>
                <button type="submit" className="btn-criar-professor">
                  Criar Prova
                </button>
                <button type="button" onClick={toggleForm} className="btn-cancel-1">
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showLoader && (
        <div className="loader-overlay">
          <div className="loader"></div>
          <p>Redirecionando...</p>
        </div>
      )}
    </div>
  );
};

export default SalaProfessor;
