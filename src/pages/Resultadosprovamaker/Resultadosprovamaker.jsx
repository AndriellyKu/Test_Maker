import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import Cabecalio from "../../components/Cabecalio";

const Resultadosprovamaker = () => {
  const location = useLocation();
  const { perguntasGeradas = [] } = location.state || {};
  const [perguntas, setPerguntas] = useState([]);
  const [isProfessor, setIsProfessor] = useState(true);

  useEffect(() => {
    if (perguntasGeradas.length > 0) {
      setPerguntas(perguntasGeradas.map((pergunta, i) => ({
        ...pergunta,
        valor: 0,
        opcoes: pergunta.tipo === "multiple-choice" ? pergunta.opcoes : [],
        respostaCorreta: pergunta.respostaCorreta || null,
      })));
    }
  }, [perguntasGeradas]);

  const handleEditPergunta = (index, novoTexto) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index].texto = novoTexto;
    setPerguntas(novasPerguntas);
  };

  const handleValorChange = (index, novoValor) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index].valor = novoValor;
    setPerguntas(novasPerguntas);
  };

  const handleOpcaoChange = (index, opcaoIndex, novaOpcao) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index].opcoes[opcaoIndex] = novaOpcao;
    setPerguntas(novasPerguntas);
  };

  const handleRespostaCorretaChange = (index, novaRespostaCorreta) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index].respostaCorreta = novaRespostaCorreta;
    setPerguntas(novasPerguntas);
  };

  const renderPergunta = (pergunta, index) => {
    switch (pergunta.tipo) {
      case "multiple-choice":
        return (
          <div key={index} className="pergunta-multiple-choice">
            <textarea
              value={pergunta.texto}
              onChange={(e) => handleEditPergunta(index, e.target.value)}
              className="pergunta-text"
              placeholder="Digite a pergunta aqui"
            />
            <div className="opcoes-container">
              {pergunta.opcoes.map((opcao, opcaoIndex) => (
                <div key={opcaoIndex} className="opcao-box">
                  <input
                    type="text"
                    value={opcao}
                    onChange={(e) =>
                      handleOpcaoChange(index, opcaoIndex, e.target.value)
                    }
                    className="opcao-input"
                    placeholder={`Opção ${opcaoIndex + 1}`}
                  />
                  <input
                    type="radio"
                    name={`resposta-${index}`}
                    checked={pergunta.respostaCorreta === opcao}
                    onChange={() =>
                      handleRespostaCorretaChange(index, opcao)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div key={index} className="pergunta-paragraph">
            <textarea
              value={pergunta.texto}
              onChange={(e) => handleEditPergunta(index, e.target.value)}
              className="pergunta-text"
              placeholder="Digite a pergunta aqui"
            />
            <textarea
              className="resposta-paragraph"
              placeholder="Resposta do aluno"
              readOnly={!isProfessor}
            />
          </div>
        );

      case "short-answer":
        return (
          <div key={index} className="pergunta-short-answer">
            <textarea
              value={pergunta.texto}
              onChange={(e) => handleEditPergunta(index, e.target.value)}
              className="pergunta-text"
              placeholder="Digite a pergunta aqui"
            />
            <input
              type="text"
              className="resposta-short-answer"
              placeholder="Resposta do aluno"
              readOnly={!isProfessor}
            />
          </div>
        );

      default:
        return null;
    }
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
          onClick={() => alert("Função para salvar em PDF será implementada.")}
        >
          Salvar Prova em PDF
        </button>
      </div>
    </>
  );
};

export default Resultadosprovamaker;
