import { generateDiagram } from "./diagram.js";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
mermaid.initialize({ startOnLoad: true });

/**
 * Gera o diagrama e renderiza o componente novamente para atualizar a tela
 */
const updateErDiagram = async () => {
  removeDiagramComponent();
  createDiagramComponent();
  const elementoDiagrama = document.getElementById("diagrama");
  const container = document.getElementById("mermaidContainer");
  const diagram = await generateDiagram();
  elementoDiagrama.textContent = diagram;

  // Remove o conteúdo do container atual e re-renderiza o diagrama
  container.innerHTML = diagram;
  mermaid.init(undefined, container);
};

const createDiagramComponent = () => {
  const createIn = document.getElementById("diagramArea");
  const mermaidContainer = document.createElement("div");
  mermaidContainer.id = "mermaidContainer";

  const mermaidComponent = document.createElement("pre");
  mermaidComponent.classList.add("mermaid");
  mermaidComponent.classList.add("diagram");
  mermaidComponent.id = "diagrama";
  mermaidComponent.innerHTML = `erDiagram
  PLACEHOLDER {
      string id PK
      string name
  }`;

  mermaidContainer.appendChild(mermaidComponent);

  createIn.appendChild(mermaidContainer);
  console.log("mermaidContainer", mermaidContainer);
};

const removeDiagramComponent = () => {
  const removeFrom = document.getElementById("diagramArea");
  const toRemove = document.getElementById("mermaidContainer");
  console.log("toRemove", toRemove);
  if (toRemove) {
    removeFrom.removeChild(toRemove);
  }
};

// Adiciona um evento de clique ao botão para atualizar o diagrama
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateWIthDbBtn")
    .addEventListener("click", updateErDiagram);
  document
    .getElementById("limparBtn")
    .addEventListener("click", removeDiagramComponent);
});
