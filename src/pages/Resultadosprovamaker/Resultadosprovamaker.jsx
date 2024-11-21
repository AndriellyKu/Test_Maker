import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import Cabecalio from "../../components/Cabecalio";

const Resultadosprovamaker = () => {
  const location = useLocation();
  const { perguntasGeradas } = location.state || {}; // Garante que `state` não seja undefined
  const [perguntas, setPerguntas] = useState([]);

  useEffect(() => {
    if (Array.isArray(perguntasGeradas) && perguntasGeradas.length > 0) {
      setPerguntas(perguntasGeradas);
    }
  }, [perguntasGeradas]);

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

  return (
    <>
      <Cabecalio />
      <div className="resultados-prova">
        <h2>Resultados da Prova</h2>
        <div className="perguntas-container">
          {perguntas.map((pergunta, index) => renderPergunta(pergunta, index))}
        </div>
        <button
          className="salvar-alteracoes"
          onClick={() => alert("Função para salvar em PDF será implementada.")}
        >
          Salvar Prova em PDF
        </button>
      </div>
    </>
  );
};

export default Resultadosprovamaker;
