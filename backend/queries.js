const constraintsSelect = `
    SELECT
        tc.table_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
   WHERE (tc.constraint_type = 'PRIMARY KEY' or tc.constraint_type = 'FOREIGN KEY')
     AND tc.table_schema NOT IN ('pg_catalog', 'information_schema');
`;

const tableColumnsSelect = `
    SELECT table_schema, table_name, column_name, data_type, is_identity
      FROM information_schema.columns
     WHERE table_schema NOT IN ('pg_catalog', 'information_schema');
`;

module.exports = { constraintsSelect, tableColumnsSelect };
