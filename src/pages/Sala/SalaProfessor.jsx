import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './SalaProfessor.css';
import HeaderH from "../../components/HeaderH";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');

const SalaProfessor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const turma = location.state?.turma || {}; // Obtém a turma passada pela rota

  const [alunos, setAlunos] = useState([]);
  const [provasCriadas, setProvasCriadas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [novaProva, setNovaProva] = useState({ title: "", description: "" });
  const [showLoader, setShowLoader] = useState(false);
  const [showCodigo, setShowCodigo] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [codigoSala, setCodigoSala] = useState(turma.codigo || "N/A");
  const [mediaGeral, setMediaGeral] = useState(0);

  // Função para listar alunos da turma
  async function listarAlunosDaTurma(turmaId) {
    try {
      const response = await axios.get(`${API_URL}/turmas/${turmaId}/alunos`);
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao listar alunos:", error);
      setAlunos([]); // Define lista vazia em caso de erro
    }
  }

  // Função para calcular média geral da turma
  async function calcularMediaGeral(turmaId) {
    try {
      const response = await axios.get(`${API_URL}/turmas/${turmaId}/media`);
      setMediaGeral(response.data.media || 0);
    } catch (error) {
      console.error("Erro ao calcular média geral:", error);
      setMediaGeral(0);
    }
  }

  // Função para criar uma nova prova
  const token = localStorage.getItem('token'); // Ou de onde você armazena o token

  const handleCreateProva = async (event) => {
    event.preventDefault(); // Evita o reload padrão do formulário
  
    setShowLoader(true); // Mostra o loader enquanto a requisição está em andamento
    try {
      const response = await axios.post(
        `${API_URL}/provas/criar-prova`,
        {
          ...novaProva,
          professorId: turma.professorId, // Inclua se necessário
          turmaId: turma._id, // Inclua se necessário
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Certifique-se de que o token está correto
          },
        }
      );
  
      console.log("Prova criada com sucesso:", response.data);
      alert("Prova criada com sucesso!");
  
      // Atualiza o estado local com a nova prova
      setProvasCriadas((prev) => [...prev, response.data]);
      setNovaProva({ title: "", description: "" }); // Limpa o formulário
      setShowForm(false); // Fecha o formulário
  
      // Navega para outra página ou mantém na atual
      navigate("/maker", { state: { prova: response.data } });
    } catch (error) {
      console.error("Erro ao criar a prova:", error);
  
      // Mostra mensagem amigável para o usuário
      if (error.response && error.response.status === 401) {
        alert("Erro de autenticação. Faça login novamente.");
      } else {
        alert("Erro ao criar a prova. Verifique os dados e tente novamente.");
      }
    } finally {
      setShowLoader(false); // Sempre esconde o loader
    }
  };
  
  

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaProva((prev) => ({ ...prev, [name]: value }));
  };

  // Função para abrir/fechar formulário com animação
  const toggleForm = () => {
    const formElement = document.querySelector(".form-criar-prova");
    if (!showForm) {
      setShowForm(true);
      formElement?.classList.add("aparece");
      formElement?.classList.remove("desaparece");
    } else {
      formElement?.classList.add("desaparece");
      formElement?.classList.remove("aparece");
      setTimeout(() => setShowForm(false), 300); // Remove após a animação
    }
  };

  // Carrega alunos e dados ao montar o componente
  useEffect(() => {
    if (turma._id) {
      listarAlunosDaTurma(turma._id);
    }
  }, [turma]);

  return (
    <div className="professor-sala-container">
      <HeaderH />
      <div className="professor-sala-content d-flex">
        {/* Sidebar com lista de alunos */}
        <div className="professor-sala-sidebar">
          <p className="alunos-lista-t">Alunos</p>
          <ul className="professor-sala-alunos-list">
            {alunos.length > 0 ? (
              alunos.map((aluno) => (
                <li
                  key={aluno.id || aluno._id}
                  className="professor-sala-aluno"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={aluno.profilePicture || "/default.jpg"}
                    alt={aluno.username || "Aluno"}
                    className="professor-sala-aluno-img rounded-circle"
                  />
                  <span className="professor-sala-aluno-name">{aluno.username || "Nome não disponível"}</span>
                </li>
              ))
            ) : (
              <p>Nenhum aluno encontrado para esta turma.</p>
            )}
          </ul>
        </div>

        {/* Conteúdo principal */}
        <div className="professor-sala-provas-content">
          <div className="codigo-e-media">
            <button className="show-codigo-btn" onClick={() => setShowCodigo(!showCodigo)}>
              Revelar Código da Sala
            </button>
            <button className="show-media-btn" onClick={() => setShowMedia(!showMedia)}>
              Mostrar Média Geral
            </button>
          </div>

          {showCodigo && <div className="codigo-sala">Código da Sala: {codigoSala}</div>}
          {showMedia && <div className="media-geral">Média Geral: {mediaGeral.toFixed(2)}</div>}

          <h3 className="avlc-text">Avaliações</h3>
          <div className="row provas-display">
            {provasCriadas.map((prova) => (
              <div key={prova.id || prova._id} className="col-md-4 professor-sala-prova-card">
                <div className="card-prova-cria">
                  <div className="card-body">
                    <h5 className="card-title">{prova.title}</h5>
                    <p className="card-text">{prova.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
                <button type="submit" className="btn btn-primary">Criar Prova</button>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="btn btn-secondary ml-2"
                >
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
