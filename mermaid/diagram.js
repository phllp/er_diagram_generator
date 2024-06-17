const fetchDatabaseInfo = async () => {
  const response = await fetch("http://localhost:3000/query");
  const data = await response.json();
  return data;
};

/**
 * Formata os dados extraídos do DB em um string no padrão de diagrama ER do Mermaid
 * @param {*} dbInfo
 * @returns String
 */
const formatErDiagram = (dbInfo) => {
  let diagram = "erDiagram \n"; // Define o tipo de diagrama
  let relationships = []; // Os relacionamentos são adicionados no final

  // Iteração sobre cada tabela do DB
  dbInfo.forEach((table) => {
    let t = `${table.tableName} {\n`;

    table.columns.forEach((column) => {
      // Formata a string que representa uma coluna, no formato: data_type column_name e PK/FK (opcional)
      let c = `${column.columnType.replace(/ /g, "_")} ${column.columnName}`; // Tratamento para evitar espaços em branco no tipo de dados
      //Tratamento para todas as possilidades envolvendo restrições de PK e FK
      if (column.primaryKey && !column.foreignKey) {
        c += " PK";
      } else if (column.primaryKey && column.foreignKey) {
        c += " PK, FK";
      } else if (!column.primaryKey && column.foreignKey) {
        c += " FK";
      }
      // Se a coluna for uma FK salva esse relacionamento para que ele seja adicionado ao diagrama no final
      if (column.foreignKey) {
        const foreignTable = column.foreignKey.foreignTableName;
        let r = `${foreignTable} || --o{ ${table.tableName} : o`;
        relationships.push(r);
      }
      // Adiciona a coluna na tabela
      t += `${c} \n`;
    });
    // Adiciona a tabela ao diagrama
    diagram += `${t} } \n`;
  });
  // Adiciona os relacionamentos no diagrama
  relationships.forEach((r) => (diagram += `${r} \n`));
  console.log(diagram);
  return diagram;
};

export const generateDiagram = async () => {
  console.log("reached");
  const dbInfo = await fetchDatabaseInfo();
  const diagram = formatErDiagram(dbInfo);
  return diagram;
};
