# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- **Impacto y reversibilidad:** 0 filas de negocio modificadas, comprobado mediante consultas (`count(*)` de `users`, `auth_access_tokens` y `tasks`) a SQLite (`backend/tmp/db.sqlite3`) y a las dos bases PostgreSQL (`db` y `db-test`): 0 filas en todas, con solo los 4 registros de `adonis_schema`; no se añadió ni se tocó ninguna migración. El cambio es reversible en el entorno actual porque el archivo SQLite permanece intacto y no contenía datos de negocio.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- **Cobertura de pruebas:** las 23 pruebas (20 de auth y 3 del responsable de la tarea; ninguna menciona `dueDate`, `isOverdue`, `/due-date`, `/status` ni `done`) no detectan la incompatibilidad Date/string que afecta a `isOverdueOn` (sin el type parser de `DATE`, `pg` devuelve un `Date`, la API pasa a `"2026-08-19T00:00:00.000Z"` y una tarea vencida el día anterior sale `isOverdue: false`, con las 23 en verde) ni el error preexistente (commit `99d1425`) que clasifica como vencida una tarea terminada (`done` con fecha de ayer → `isOverdue: true`).

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- **Incertidumbre:** no se pudo verificar la conservación de datos reales porque las bases originales estaban vacías (0 filas en SQLite) y no se inspeccionó el respaldo de producción (`backups/produccion-2026-10-02.dump`, que el commit `f5d1ac4` indica no abrir).
