import React, { useState } from "react";
import Axios from "axios";
import "./Maker.css";
import DropIcon from "../../assets/imagens/drop_down_file_icon.png";
import Cabecalio from "../../components/Cabecalio";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Componente para os checkboxes
const CheckboxOption = ({ id, value, label, onChange }) => (
  <div className="checkbox-container">
    <input
      type="checkbox"
      className="checkbox1"
      id={id}
      name="question-type"
      value={value}
      onChange={onChange}
    />
    <span className="checkbox-custom"></span>
    <label htmlFor={id}>{label}</label>
  </div>
);

const Maker = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("prompt");
  const [formData, setFormData] = useState({
    examYear: "",
    examName: "Nome da Prova", // Nome da prova pode ser ajustado conforme a lógica da aplicação
    prompt: "",
    link: "",
    documents: [],
    questionTypes: [],
    professorId: localStorage.getItem("professorId"), // Pega o ID do professor do localStorage
    turmaId: localStorage.getItem("turmaId"), // Pega o ID da turma do localStorage
  });
  
  const [loading, setLoading] = useState(false); // Estado do loader

  const increaseCount = () => setQuestionCount((prev) => prev + 1);
  const decreaseCount = () => setQuestionCount((prev) => Math.max(prev - 1, 0));

  const handleMethodSelection = (method) => setSelectedMethod(method);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents") {
      setFormData({ ...formData, documents: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      questionTypes: checked
        ? [...prev.questionTypes, value]
        : prev.questionTypes.filter((type) => type !== value),
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    console.log("Dados a serem enviados:", {
      questionCount,
      formData,
      selectedMethod,
    });
  
    try {
      let payload;
  
      // Inclui o ID do professor e da turma no payload
      if (selectedMethod === "prompt") {
        payload = {
          questionCount,
          questionTypes: formData.questionTypes,
          examYear: formData.examYear,
          examName: formData.examName,
          prompt: formData.prompt,
          professorId: formData.professorId,
          turmaId: formData.turmaId,
        };
      } else if (selectedMethod === "link") {
        payload = {
          questionCount,
          questionTypes: formData.questionTypes,
          examYear: formData.examYear,
          examName: formData.examName,
          link: formData.link,
          professorId: formData.professorId,
          turmaId: formData.turmaId,
        };
      } else if (selectedMethod === "documents") {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "documents") {
            value.forEach((doc, index) =>
              formDataToSend.append(`document_${index}`, doc)
            );
          } else {
            formDataToSend.append(key, value);
          }
        });
        formDataToSend.append("questionCount", questionCount);
        formDataToSend.append("questionTypes", JSON.stringify(formData.questionTypes));
        formDataToSend.append("professorId", formData.professorId);
        formDataToSend.append("turmaId", formData.turmaId);
  
        console.log("FormData a ser enviado:", formDataToSend);
  
        const response = await Axios.post(`${API_URL}/provas/gerar-questoes`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        setLoading(false);
        alert("Prova criada com sucesso!");
        console.log("Resposta da API:", response.data);
  
        // Certifique-se de que a resposta contém perguntas e respostas
        navigate("/resultadosprovamaker", {
          state: { perguntasGeradas: response.data.perguntas },
        });
        return;
      } else {
        throw new Error("Método de envio inválido.");
      }
  
      const response = await Axios.post(`${API_URL}/provas/gerar-questoes`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setLoading(false);
      alert("Prova gerada com sucesso!");
      console.log("Resposta da API:", response.data);
  
      // Certifique-se de que a resposta contém perguntas e respostas
      navigate("/resultadosprovamaker", {
        state: { perguntasGeradas: response.data.perguntas },
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Ocorreu um erro ao gerar a prova.");
    }
  };
 
  
  

  return (
    <div className="super-all-container">
      <Cabecalio />

      {loading && <div className="loader">Carregando...</div>} {/* Loader */}

      <form id="maker-form-pr" onSubmit={handleSubmit}>
        <div className="container_apr">
          <p id="Bem_vindo">
            Bem-vindo! Você já pode começar a criar seu formulário. Comece
            selecionando a matéria.
          </p>
        </div>

        <hr className="corte-esctreito" />

        <div id="container_upload_select">
          <div className="container_file_upload">
            <h2>Tipo de arquivo</h2>
            <p>Selecione o tipo de arquivo e arraste o documento para a janela</p>
            <div className="file_icons">
              <div
                className="Container_file_icons"
                onClick={() => handleMethodSelection("prompt")}
              >
                <i className="bi bi-pencil-fill" id="pencil_icon"></i>
              </div>
              <div
                className="Container_file_icons"
                onClick={() => handleMethodSelection("link")}
              >
                <i className="bi bi-link-45deg" id="file_icon"></i>
              </div>
              <div
                className="Container_file_icons"
                onClick={() => handleMethodSelection("documents")}
              >
                <i className="bi bi-paperclip" id="paperclip_icon"></i>
              </div>
            </div>
          </div>

          <div>
            <h2>Tipo de questão</h2>
            <div className="container_Tipo">
              <CheckboxOption
                id="checkbox01"
                value="multiple-choice"
                label="Múltipla escolha"
                onChange={handleCheckboxChange}
              />
              <CheckboxOption
                id="checkbox02"
                value="short-answer"
                label="Resposta curta"
                onChange={handleCheckboxChange}
              />
              <CheckboxOption
                id="checkbox03"
                value="paragraph"
                label="Parágrafo"
                onChange={handleCheckboxChange}
              />
              <CheckboxOption
                id="checkbox04"
                value="checkbox"
                label="Caixa de seleção"
                onChange={handleCheckboxChange}
              />
              <CheckboxOption
                id="checkbox05"
                value="checkbox2"
                label="Outra caixa"
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>

        <div id="Container_drop">
          {selectedMethod === "prompt" && (
            <div className="prompt-section">
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="Digite o prompt para a IA..."
                className="form-control"
              />
            </div>
          )}
          {selectedMethod === "link" && (
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Cole o link aqui"
              className="form-control"
            />
          )}
          {selectedMethod === "documents" && (
            <div className="container_upload">
              <input
                type="file"
                name="documents"
                accept=".pdf,.pptx"
                multiple
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="container_info">
          <div className="Grade_group">
            <input
              type="text"
              name="examYear"
              value={formData.examYear}
              onChange={handleInputChange}
              placeholder="Para que ano se aplica a prova? (Define a dificuldade)"
            />
          </div>
          <div className="quantity_questions">
            <p>N° de questões</p>
            <div className="menos_mais">
              <button type="button" onClick={increaseCount}>
                +
              </button>
              <div className="container_contagem">
                <p>{questionCount}</p>
              </div>
              <button type="button" onClick={decreaseCount}>
                -
              </button>
            </div>
          </div>
        </div>

        <button id="generate" type="submit">
          GERAR
        </button>
      </form>
    </div>
  );
};

export default Maker;
