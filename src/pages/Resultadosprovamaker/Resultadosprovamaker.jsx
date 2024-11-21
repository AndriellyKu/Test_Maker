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
    const title = "Resultados da Prova";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.text(title, 20, 20);

    let yOffset = 30;

    perguntas.forEach((pergunta, index) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${pergunta.pergunta}`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`Categoria: ${pergunta.categoria}`, 20, yOffset);
      yOffset += 8;

      switch (pergunta.tipo) {
        case "paragraph":
          doc.text(`Resposta: ${pergunta.resposta}`, 20, yOffset);
          yOffset += 10;
          break;

        case "multiple-choice":
          doc.text(`Resposta Correta: ${pergunta.resposta.alternativas[pergunta.resposta.respostaCorreta]}`, 20, yOffset);
          yOffset += 10;
          pergunta.resposta.alternativas.forEach((alt, index) => {
            doc.text(`${index + 1}. ${alt}`, 20, yOffset);
            yOffset += 8;
          });
          break;

        case "short-answer":
          doc.text(`Resposta: ${pergunta.resposta}`, 20, yOffset);
          yOffset += 10;
          break;

        case "checkbox":
          doc.text("Respostas Corretas:", 20, yOffset);
          yOffset += 8;
          pergunta.resposta.alternativas.forEach((alt, index) => {
            const isCorrect = pergunta.resposta.respostaCorreta.includes(index);
            doc.text(`${isCorrect ? "[CORRETA]" : "[INCORRETA]"} ${alt}`, 20, yOffset);
            yOffset += 8;
          });
          break;

        default:
          doc.text("Resposta não reconhecida.", 20, yOffset);
          yOffset += 10;
          break;
      }
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
