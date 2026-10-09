<!-- Generado desde la lección de ejercicio del módulo: no se edita a mano. -->

# Ejercicio FlowSync: cubre con tests un requisito que no tenía ninguno

Es la última lección del módulo y la única que se hace con el portátil delante. Trae el setup del entorno, la tarea y cómo se entrega, todo en un sitio. La tarea tiene dos partes técnicas y una última con las tres líneas que entregas.

> 📌 **Ve guardando cada prompt tal cual lo lanzas**, desde el primero. Se entregan, y reescribirlos al final de memoria no sirve: lo que se revisa es **cómo lo pediste**, no la versión limpia que recuerdas. Hay un archivo esperándolos en el propio repositorio.

---

## 🔁 Cómo funciona este módulo

Hay tres momentos, y saberlos cambia cómo aprovechas cada uno.

**1. Lo intentas tú.** Sobre el proyecto de abajo, con tu agente y con el reloj puesto. Entregas lo que te salga, **con lo que tenga**. La entrega a medias no es un problema: este paso no se puntúa por completarlo, y lo que se discute en vivo son las cosas con las que te chocaste.

**2. Lo ves resuelto en el directo.** El mentor escribe estos mismos tests, sobre este mismo requisito y este mismo proyecto, y después arregla la implementación, que es el paso que tú no haces. Si a ti no te salió, ahí ves que se puede y cómo. Por eso conviene **mirar sin teclear**: lo vas a repetir con calma después.

**3. Lo replicas.** Los prompts que use el mentor te llegan por escrito. Con ellos vuelves a tu entorno y rehaces el recorrido, que es donde se asienta.

> ⚠️ **En el paso 3 no esperes salidas idénticas, y no es un fallo tuyo.** La inteligencia artificial (IA) no es determinista: con el mismo prompt cambian los nombres de los casos, su orden y hasta cuántos escribe por cada Scenario. Lo que no cambia es qué tiene que estar en rojo, porque eso lo fija la spec y no el agente. Lo que se repite es **la forma del recorrido**, no el texto.

---

## 🛠️ Deja el entorno listo

### 1. Comprueba lo que necesita tu máquina

Cuatro cosas, cada una con el comando que dice si la tienes y el síntoma de tenerla mal. Compruébalas **antes** de clonar nada: las cuatro fallan más tarde y con mensajes que no mencionan la causa.

- **Docker, corriendo**: `docker ps`. Si dice `Cannot connect to the Docker daemon`, está instalado y **apagado**. Ojo, que ese mensaje es igual que el de no tenerlo. Se instala desde `https://docs.docker.com/get-started/get-docker/`.
- **Node.js 24 o superior**: `node -v`. La capa de base de datos que este proyecto instala declara que necesita **24 como mínimo**, así que con versiones anteriores la instalación avisa y el arranque puede morir con errores que no hablan de versiones. Se instala desde `https://nodejs.org`.
- **`make`**: `make --version`. Si no responde: en macOS viene con las herramientas de línea de comandos (`xcode-select --install`); en Linux, con el paquete `build-essential` o equivalente.
- **Una cuenta de GitHub**: la entrega es un pull request desde tu propio fork hacia el repositorio del curso.

> 🖥️ **Dónde funciona esto, porque no es en todas partes igual.** En **macOS** y en **Linux**, tal cual. En **Windows**, **dentro de WSL** (*Windows Subsystem for Linux*, el subsistema de Linux para Windows), y esto no es una preferencia: los atajos del proyecto están escritos con órdenes de shell de macOS y Linux (`cp`, `test`, `rm`), así que **en PowerShell no funcionan**.
>
> Y la parte que se olvida: **todo tiene que estar dentro de WSL**, no solo el último comando. El clon, Node y `make`. Lo que instales en Windows no existe dentro de esa terminal. Clona además dentro del sistema de ficheros de Linux (`~/…`) y no en `/mnt/c`, o la instalación de dependencias irá muy lenta.

