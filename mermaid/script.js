import { generateDiagram } from "./diagram.js";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
mermaid.initialize({ startOnLoad: true });

const elementoDiagrama = document.getElementById("diagrama");
const container = document.getElementById("mermaidContainer");

const resetDiagram = () => {
  elementoDiagrama.classList.toggle("diagrama");
};

// const showDiagram = () => {
//   elementoDiagrama.classList.toggle("diagrama"); // Adiciona ou remove a classe 'alterado'
// };

/**
 * Gera o diagrama e renderiza o componente novamente para atualizar a tela
 */
const updateErDiagram = async () => {
  // showDiagram();d
  const diagram = await generateDiagram();

  // const diagram = "erDiagram";

  // const elementoDiagrama = document.getElementById("diagrama");
  elementoDiagrama.textContent = diagram;

  // Remove o conteúdo do container atual e re-renderiza o diagrama
  container.innerHTML = diagram;

  mermaid.init(undefined, container);
};

// Adiciona um evento de clique ao botão para atualizar o diagrama
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("atualizarBtn")
    .addEventListener("click", updateErDiagram);
  document.getElementById("limparBtn").addEventListener("click", resetDiagram);
});
