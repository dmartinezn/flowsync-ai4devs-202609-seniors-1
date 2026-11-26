# Prompts

## Prompt 1

**Modelo:** Claude Opus 5.5 
**Herramienta:** Kiro IDE

```
Parte A del ejercicio FlowSync, en la rama tests-dmartinezn.

Lee el Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md y todos sus Scenarios, y el Requirement siguiente («El día de referencia lo pone quien mira») para saber cómo se pasa el día.

Escribe backend/tests/functional/tasks/overdue.spec.ts con un test por Scenario, entrando por HTTP como el cliente.

Restricciones:

- No toques ni una línea fuera de backend/tests/: ni modelo, ni transformer, ni controlador.

- Comprueba lo que sale en la respuesta: el campo isOverdue del cuerpo, no un método interno.

- El día de referencia se pasa en la petición (today). Nada de la fecha de hoy ni de ningún reloj.

- Usa el mismo aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otro.

- No des por hecho ningún identificador: usa el id que devuelve la creación.

Córrelo con make test-e2e y enséñame la salida entera, no solo si pasó. Dime qué casos fallan, con la línea y el mensaje. No arregles la implementación aunque veas el fallo.
```

Para repetirlo con el otro modelo se envió, tal cual:

```
reintenta con Claude Opus 5.5, que es el que acabo de seleccionar
```

**Qué salió:** Funcionó a la primera con los dos modelos y dio el mismo rojo: `44 passed, 3 failed (47)`. Con Opus 5.5 se borró el fichero del primer intento y se escribió de nuevo. No se tocó nada fuera de `backend/tests/`.

### Respuesta

#### Punto de partida

- Rama `tests-dmartinezn`, creada desde `s11/start`.
- Se borró el `overdue.spec.ts` que había dejado la ejecución con Auto, para escribirlo desde cero.

#### Lo que dice la spec

- «Cuándo una tarea está vencida»: vencida si, y solo si, tiene fecha, la fecha es **anterior** al día de referencia y el estado no es `done`. Tiene 7 Scenarios.
- «El día de referencia lo pone quien mira»: el día llega en el parámetro `today` (`AAAA-MM-DD`), es obligatorio y el sistema no lo sustituye por su reloj.

#### Por dónde entra el cliente

- `isOverdue` viaja en `GET /api/v1/tasks/:id` (con `today` en la query) y en la respuesta de `PUT /api/v1/tasks/:id/due-date` (con `today` en el cuerpo).
- `PATCH /api/v1/tasks/:id/status` responde con la forma de lista, sin `isOverdue`. Para ver el efecto de pasar a `done`, la tarea se vuelve a leer con `GET`.
- `POST /api/v1/tasks` crea la tarea solo con el título. La fecha se pone después con el `PUT`.
- Aislamiento: todos los grupos de `backend/tests/functional/` usan `group.each.setup(() => testUtils.db().withGlobalTransaction())`, y este también.

#### `backend/tests/functional/tasks/overdue.spec.ts`

Un test por Scenario, con día de referencia fijo `REFERENCIA = '2026-08-13'`. Las afirmaciones sobre `isOverdue` usan `strictEqual`, para que un `undefined` o un `null` no pasen por `false`.

| Scenario | Cómo se ejerce | Espera |
|---|---|---|
| Fecha del día anterior | `PUT` con `2026-08-12`, luego `GET ?today=2026-08-13` | estado distinto de `done` e `isOverdue === true` |
| Vencer hoy todavía no es estar vencida | `PUT` con `2026-08-13`, luego `GET` | `isOverdue === false` |
| Fecha futura | `PUT` con `2026-08-14`, luego `GET` | `isOverdue === false` |
| Sin fecha no se vence nunca | sin `PUT`, `GET ?today=2099-12-31` | `pending`, `dueDate: null` e `isOverdue === false` |
| Darla por hecha la deja de vencer | `PUT` con ayer, `GET` (precondición `true`), `PATCH status=done`, `GET` | `done`, `isOverdue === false` y la misma `dueDate` que antes |
| Una tarea hecha con la fecha pasada | `PUT` con `2026-03-02`, `PATCH done`, `GET` | `done` e `isOverdue === false` |
| Aplazar resuelve el vencimiento | `PUT` con ayer, `GET` (precondición `true`), `PUT` con mañana | `isOverdue === false` en la respuesta de ese `PUT` |

