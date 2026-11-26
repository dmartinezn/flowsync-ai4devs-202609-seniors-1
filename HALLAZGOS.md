# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos fallaron y cuántos siguieron en verde

Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra
que te dio la pantalla.

- `make test-e2e` dio `Tests  44 passed, 3 failed (47)`: de mis 7 casos funcionales fallaron 3 y pasaron 4, y los 40 que ya había siguieron en verde; `make test-unit` dio `Tests  4 passed, 2 failed (6)`, los 6 nuevos, porque antes la suite unitaria no tenía ninguno.

## 2. El caso nuevo que pasó y por qué

Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó, deducido de lo que tienen
en común los que fallaron.

- En la Parte A pasaron los 4 que esperan `isOverdue: false`, y el revelador es «Una tarea hecha con la fecha pasada», que pasó por HTTP y falló en el unitario (`expected true to be false`, la regla no mira `done`): los 3 rojos funcionales tienen en común que esperan `true` en una tarea leída de la base con `GET`, y la sonda mostró que leída así `dueDate` llega como `Date` y no como texto, de modo que `Date < '2026-08-13'` siempre da `false` (`isOverdueOn` dio `false` leída y `true` en memoria) y cualquier caso que espere `false` pasa por accidente, sin ejercer la regla.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar la afirmación final de «Darla por hecha» ni de «Aplazar» (en `make test-e2e` los dos se paran antes, en la precondición «parte vencida», líneas 133 y 162), «creada hace semanas» lo simulé mirando con `today=2099-12-31` porque la API no deja elegir `createdAt`, y el `Date` del unitario lo construí a medianoche UTC copiando la sonda, que corrió con `TZ=UTC` del `.env`: no comprobé qué llega con otro huso.
