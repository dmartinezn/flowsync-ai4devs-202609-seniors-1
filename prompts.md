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

**Modelo:** Opus 5.5 1M 
**Herramienta:** Claude Code

```
Inspecciona únicamente el vertical de cuentas y acceso de FlowSync.

Quiero documentar el comportamiento actual del sistema, no proponer cambios.

Cubre solo:
- registro,
- inicio de sesión,
- sesión,
- perfil.

Revisa backend y frontend.

Devuélveme una primera propuesta de spec en castellano con este formato:

## Purpose

## Requirements

### Requirement: ...

#### Scenario: ...

- **WHEN** ...
- **THEN** ...

Reglas obligatorias:
- describe solo comportamiento observable desde fuera;
- no menciones nombres de archivos;
- no menciones nombres de clases;
- no menciones rutas internas de código;
- no uses ADDED, MODIFIED ni REMOVED;
- no propongas cambios;
- no corrijas el código;
- no incluyas tareas, proyectos ni otras capacidades fuera de cuentas y acceso.

La spec debe describir lo que el sistema hace hoy..
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.


## Prompt 2

**Modelo:** Opus 5.5 1M 
**Herramienta:** Claude Code

```
Ahora quiero contrastar esta spec contra el código existente.

NO modifiques el código y NO reescribas todavía la spec.

Para cada uno de los 6 Requirements que propusiste:

1. Indica qué escenarios puedes confirmar leyendo el código.
2. Indica cuáles no puedes confirmar con seguridad.
3. Señala cualquier comportamiento del código que contradiga la spec.
4. Señala cualquier afirmación de la spec que sea una inferencia y no comportamiento observable.
5. Indícame exactamente qué parte del código debería revisar yo personalmente para comprobar cada caso.

Mantén el análisis limitado al vertical de cuentas y acceso:
registro, login, sesión y perfil.

No propongas arreglos.
No cambies archivos.
El objetivo es auditar la spec contra el código existente.
```

### Prompt 3

**Modelo:** Opus 5.5 1M 
**Herramienta:** Claude Code

```

A partir de la spec original y de la auditoría que acabamos de realizar contra el código,
reescribe la spec final del vertical de cuentas y acceso.

NO modifiques ningún archivo de código.

Mantén exactamente este formato:

## Purpose

## Requirements

### Requirement: ...

#### Scenario: ...

- **WHEN** ...
- **THEN** ...

Reglas:

- escribe en castellano;
- usa SHALL en la descripción de cada Requirement;
- describe únicamente comportamiento observable desde fuera;
- no menciones nombres de archivos, clases, funciones ni detalles internos de implementación;
- no uses ADDED, MODIFIED ni REMOVED;
- no inventes comportamiento que no pudimos confirmar;
- cuando la evidencia no permita afirmar un detalle concreto, redacta el escenario de forma que no finja esa certeza;
- mantén el alcance exclusivamente en registro, login, sesión, protección de acceso y perfil;
- no incluyas tareas ni ninguna otra capacidad de FlowSync;
- no propongas arreglos.

Corrige específicamente estos puntos detectados durante la auditoría:

1. En logout, no limites el escenario al fallo de red: el comportamiento observado es que la sesión local termina incluso si falla la petición de cierre remoto por cualquier motivo.

2. En restauración de sesión, no digas que la sesión se recupera automáticamente cuando vuelve el servidor. Si la validación falla por un error distinto de sesión inválida, el usuario queda no autenticado durante esa ejecución y una recarga posterior puede volver a intentar usar el token conservado.

3. En login, no afirmes detalles sobre el mensaje exacto o sobre si email inexistente y contraseña incorrecta son indistinguibles si eso no quedó confirmado directamente.

4. En registro con email duplicado, no afirmes un texto exacto de error si no quedó confirmado.

5. No afirmes nada sobre expiración temporal de tokens, porque no quedó resuelto si es contrato o comportamiento por defecto de la biblioteca.

Después de la spec añade:

## Parte B

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 6
- Requisitos comprobados por mí abriendo el código: 6

### 2. Incoherencias encontradas

Incluye de forma concisa las incoherencias descubiertas en logout, restauración de sesión y la incertidumbre sobre el comportamiento exacto del login.

### 3. No supe decidir si era bug o contrato

Incluye al menos:

- el caso en que falla la restauración por un problema distinto de una sesión inválida: el usuario queda no autenticado pero el token persiste y puede volver a intentarse tras recargar;

- la ausencia de una expiración temporal explícita al crear tokens: el código revisado no permite decidir si es parte del contrato o simplemente comportamiento por defecto de la biblioteca.

No resuelvas esas ambigüedades. Déjalas expresamente como cosas que el código no permite decidir.
```