- Cada test crea la cuenta y la tarea por la API y usa el `id` que devuelve la creación.
- «Creada hace semanas» se simula mirando la tarea desde `today=2099-12-31`, porque la API no deja elegir `createdAt`.
- En los dos Scenarios que parten de «una tarea vencida», la precondición se comprueba leyendo la tarea con `GET`, que es como la ve el cliente.

#### Comprobaciones

| Comprobación | Resultado |
|---|---|
| Prettier y `eslint` sobre el fichero | sin errores |
| Buscar `Date.now`, `new Date(`, `DateTime.now`, `DateTime.local` | ninguna coincidencia |
| `git status` | solo `?? backend/tests/functional/tasks/overdue.spec.ts` (y este `prompts.md`) |

#### Ejecución: `make test-e2e`

La salida entera está guardada fuera del repositorio, en `../salidas-tests/parteA-opus-make-test-e2e.log`. El bloque nuevo y el resumen:

```
functional / Tasks | cuándo una tarea está vencida (tests/functional/tasks/overdue.spec.ts)
  ✖ Fecha del día anterior: llega marcada como vencida (71.48ms)
  ✔ Vencer hoy todavía no es estar vencida (67.32ms)
  ✔ Fecha futura: no llega marcada como vencida (65.93ms)
  ✔ Sin fecha no se vence nunca, por antigua que sea (60.45ms)
  ✖ Darla por hecha la deja de vencer y conserva la fecha (65.57ms)
  ✔ Una tarea hecha con la fecha pasada no llega vencida (74.97ms)
  ✖ Aplazar resuelve el vencimiento en la misma respuesta (65.52ms)
...
 FAILED 
Tests  44 passed, 3 failed (47)
 Time  3s
make: *** [test-e2e] Error 1
```

Los 40 tests que ya existían (auth, responsable y papelera) siguieron en verde.

#### Casos que fallan

| Caso | Línea | Mensaje |
|---|---|---|
| Fecha del día anterior | `overdue.spec.ts:90` (`assert.strictEqual(tarea.isOverdue, true)`) | `AssertionError: expected false to equal true` |
| Darla por hecha la deja de vencer | `overdue.spec.ts:133` (precondición) | `AssertionError: el Scenario parte de una tarea vencida: expected false to equal true` |
| Aplazar resuelve el vencimiento | `overdue.spec.ts:162` (precondición) | `AssertionError: el Scenario parte de una tarea vencida: expected false to equal true` |

Los tres fallan en lo mismo: esperan `isOverdue: true` en una tarea recién leída con `GET` y reciben `false`. Los cuatro que pasan esperan `false`. En los dos últimos no se llega a la afirmación del propio Scenario porque el test se para antes, en la precondición. No se arregló la implementación.

#### Estado

Sin commit todavía.


---

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Kiro IDE

```
Parte B del ejercicio FlowSync, en la misma rama.

La regla es isOverdueOn en backend/app/models/task.ts. Crea backend/tests/unit/ y escribe ahí sus bordes, sin servidor y sin base de datos:

- Fecha anterior al día de referencia y tarea sin hacer.

- Fecha exactamente igual al día de referencia.

- Fecha posterior.

- Sin fecha.

- Tarea ya hecha, con la fecha pasada.

Añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto Date. Antes de escribirlo, comprueba qué tipo trae de verdad dueDate cuando la tarea se lee de la base, sin dejar ese experimento en el repositorio.

Sigue sin tocar implementación. Corre make test-unit, enséñame la salida entera y dime qué falla y por qué.
```

**Qué salió:** Funcionó a la primera: 6 tests unitarios, `make test-unit` dio `4 passed, 2 failed (6)`, y la sonda explicó también los tres rojos de la Parte A.

### Respuesta

#### La regla

```ts
isOverdueOn(referenceDay: string): boolean {
  if (this.dueDate === null) return false
  return this.dueDate < referenceDay
}
```

`database/schema.ts` declara `dueDate: string | null`, y en `config/`, `start/`, `providers/`, `app/` y `database/` no hay ningún `setTypeParser` que cambie cómo `pg` entrega la columna `date`.

