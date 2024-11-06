import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './SalaProfessor.css';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderH from "../../components/HeaderH";

const SalaProfessor = () => {
  const location = useLocation();
  const turma = location.state?.turma || {};

  const [alunos, setAlunos] = useState([
    { id: 1, name: 'Alice', profilePic: 'url1' },
    { id: 2, name: 'julio', profilePic: 'url2' },
  ]);

  const provasCriadas = [
    { id: 1, title: 'Prova de Matemática', description: 'Descrição da prova 1' },
    { id: 2, title: 'Prova de História', description: 'Descrição da prova 2' },
  ];

  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (event, aluno) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      aluno
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  const expelAluno = (aluno) => {
    alert(`Aluno ${aluno.name} expulso da sala.`);
    closeContextMenu();
  };

  const [profilePic, setProfilePic] = useState('');


  useEffect(() => {

    fetch('/api/professor-data')
      .then((response) => response.json())
      .then((data) => {
        setProfilePic(data.profilePic); 
      })
      .catch((error) => console.error('Erro ao buscar dados do professor:', error));
  }, []);

  return (
    <div className="professor-sala-container">
      <HeaderH profilePic={profilePic} />
      <div className="professor-sala-content d-flex">
        <div className="professor-sala-sidebar">
          <p className="alunos-lista-t">Alunos</p>
          <ul className="professor-sala-alunos-list">
            {alunos.map((aluno) => (
              <li
                key={aluno.id}
                className="professor-sala-aluno"
                onContextMenu={(e) => handleRightClick(e, aluno)}
              >
                <img 
                  src={aluno.profilePic} 
                  alt={aluno.name} 
                  className="professor-sala-aluno-img rounded-circle" 
                />
                <span className="professor-sala-aluno-name">{aluno.name}</span>
              </li>
            ))}
          </ul>
        </div>


        <div className="professor-sala-provas-content">
          <h3 className="avlc-text">Avaliações {turma.name}</h3>
          <div className="row">
            {provasCriadas.map((prova) => (
              <div key={prova.id} className="col-md-4 professor-sala-prova-card">
                <div className="card-prova-cria">
                  <div className="card-body">
                    <h5 className="card-title">{prova.title}</h5>
                    <p className="card-text">{prova.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {contextMenu?.visible && (
        <div
          className="professor-sala-context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            position: 'absolute',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            zIndex: 1000
          }}
        >
          <ul>
            <li onClick={() => expelAluno(contextMenu.aluno)}>Expulsar da sala</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalaProfessor;