### 2. Forkea y clona el proyecto

Se trabaja sobre **tu propio fork**, porque sobre el repositorio del curso no tienes permiso de escritura: la entrega es un pull request desde él hacia el del curso.

1. Entra en **https://github.com/LIDR-academy/flowsync-ai4devs-202609-seniors-1** y pulsa **Fork**.
2. Clona **tu fork** y entra en la carpeta.
3. Añade el repositorio original como `upstream` y trae de ahí la rama de partida:

```bash
git remote add upstream https://github.com/LIDR-academy/flowsync-ai4devs-202609-seniors-1.git
git fetch upstream
git checkout -b s11/start upstream/s11/start
```

> 🚨 **La rama de partida se trae de `upstream`, no de tu fork.** El formulario de Fork de GitHub trae marcada la casilla de copiar **solo la rama por defecto**, así que tu fork se lleva `main` y nada más. Un `git checkout s11/start` a secas moriría con un `did not match any file(s) known to git` que **no menciona al fork por ningún lado**. Y aunque desmarcaras la casilla, un fork es **una foto del momento**: no recibe las ramas que se publiquen después.

### 3. Instálalo y levántalo

No hay `package.json` en la raíz. Los comandos de `npm` se ejecutan dentro de `backend/` y de `frontend/`, y el `Makefile` de la raíz ya lo hace por ti.

```bash
make setup   # solo la primera vez: instala dependencias, crea los .env, levanta las bases y migra
make db-up   # levanta las dos bases de datos y espera a que estén sanas
make start   # levanta backend y frontend a la vez; Ctrl-C para los dos
make help    # lista todos los atajos
```

`make start` **se queda corriendo en esa terminal**: para lo demás, abre otra.

Comprueba que cada pieza vive:

- **Backend** en `http://localhost:3333`. Desde otra terminal: `curl -s http://localhost:3333`.
- **Frontend** en `http://localhost:5173`. Ábrelo en el navegador.
- **Las dos bases de datos** en el **54410** (desarrollo) y el **54411** (pruebas). No se usa el 5432 a propósito: quien tenga un PostgreSQL suyo levantado se lo encontraría ocupado, y el error que vería no menciona a Docker por ningún lado.

### 4. Comprueba la batería de pruebas antes de tocar nada

Es la mejor comprobación de que el entorno está bien montado, y además es tu línea de partida: apunta el número que te dé, porque vas a compararlo al final.

```bash
make test        # migra la base de pruebas y corre la suite entera
make test-unit   # solo la suite unitaria
make test-e2e    # solo la funcional: peticiones reales a la aplicación
```

> 🔎 **Fíjate en lo que contesta `make test-unit` y no sigas hasta haberlo mirado.** Es el hecho que abre este módulo, y verlo en tu propia pantalla vale más que leerlo.

### 5. Crea tu rama

Trabaja en **tu propia rama**, no en `s11/start`. Créala **antes del primer prompt** con este nombre:

```bash
git checkout -b tests-<tus-iniciales>
```

Si el agente commitea en una rama suya, tráete esos commits a la tuya con `git merge <esa-rama>` antes de empujar.

---

## 📋 La tarea

**Cubre con tests el requisito «Cuándo una tarea está vencida», que hoy no tiene ninguno. Empieza por el contrato, míralo en rojo, y baja la regla a un test que la llame directamente.**

Es el mismo encargo que se resuelve en el directo, con la misma unidad de trabajo y los mismos insumos. **Los prompts los escribes tú**, y son la mitad de lo que se entrega.

**La unidad de trabajo es una y está nombrada:** el Requirement **«Cuándo una tarea está vencida»** de `openspec/specs/tasks/spec.md`. No elijas otro. Sus Scenarios son el enunciado, así que no tienes que inventarte los casos: están escritos, y están escritos desde antes de que existiera el código.