#### Sonda: qué tipo trae `dueDate` de verdad

Test temporal `backend/tests/functional/zz_sonda_tmp.spec.ts`, corrido con `node ace test functional --files=zz_sonda_tmp` y borrado justo después. Crea una tarea con `dueDate: '2026-08-12'` y la vuelve a leer con `Task.findOrFail`:

```
SONDA en memoria tras create: string "2026-08-12"
SONDA leída con findOrFail: object [object Date] "2026-08-12T00:00:00.000Z"
SONDA isOverdueOn(2026-08-13) leída: false | en memoria: true
```

- Recién asignada, `dueDate` es texto y la regla funciona.
- Leída de la base, es un `Date` a medianoche UTC, aunque el tipo diga `string`. `Date < '2026-08-13'` convierte los dos lados a número, el texto da `NaN` y la comparación siempre es `false`.
- Después de borrar la sonda, `git status` no la muestra.

#### `backend/tests/unit/models/task_is_overdue_on.spec.ts`

La tarea se construye con `new Task()` y nunca se guarda: sin servidor y sin base. Día de referencia fijo `REFERENCIA = '2026-08-13'`.

| Caso | Entrada | Espera |
|---|---|---|
| fecha anterior y sin hacer | `'2026-08-12'`, `pending` | `true` |
| fecha igual | `'2026-08-13'` | `false` |
| fecha posterior | `'2026-08-14'` | `false` |
| sin fecha | `null` | `false` |
| ya hecha con la fecha pasada | `'2026-08-12'`, `done` | `false` |
| texto o `Date` dan lo mismo | los tres bordes, como texto y como `new Date('AAAA-MM-DDT00:00:00.000Z')` | el mismo resultado en las dos formas |

El `Date` se construye a partir de un día escrito a mano, con la misma forma que devolvió la sonda. No se usa `new Date()` sin argumentos ni ningún reloj.

#### Comprobaciones

| Comprobación | Resultado |
|---|---|
| Prettier, `eslint` y `npx tsc --noEmit` | sin errores |
| Buscar `Date.now`, `new Date()`, `DateTime.now`, `DateTime.local` en `tests/unit` | ninguna coincidencia |
| `git status` | solo `backend/tests/functional/tasks/overdue.spec.ts`, `backend/tests/unit/` y este `prompts.md` |

#### Ejecución: `make test-unit`

La salida entera está guardada fuera del repositorio, en `../salidas-tests/parteB-make-test-unit.log`:

```
unit / Task | isOverdueOn (tests/unit/models/task_is_overdue_on.spec.ts)
  ✔ fecha anterior al día de referencia y sin hacer: vencida (0.66ms)
  ✔ fecha exactamente igual al día de referencia: no vencida (0.06ms)
  ✔ fecha posterior al día de referencia: no vencida (0.04ms)
  ✔ sin fecha: no vencida (0.04ms)
  ✖ ya hecha con la fecha pasada: no vencida (0.28ms)
  ✖ da lo mismo recibir la fecha como texto o como objeto Date (0.15ms)
...
 FAILED 
Tests  4 passed, 2 failed (6)
 Time  3ms
make: *** [test-unit] Error 1
```

#### Qué falla y por qué

| Caso | Línea | Mensaje | Por qué |
|---|---|---|---|
| ya hecha con la fecha pasada | `task_is_overdue_on.spec.ts:40` | `AssertionError: expected true to be false` | La regla no mira el estado: le faltan `status !== 'done'`, la tercera condición de la spec |
| texto o `Date` dan lo mismo | `task_is_overdue_on.spec.ts:58` | `AssertionError: 2026-08-12 como Date frente a 2026-08-12 como texto: expected false to equal true` | Con `Date`, la comparación `<` contra el texto siempre es `false`. Falla en el primer borde, el anterior, que es donde el texto da `true` |

#### Relación con la Parte A

La sonda explica los tres rojos de la Parte A: el `GET` lee la tarea de la base, así que `dueDate` es un `Date` y `isOverdue` siempre sale `false`. Ese fallo tapa el de `done`. En la Parte A, «hecha con la fecha pasada» pasaba porque la regla ya daba `false` por culpa del `Date`, no porque mirase el estado. Aquí, con la fecha como texto, el fallo de `done` sale a la vista.

