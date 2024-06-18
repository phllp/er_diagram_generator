const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const queries = require("./queries");

const { constraintsSelect, tableColumnsSelect } = queries;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// // Configuração do pool de conexões com PostgreSQL

const getTables = async (pool) => {
  const result = await pool.query(tableColumnsSelect);
  const tableData = result.rows;
  if (!tableData || tableData.length == 0) {
    return "Nenhuma tabela encontrada";
  }

  const tableNames = [...new Set(tableData.map((t) => t.table_name))];

  //   // Separa os registros de cada tabela em um array distinto
  const filteredTables = tableNames.map((t) =>
    tableData.filter((f) => f.table_name === t)
  );

  /**
   * Formata os dados em um array de objetos com a seguinte estrutura:
   *[
   *  {
   *    "tableName": "loja",
		"columns": [
		  {
			"columnName": "id",
			"columnType": "integer",
            "primaryKey": true,
            "foreignKey": false
          },
   *    }
   * ]
   *
   */
  const structuredTable = filteredTables.map((t) => {
    const columns = t.map((o) => {
      const data = { columnName: o.column_name, columnType: o.data_type };
      return data;
    });
    return {
      tableName: t[0].table_name,
      columns: columns,
    };
  });

  const constraints = await getConstraints(pool);

  // Identifica as chaves primárias
  const data_with_pk = structuredTable.map((t) => {
    const newColumns = t.columns.map((column) => {
      const pk = constraints.find(
        (c) =>
          c.table_name == t.tableName &&
          c.constraint_type == "PRIMARY KEY" &&
          c.column_name == column.columnName
      );

      if (pk) {
        return { ...column, primaryKey: true };
      } else {
        return { ...column, primaryKey: false };
      }
    });
    return { ...t, columns: newColumns };
  });

  // Identifica as chaves estrangeiras
  const data_with_fk = data_with_pk.map((t) => {
    const newColumns = t.columns.map((column) => {
      const fk = constraints.find(
        (c) =>
          c.table_name == t.tableName &&
          c.constraint_type == "FOREIGN KEY" &&
          c.column_name == column.columnName
      );
      if (fk) {
        return {
          ...column,
          foreignKey: {
            foreignTableName: fk.foreign_table_name,
            foreignColumnName: fk.foreign_column_name,
          },
        };
      } else {
        return { ...column, foreignKey: false };
      }
    });
    return { ...t, columns: newColumns };
  });

  console.log("Data with PK", data_with_pk);

  return data_with_fk;
};

/**
     * 	{
          "table_name": "produto",
          "constraint_type": "PRIMARY KEY",
          "column_name": "id",
          "foreign_table_name": "produto",
          "foreign_column_name": "id"
      },
     */
const getConstraints = async (pool) => {
  const result = await pool.query(constraintsSelect);
  const constraints = result.rows;
  console.log(constraints);
  return constraints;
};

app.get("/", (req, res) => {
  console.log("API Reached");
  res.send("API está funcionando!");
});

const connectDb = async ({ port, user, database, password }) => {
  const pool = new Pool({
    user: user,
    host: "localhost",
    database: database,
    password: password,
    port: port,
  });

  try {
    await pool.query("SELECT 1");
    console.log("DB Connection succeded");
    return pool;
  } catch (err) {
    console.error("Erro ao verificar a saúde do banco de dados:", err);
    return;
  }
};

app.post("/connect-db", async (req, res) => {
  console.log("BODY", req.body);
  // const { port, user, password, database } = req.body;

  const pool = await connectDb(req.body);

  if (!pool) {
    res.status(500).send("Erro ao conectar ao banco de dados");
    return;
  }

  try {
    const tables = await getTables(pool);
    // const constraints = await getConstraints();
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao executar a query");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
