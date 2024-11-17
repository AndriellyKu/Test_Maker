import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import HeaderH from "../../components/HeaderH";

const Resultadosprovamaker = () => {
  const location = useLocation();
  const { perguntasGeradas = [] } = location.state || {};
  const [perguntas, setPerguntas] = useState([]);
  const [isProfessor, setIsProfessor] = useState(true); // Simulação do tipo de usuário (professor ou aluno)

  useEffect(() => {
    if (perguntasGeradas.length > 0) {
      setPerguntas(perguntasGeradas.map((pergunta, i) => ({
        ...pergunta,
        valor: 0,
        opcoes: pergunta.tipo === "opcoes" ? pergunta.opcoes : [], // Supondo que o tipo da pergunta seja "opcoes"
        respostaCorreta: pergunta.respostaCorreta || null, // Supondo que a resposta correta seja fornecida
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

  return (
    <>
      <HeaderH />
      <div className="resultados-prova">
        <h2>Resultados da Prova</h2>
        <div className="perguntas-container">
          {perguntas.map((pergunta, index) => (
            <div key={index} className="pergunta-box">
              <textarea
                value={pergunta.texto}
                onChange={(e) => handleEditPergunta(index, e.target.value)}
                className="pergunta-text"
                placeholder="Digite a pergunta aqui"
              />
              <input
                type="number"
                min="0"
                value={pergunta.valor}
                onChange={(e) => handleValorChange(index, e.target.value)}
                className="pergunta-valor"
                placeholder="Valor"
              />
              {pergunta.opcoes.length > 0 && (
                <div className="opcoes-container">
                  {pergunta.opcoes.map((opcao, opcaoIndex) => (
                    <div key={opcaoIndex} className="opcao-box">
                      <input
                        type="text"
                        value={opcao}
                        onChange={(e) => handleOpcaoChange(index, opcaoIndex, e.target.value)}
                        className="opcao-input"
                        placeholder={`Opção ${opcaoIndex + 1}`}
                      />
                      {isProfessor && pergunta.respostaCorreta === opcao && (
                        <span className="resposta-correta">Resposta Correta</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="salvar-alteracoes"
          onClick={() => alert("Função para salvar em PDF será implementada.")}>
          Salvar Prova em PDF
        </button>
      </div>
    </>
  );
};

export default Resultadosprovamaker;
