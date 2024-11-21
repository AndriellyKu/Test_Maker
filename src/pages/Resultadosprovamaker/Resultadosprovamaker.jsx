import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import Cabecalio from "../../components/Cabecalio";
import { jsPDF } from "jspdf"; // Importa o jsPDF

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

  // Função para gerar o PDF
  const gerarProvaPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal"); // Fonte normal

    // Tamanho de fonte para o cabeçalho
    doc.setFontSize(16);
    doc.text("Resultados da Prova", 20, 20);

    // Adiciona espaços para o aluno preencher
    doc.setFontSize(12);
    doc.text("Nome do Aluno: __________________________", 20, 40);
    doc.text("Turma: _________________________________", 20, 50);
    doc.text("Data (__/__/__): ________________________", 20, 60);  // Formato de data ajustado
    doc.text("Escola: ________________________________", 20, 70);

    let yOffset = 80;

    perguntas.forEach((pergunta, index) => {
      doc.setFontSize(12); // Perguntas com fonte 12
      doc.text(`${index + 1}. ${pergunta.pergunta}`, 20, yOffset);
      yOffset += 10;

      // Caso seja uma pergunta de múltipla escolha ou checkbox, adiciona as alternativas
      if (pergunta.tipo === "multiple-choice" || pergunta.tipo === "checkbox") {
        doc.setFontSize(11); // Alternativas com fonte 11
        pergunta.resposta.alternativas.forEach((alt, index) => {
          doc.text(`${index + 1}. ${alt}`, 20, yOffset);
          yOffset += 8;
        });
      }

      yOffset += 10; // Espaço entre perguntas
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
        <button
          className="salvar-alteracoes"
          onClick={gerarProvaPDF} // Chama a função para gerar o PDF
        >
          Salvar Prova em PDF
        </button>
      </div>
    </>
  );
};

export default Resultadosprovamaker;