No se arregló la implementación. Sin commit todavía.


---

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Kiro IDE

```
Parte C del ejercicio FlowSync.

Rellena HALLAZGOS.md en la raíz con tres líneas, una por punto, basadas solo en las salidas de las Partes A y B:

1. Cuántos de los casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que dio la pantalla.

2. Cuál de los casos nuevos PASÓ y por qué crees que pasó, deducido de lo que tienen en común los que fallaron.

3. De qué dudaste o qué no pudiste comprobar.

No inventes resultados. Comprueba con git diff --stat que no hay nada tocado fuera de backend/tests/, HALLAZGOS.md y prompts.md, y busca en los tests cualquier llamada al reloj. Después haz el commit y genera el bundle de la rama.
```

**Qué salió:** Funcionó a la primera: tres líneas en `HALLAZGOS.md`, comprobaciones limpias, commit en `tests-dmartinezn` y bundle generado.

### Respuesta

#### Fuentes

Solo las salidas guardadas de las Partes A y B: `../salidas-tests/parteA-opus-make-test-e2e.log` (`Tests  44 passed, 3 failed (47)`), `../salidas-tests/parteB-make-test-unit.log` (`Tests  4 passed, 2 failed (6)`) y la sonda de la Parte B.

#### `HALLAZGOS.md`

La plantilla que traía `s11/start` tenía los encabezados de otro ejercicio («Las filas que cambian y la rama», «Lo que la batería de pruebas no podía ver»). Se cambiaron por los tres puntos de este enunciado, se conservó la introducción y se escribió una línea por punto:

| Punto | Respuesta | Evidencia |
|---|---|---|
| 1. Cuántos fallaron y cuántos siguieron en verde | Funcional: 3 de 7 fallaron, 4 pasaron, los 40 anteriores en verde. Unitario: `4 passed, 2 failed (6)`, todos nuevos | Resúmenes de `make test-e2e` y `make test-unit` |
| 2. El caso nuevo que pasó y por qué | Pasaron los 4 que esperan `false`. El revelador es «Una tarea hecha con la fecha pasada»: verde por HTTP y rojo en el unitario. Los 3 rojos funcionales esperan `true` en una tarea leída con `GET`, donde `dueDate` llega como `Date` y la comparación siempre da `false`, así que todo lo que espera `false` pasa sin ejercer la regla | ✔/✖ de las dos suites, el `expected true to be false` de la línea 40 del unitario y la sonda (`false` leída, `true` en memoria) |
| 3. Duda | No se llegó a la afirmación final de «Darla por hecha» ni de «Aplazar» (se paran en la precondición, líneas 133 y 162); «creada hace semanas» se simuló con `today=2099-12-31`; el `Date` del unitario copia la sonda, que corrió con `TZ=UTC` del `.env`, y no se comprobó otro huso | Errores de `make test-e2e` y `TZ=UTC` en `backend/.env` (solo se leyó esa clave) |

#### Comprobaciones

`git diff --cached --stat s11/start`, con todo preparado:

```
 HALLAZGOS.md      |  17 +-
 ...verdue.spec.ts | 168 ++++
 ...due_on.spec.ts |  61 ++
 prompts.md        | 234 +++++-
 4 files changed, 452 insertions(+), 28 deletions(-)
```

- Filtrar los nombres que no estén en `backend/tests/`, `HALLAZGOS.md` o `prompts.md`: ninguno.
- Buscar `Date.now`, `new Date()` sin argumentos, `DateTime.now`, `DateTime.local`, `DateTime.utc`, `performance.now` y `process.hrtime` en los dos ficheros de tests: ninguna coincidencia.
- El único `new Date(` es el de `task_is_overdue_on.spec.ts:54`, que construye un día fijo (`` new Date(`${dia}T00:00:00.000Z`) ``) y no lee el reloj.

#### Commit y bundle

- Commit en `tests-dmartinezn` sobre `s11/start`, con los dos tests, `HALLAZGOS.md` y `prompts.md` (este fichero incluido).
- Bundle `../flowsync-tests-dmartinezn.bundle`, con la rama `tests-dmartinezn`, comprobado con `git bundle verify`.
- La rama del primer intento, `tests-dmartinezn-v1`, queda en este clon y no va en el bundle.