> ✋ **Y el corte es fijo: no arregles la implementación.** El ejercicio termina con los tests escritos y en rojo. El arreglo se hace en el directo, y lo que se compara allí es **tu rojo con el de la clase**.

### 🅰️ Parte A: el contrato primero

1. Lee el Requirement entero y sus Scenarios.
2. Escribe **un archivo de tests funcionales** que los ejerza **entrando por HTTP** (*HyperText Transfer Protocol*, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Uno por Scenario.
3. Córrelo con `make test-e2e` y **quédate con la salida entera**, no solo con si pasó o no.

Cinco restricciones, y ninguna es decorativa:

- **No toques ni una línea fuera de `backend/tests/`.** Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.
- Los tests comprueban **lo que sale en la respuesta**, no lo que devuelve un método interno. El campo se llama `isOverdue` y viaja en el cuerpo.
- **El día de referencia se le pasa a la petición.** Nada de la fecha de hoy ni de ningún reloj.
- Sigue **la forma de aislamiento que ya usan** los tests de `backend/tests/functional/`, sin inventar otra.
- **No des por hecho ningún identificador**: usa el que te devuelva la creación.

### 🅱️ Parte B: bajar la regla, y solo la regla

La regla vive en `isOverdueOn`, en `backend/app/models/task.ts`. Crea `backend/tests/unit/`, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:

- Fecha anterior al día de referencia, y la tarea sin hacer.
- Fecha **exactamente igual** al día de referencia.
- Fecha posterior.
- Sin fecha.
- Tarea ya hecha, con la fecha pasada.

Y añade **un caso más que no sale de la spec**: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha. Ese no lo pide ningún requisito de producto. Sale de preguntarse cómo llega el dato de verdad, que es justo donde tu criterio no lo pone nadie por ti.

Sigue **sin tocar implementación**.

> 🔀 **No te asustes si el agente se lleva el trabajo a otra rama.** El propio proyecto le prohíbe commitear en una rama de partida, así que en cuanto tenga algo que guardar creará una rama nueva y commiteará ahí sin pedírtelo. Es el proyecto haciendo lo que se le mandó, no un descuido. `git branch` y `git log --oneline` te enseñan dónde está todo.

### Parte C: las tres líneas

En un `HALLAZGOS.md` en la raíz del repositorio:

1. **Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde**, con la cifra que te dio la pantalla.
2. **Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó.** Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.
3. **De qué dudaste**, o qué no pudiste comprobar.

**El entregable no es tener los tests perfectos: son las tres líneas.** Una parte A a medias con las tres líneas escritas vale más que lo contrario, porque lo que se discute en el directo es dónde te chocaste.

### Cómo saber que la has hecho bien

- **No hay ni una línea tocada fuera de `backend/tests/`.** Míralo con `git diff --stat`: si aparece el modelo o el controlador, tus tests nacieron verdes y no comprueban nada.
- **Tienes la salida entera de `make test-e2e` guardada**, no solo si pasó. La cifra de la primera línea sale de ahí.
- **Hay un caso rojo y sabes cuál.** Un archivo de tests que pasa entero sobre un requisito sin implementar es la señal de que los tests miran otra cosa.
- **Ningún test usa la fecha de hoy.** Busca la llamada al reloj en tus archivos: si está, mañana el resultado será otro y no habrás medido la regla.
- **Las tres líneas están escritas y son concretas.** La segunda es la que más sirve, y se responde mirando qué tienen en común los casos que sí fallaron.

> Entrégalo con lo que tenga.

---

## 📤 Cómo se entrega

1. Trabaja en la rama `tests-<tus-iniciales>` que creaste al dejar el entorno listo, y no en `s11/start`.
2. **Guarda tus prompts en `prompts.md`, en la raíz.** Ese nombre y esa ubicación no son negociables: es lo que lee la herramienta que revisa las entregas. El repositorio ya lo trae con su plantilla puesta. **Cada prompt va en su propio bloque de código**, con el modelo y la herramienta que usaste.
3. Empuja tu rama a tu fork (`git push -u origin tests-<tus-iniciales>`) y abre el **pull request desde tu fork hacia el repositorio del curso** (`github.com/LIDR-academy/flowsync-ai4devs-202609-seniors-1`; comprueba que el repositorio base que te propone GitHub es ese y no tu fork), con `HALLAZGOS.md` y `prompts.md` dentro.

### El plazo

**El plazo es antes del directo.**

---

## 📚 Si vas justo de tiempo

Prioriza la lección sobre **por qué el test que falla es la especificación que le das al agente**, que es exactamente lo que vas a hacer, y la que trata **cómo se sale de un verde falso con un segundo caso**. Las demás lecciones del módulo pueden esperar.

El resto del material de apoyo está en la **lección de recursos de este módulo**, y es opcional.

---

## ✅ Antes de conectarte, comprueba

- [ ] Estás en la rama de partida, sobre **tu fork**, y `git push` funciona.
- [ ] `docker ps` devuelve una tabla, `node -v` responde `v24` o más, y `make --version` responde.
- [ ] **Las dos bases levantan** en el 54410 y el 54411, y `make test` corrió una vez entero.
- [ ] Has leído el Requirement **«Cuándo una tarea está vencida»** y sus Scenarios.
- [ ] **Traes `HALLAZGOS.md`** con sus tres líneas, y tus tests dentro del cambio, en rojo.
- [ ] **`prompts.md` está relleno**, con modelo y herramienta en cada bloque.
- [ ] **Tu rama se llama `tests-<tus-iniciales>` y el pull request está abierto contra el repositorio del curso.**

> Trae el archivo tal como quedó, sin maquillarlo: lo que le falta es la mitad de lo interesante.

---

## 🎯 Qué te llevas del Módulo 11

**El modelo mental**: que el orden del encargo decide quién manda: si pides implementación y tests a la vez, los tests se escriben leyendo el código y describen lo que hace; si das un test que falla, el código tiene que obedecer a algo que no eligió. Que de un verde falso no se sale insistiendo, se sale con un segundo caso que el atajo no pueda satisfacer. Que se puede cubrir el 100% del código y no cubrir ni uno de los casos que el cliente consume, porque un test que llama a la función elige él los datos con los que entra y solo puede confirmar lo que ya creías. Que la base de datos de los tests no se finge y son dos, y que una separación que no has comprobado apagando una no es una separación. Y que escribir un test ya no cuesta nada, así que la pregunta dejó de ser cuántos tienes y pasó a ser cuáles no deberían existir, porque cada uno es un compromiso de mantenimiento que alguien va a pagar.

**Lo que queda en el proyecto**: un archivo de tests funcionales que ejerce, uno por uno, los casos de un requisito que no tenía ninguno, entrando por donde entra el cliente de verdad. Un directorio de tests unitarios con los bordes de una regla dentro, que es el primer contenido que ese nivel tiene desde que el proyecto existe. Un fichero de hallazgos con tus tres líneas y tus números. Y el registro de tus prompts, con la forma exacta en que se lo pediste.

> 👥 **Qué te llevas según de dónde vengas.**
> - **Si eres dev**: da primero el test que falla, sal de un verde falso con un segundo caso, empieza por donde entra el cliente y golpea la base de datos de verdad. Y borrar un test que no sirve es un acto profesional perfectamente respetable.
> - **Si vienes de producto o gestión**: el test que se escribe primero obliga a decidir cosas que en el otro orden nadie decide, y varias son de producto. También explica dos frases que habrás oído: «pero si teníamos tests», y por qué un cambio pequeño se estima en horas y se entrega en días.
> - **Si no tienes background técnico**: quien pide «haz que esto pase» recibe exactamente eso. Y una imitación solo puede confirmar lo que ya creías.
