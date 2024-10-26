--To display all tables
SELECT
    table_schema,
    table_name
FROM
    information_schema.tables
WHERE
    table_type = 'BASE TABLE'
    AND table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY
    table_schema,
    table_name;


--To display all ENUM declared
SELECT
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
ORDER BY
    enum_schema,
    enum_name,
    e.enumsortorder;