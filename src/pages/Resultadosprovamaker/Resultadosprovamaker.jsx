import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Resultadosprovamaker.css';
import HeaderH from "../../components/headerH";

const Resultadosprovamaker = () => {
  const location = useLocation();
  const { questionCount } = location.state || { questionCount: 0 };
  const [perguntas, setPerguntas] = useState([]);

  useEffect(() => {
    const perguntasIniciais = Array.from({ length: questionCount }, (_, i) => ({
      texto: `Pergunta ${i + 1}`,
      valor: 0,
    }));
    setPerguntas(perguntasIniciais);
  }, [questionCount]);

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
            </div>
            ))}
        </div>
        <button className="salvar-alteracoes">Salvar Alterações</button>
        </div>
    </>
  );
};

export default Resultadosprovamaker;
