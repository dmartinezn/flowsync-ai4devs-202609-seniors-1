# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5 (Amazon Bedrock)
**Herramienta:** Claude Code v2.1.318

```
Migra el proyecto FlowSync de SQLite a PostgreSQL utilizando Docker, respetando las instrucciones de CLAUDE.md y las siguientes restricciones:

1. Crea un archivo compose.yaml con dos servicios: db y db-test.
2. Utiliza la imagen pgvector/pgvector:pg17 en ambos servicios.
3. Usa el puerto 54410 para desarrollo y 54411 para pruebas.
4. Configura la base de datos de pruebas en memoria mediante tmpfs, sin volumen persistente.
5. Configura healthchecks en ambos servicios y garantiza que el arranque espere hasta que las dos bases acepten conexiones.
6. No incluyas la clave version en compose.yaml.
7. Configura un archivo de entorno independiente para que las pruebas utilicen exclusivamente la base de datos de pruebas.
8. Agrega atajos en el Makefile para arrancar y detener las bases de datos, ejecutar las migraciones en ambas y ejecutar las pruebas.
9. Conserva intactas todas las migraciones existentes. Si encuentras alguna incompatibilidad, informa antes de modificarlas.
10. Evita modificar la lógica de negocio, las pruebas existentes o el frontend.

Antes de la migración, las 23 pruebas del backend pasan correctamente con SQLite en 818 ms.

Trabaja exclusivamente sobre la rama motor-dmn.

Registra este prompt íntegramente en prompts.md utilizando la plantilla existente e indicando Claude Code v2.1.318, modelo Opus 5.5 y Amazon Bedrock.

Al finalizar, ejecuta las pruebas del backend y presenta un resumen de los archivos modificados, los resultados y las incompatibilidades encontradas.

No realices commits ni push todavía.
```

## Prompt 2

**Modelo:** Opus 5.5 (Amazon Bedrock)
**Herramienta:** Claude Code v2.1.318

```
Realiza la parte B del ejercicio 10 como una auditoría de la migración realizada.

1. Ejecuta npm run typecheck desde backend y registra el resultado.
2. Compara backend/database/schema.ts contra la rama s10/start. Si el diff está vacío, identifica qué configuración mantiene los tipos originales.
3. Analiza Task.isOverdueOn y el comentario que explica la comparación de fechas.
4. Reproduce el comportamiento de una tarea vencida con el ajuste del driver y sin él, mostrando los valores, tipos de datos y resultados obtenidos. Restaura la configuración correcta después de la comprobación.
5. Identifica qué caso funcional no está cubierto por las 23 pruebas existentes.
6. Comprueba mediante consultas cuántas filas cambiaron de valor y distingue los datos modificados de los datos que no fueron migrados desde SQLite.
7. Verifica nuevamente que las migraciones originales permanecen intactas.

Presenta las evidencias, comandos ejecutados y resultados reales. No inventes resultados si alguna comprobación no es posible.

Registra este mensaje íntegramente como Prompt 2 en prompts.md, indicando Claude Code v2.1.318, Opus 5.5 y Amazon Bedrock.

No modifiques las migraciones ni las pruebas existentes. No completes todavía HALLAZGOS.md. No realices commit ni push.
```

## Prompt 3

**Modelo:** Opus 5.5 (Amazon Bedrock)
**Herramienta:** Claude Code v2.1.318

```
Completa la parte C del ejercicio 10 utilizando exclusivamente las evidencias obtenidas durante la migración y la auditoría.

Conserva la estructura original de HALLAZGOS.md y agrega una línea debajo de cada uno de sus tres puntos:

1. Impacto y reversibilidad: 0 filas de negocio modificadas, comprobado mediante consultas a SQLite y ambas bases PostgreSQL. El cambio es reversible en el entorno actual porque el archivo SQLite permanece intacto y no contenía datos de negocio.
2. Cobertura de pruebas: las 23 pruebas no detectan la incompatibilidad Date/string que afecta a isOverdueOn ni el error preexistente que clasifica como vencida una tarea terminada.
3. Incertidumbre: no se pudo verificar la conservación de datos reales porque las bases originales estaban vacías y no se inspeccionó el respaldo de producción.

Registra este mensaje íntegramente como Prompt 3 en prompts.md, indicando Claude Code v2.1.318, modelo Opus 5.5 y Amazon Bedrock.

Verifica que las migraciones originales permanecen intactas y que HALLAZGOS.md y prompts.md cumplen con las instrucciones de entrega.

Muestra el contenido final de HALLAZGOS.md y ejecuta git status y git diff --stat.

No realices commit ni push todavía.
```
