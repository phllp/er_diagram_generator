import { generateDiagram } from "./diagram.js";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
mermaid.initialize({ startOnLoad: true });

const elementoDiagrama = document.getElementById("diagrama");
const container = document.getElementById("mermaidContainer");

/**
 * Gera o diagrama e renderiza o componente novamente para atualizar a tela
 */
const updateErDiagram = async () => {
  const diagram = await generateDiagram();
  elementoDiagrama.textContent = diagram;

  // Remove o conteúdo do container atual e re-renderiza o diagrama
  container.innerHTML = diagram;
  mermaid.init(undefined, container);
};

// Adiciona um evento de clique ao botão para atualizar o diagrama
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateWIthDbBtn")
    .addEventListener("click", updateErDiagram);
});
