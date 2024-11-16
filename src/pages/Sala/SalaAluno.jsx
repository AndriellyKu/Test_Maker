// Arquivo: `SalaAluno.js`
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SalaAluno = () => {
  const [codigo, setCodigo] = useState("");
  const [aluno, setAluno] = useState({ id: Date.now(), name: "Nome do Aluno", profilePic: "url" });
  const navigate = useNavigate();

  const handleEntrarSala = async () => {
    try {
      // Verificar se o código da sala é válido
      const response = await fetch("/api/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo })
      });

      const data = await response.json();
      if (data.valid) {
        // Adicionar o aluno à sala
        await fetch("/api/adicionar-aluno", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo, aluno })
        });

        // Redirecionar para a sala do professor, passando os dados da sala
        navigate("/sala-professor", { state: { turma: data.sala } });
      } else {
        alert("Código da sala inválido.");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
    }
  };

  return (
    <div className="entrar-sala-container">
      <h2>Entrar na Sala</h2>
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Digite o código da sala"
      />
      <button onClick={handleEntrarSala}>Entrar</button>
    </div>
  );
};

export default SalaAluno;
