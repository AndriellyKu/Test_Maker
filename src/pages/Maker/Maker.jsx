import React, { useState } from "react";
import Axios from "axios";
import "./Maker.css";
import DropIcon from "../../assets/imagens/drop_down_file_icon.png";
import HeaderH from "../../components/HeaderH";

// Componente para os checkboxes
const CheckboxOption = ({ id, value, label }) => (
  <div className="checkbox-container">
    <input
      type="checkbox"
      className="checkbox1"
      id={id}
      name="question-type"
      value={value}
    />
    <span className="checkbox-custom"></span>
    <label htmlFor={id}>{label}</label>
  </div>
);

const Maker = () => {
  const [questionCount, setQuestionCount] = useState(0);

  const increaseCount = () => setQuestionCount(questionCount + 1);
  const decreaseCount = () => setQuestionCount(Math.max(questionCount - 1, 0));

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedTypes = [
      ...document.querySelectorAll('input[name="question-type"]:checked'),
    ].map((input) => input.value);

    Axios.post("/api/generate-test", {
      year: document.getElementById("exam-year").value,
      questionCount,
      questionTypes: selectedTypes,
    })
      .then((response) => {
        alert("Prova gerada com sucesso!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Ocorreu um erro ao gerar a prova.");
      });
  };

  return (
    <div className="super-all-container">
      <HeaderH />

      {/* Formulário */}
      <form id="maker-form-pr" onSubmit={handleSubmit}>
        <div className="container_apr">
          <p id="Bem_vindo">
            Bem vindo! Você já pode começar a criar seu formulário. Comece
            selecionando a matéria.
          </p>
        </div>

        <hr className="corte-esctreito" />

        {/* Seção de upload e seleção */}
        <div id="container_upload_select">
          <div className="container_file_upload">
            <h2>Tipo de arquivo</h2>
            <p>
              Selecione o tipo de arquivo e arraste o documento para a janela
            </p>
            <div className="file_icons">
              <div className="Container_file_icons">
                <i className="bi bi-pencil-fill" id="pencil_icon"></i>
              </div>
              <div className="Container_file_icons">
                <i className="bi bi-play-circle-fill" id="playIcon"></i>
              </div>
              <div className="Container_file_icons">
                <i className="bi bi-link-45deg" id="file_icon"></i>
              </div>
              <div className="Container_file_icons">
                <i className="bi bi-paperclip" id="paperclip_icon"></i>
              </div>
            </div>
          </div>

          {/* Seção de seleção de tipos de questões */}
          <div>
            <h2>Tipo de questão</h2>
            <div className="container_Tipo">
              <div className="container_sep2">
                <CheckboxOption
                  id="checkbox01"
                  value="multiple-choice"
                  label="Múltipla escolha"
                />
                <CheckboxOption
                  id="checkbox02"
                  value="short-answer"
                  label="Resposta curta"
                />
                <CheckboxOption
                  id="checkbox03"
                  value="paragraph"
                  label="Parágrafo"
                />
              </div>
              <div className="container_sep1">
                <CheckboxOption
                  id="checkbox04"
                  value="checkbox"
                  label="Caixa de seleção"
                />
                <CheckboxOption
                  id="checkbox05"
                  value="checkbox2"
                  label="Outra caixa"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Área de arrastar arquivos */}
        <div id="Container_drop">
          <div className="container_drop_img">
            <img
              src={DropIcon}
              alt="Selecione e coloque aqui o arquivo"
            />
          </div>
          <div className="drop_down_inst_container">
            <h3>ARRASTE OS ARQUIVOS AQUI</h3>
            <p>Podem ser colocados aqui arquivos .PDF .PPTX</p>
            <div className="container_upload">
              <input
                type="file"
                id="file-upload"
                name="file-upload"
                accept=".pdf,.pptx"
              />
              <label htmlFor="file-upload">Escolher Arquivo</label>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="container_info">
          <div className="Grade_group">
            <input
              type="text"
              id="exam-year"
              name="exam-year"
              placeholder="Para que ano se aplica a prova? (Define a dificuldade)"
            />
          </div>
          <div className="quantity_questions">
            <p>N° de questões</p>
            <div className="menos_mais">
              <button id="mais" type="button" onClick={increaseCount}>
                +
              </button>
              <div className="container_contagem">
                <p id="contagem">{questionCount}</p>
              </div>
              <button id="menos" type="button" onClick={decreaseCount}>
                -
              </button>
            </div>
          </div>
        </div>

        {/* Botão de gerar */}
        <button id="generate" type="submit">
          GERAR
        </button>
      </form>
    </div>
  );
};

export default Maker;
