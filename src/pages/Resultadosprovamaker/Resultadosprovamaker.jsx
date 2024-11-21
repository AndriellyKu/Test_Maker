import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import Cabecalio from "../../components/Cabecalio";
import { jsPDF } from "jspdf"; // Importa o jsPDF
import Axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

const Resultadosprovamaker = () => {
  const location = useLocation();
  const { perguntasGeradas, prova } = location.state || {}; // Recebe também o ID da prova
  const [perguntas, setPerguntas] = useState([]);
  const [liberada, setLiberada] = useState(false); // Estado para indicar se a prova foi liberada
  const provaId = prova._id
  
  useEffect(() => {
    if (Array.isArray(perguntasGeradas) && perguntasGeradas.length > 0) {
      setPerguntas(perguntasGeradas);
    }
  }, [perguntasGeradas]);

  const handleLiberarProva = async () => {
    try {
      const response = await Axios.put(`${API_URL}/provas/mudar-acesso/${provaId}`, {
        liberada: true, // Define a prova como liberada
      }, {
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      });
      if (response.status === 200) {
        setLiberada(true); // Atualiza o estado local
        alert("Prova liberada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao liberar a prova:", error);
      alert("Ocorreu um erro ao liberar a prova. Tente novamente.");
    }
  };

  const renderResposta = (pergunta) => {
    const { tipo, resposta } = pergunta;

    switch (tipo) {
      case "paragraph":
        return (
          <p className="resposta-paragraph">
            <strong>Resposta:</strong> {resposta}
          </p>
        );

      case "multiple-choice":
        return (
          <div className="resposta-multiple-choice">
            <p><strong>Resposta Correta:</strong> {resposta.alternativas[resposta.respostaCorreta]}</p>
            <ul>
              {resposta.alternativas.map((alt, index) => (
                <li key={index} className={index === resposta.respostaCorreta ? "correta" : ""}>
                  {alt}
                </li>
              ))}
            </ul>
          </div>
        );

      case "short-answer":
        return (
          <p className="resposta-short-answer">
            <strong>Resposta:</strong> {resposta}
          </p>
        );

      case "checkbox":
        return (
          <div className="resposta-checkbox">
            <p><strong>Respostas Corretas:</strong></p>
            <ul>
              {resposta.alternativas.map((alt, index) => (
                <li key={index} className={resposta.respostaCorreta.includes(index) ? "correta" : ""}>
                  {alt}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return <p>Tipo de pergunta não reconhecido.</p>;
    }
  };

  const renderPergunta = (pergunta, index) => (
    <div key={index} className="pergunta-box">
      <h3>{pergunta.pergunta}</h3>
      <p><strong>Categoria:</strong> {pergunta.categoria}</p>
      {renderResposta(pergunta)}
    </div>
  );

  const gerarProvaPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.setFontSize(16);
    doc.text("Resultados da Prova", 20, 20);

    doc.setFontSize(12);
    doc.text("Nome do Aluno: __________________________", 20, 40);
    doc.text("Turma: _________________________________", 20, 50);
    doc.text("Data (__/__/__): ________________________", 20, 60);
    doc.text("Escola: ________________________________", 20, 70);

    let yOffset = 80;

    perguntas.forEach((pergunta, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${pergunta.pergunta}`, 20, yOffset);
      yOffset += 10;

      if (pergunta.tipo === "multiple-choice" || pergunta.tipo === "checkbox") {
        doc.setFontSize(11);
        pergunta.resposta.alternativas.forEach((alt, index) => {
          doc.text(`${index + 1}. ${alt}`, 20, yOffset);
          yOffset += 8;
        });
      }

      yOffset += 10;
    });

    doc.save("prova_resultados.pdf");
  };

  return (
    <>
      <Cabecalio />
      <div className="resultados-prova">
        <h2>Resultados da Prova</h2>
        <div className="perguntas-container">
          {perguntas.map((pergunta, index) => renderPergunta(pergunta, index))}
        </div>
        <div>
          <button
            className="salvar-alteracoes"
            onClick={gerarProvaPDF}
          >
            Salvar Prova em PDF
          </button>
          <button 
            className="liberar-prova"
            onClick={handleLiberarProva}
            disabled={liberada} // Desabilita o botão se já liberada
          >
            {liberada ? "Prova Liberada" : "Liberar Prova"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Resultadosprovamaker;
