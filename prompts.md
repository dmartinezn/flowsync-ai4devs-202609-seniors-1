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

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
## Prompt 1 — Terreno existente

**Herramienta:** Claude Code  
**Modelo:** Anthropic Claude 5.5 1M Context

### Prompt

Antes de definir el MVP de FlowSync, inspecciona el repositorio actual.

Quiero que me expliques únicamente:

1. Qué capacidades funcionales ya existen en el proyecto.
2. Cómo es, a alto nivel, el modelo de datos actual.

Resume el resultado en 3 a 5 líneas.

No propongas funcionalidades nuevas.
No definas todavía el MVP.
No diseñes endpoints, arquitectura ni cambios técnicos.
Solo describe el terreno que ya existe.


**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
```

```
## Prompt 2
Quiero definir el MVP de FlowSync a partir de esta idea:

"Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira."

Antes de proponer cualquier solución, haz exactamente cinco preguntas.

Las preguntas deben ser las cinco que más reduzcan la incertidumbre sobre:

- el problema real que queremos resolver,
- quién obtiene el valor,
- cómo se utilizaría el producto,
- qué significa "más en tiempo real",
- y cuál debería ser la frontera del MVP.

Haz una sola ronda de cinco preguntas.

No propongas todavía funcionalidades.
No diseñes el modelo de datos.
No propongas endpoints.
No hables de arquitectura ni implementación técnica.
```

```
## Prompt 3
No quiero que propongas funcionalidades, exclusiones ni soluciones todavía.

Quiero únicamente una ronda de EXACTAMENTE cinco preguntas abiertas sobre el producto FlowSync.

Las cinco preguntas deben ayudar a reducir incertidumbre sobre:

1. cuál es el problema concreto que duele hoy;
2. quién obtiene el valor principal;
3. qué comportamiento o reunión queremos sustituir;
4. qué significa exactamente "más en tiempo real";
5. cuál debe ser la frontera del MVP.

No uses checkboxes.
No me des opciones para elegir.
No propongas funcionalidades.
No definas el NO-alcance todavía.
No hables de tablas, modelo de datos, endpoints, arquitectura ni implementación.

Devuelve solamente las cinco preguntas, numeradas del 1 al 5.
```

```
## Prompt 4
Estas son las respuestas de producto ya decididas para las cinco preguntas.

1. El dolor principal hoy es la daily de sincronización y la pregunta constante de “¿en qué estás?”. El problema aparece cuando dos personas terminan trabajando sobre lo mismo sin saberlo.

2. Quien recibe principalmente el valor son los pares del equipo, no un lead ni un stakeholder. La intención no es crear una herramienta de reporte hacia arriba.

3. La reunión que se quiere reducir o eliminar es la ronda diaria de “¿en qué estás?”. El producto no pretende sustituir toda la coordinación del equipo.

4. “Tiempo real” significa poder ver los cambios de estado de las tareas sin refrescar manualmente. Es frescura del estado de la tarea, no presencia en tiempo real de las personas. La información la actualiza manualmente quien está realizando la tarea.

5. El MVP debe ser una vertical fina y usable de punta a punta. Una tarea necesita como mínimo título, responsable, estado y fecha. La lista se consume principalmente filtrando por estado. El éxito inicial sería que un equipo remoto pequeño pueda dejar de hacer la ronda de “¿en qué estás?” porque la información disponible sea suficientemente fresca y útil.

Contexto adicional ya decidido:

- Equipos remotos pequeños, de 3 a 10 personas.
- Primer usuario de referencia: un equipo pequeño de producto SaaS distribuido.
- Un único espacio compartido, sin una entidad compleja de “equipo”.
- El estado pertenece a la tarea, no a la persona.
- La señal debe ser un resumen que espera al usuario, no una notificación que interrumpe.
- FlowSync pretende ser el lugar donde se hace el trabajo, no solo donde se reporta.
- Quedan fuera del MVP: sprints, estimaciones, épicas, backlog priorizado, notificaciones push, integración con Slack y roles/permisos avanzados.
- “Menos rollo que Jira” significa que crear una tarea y cambiar su estado debe ser muy rápido.

Con estas respuestas, resume primero los supuestos que detectes. No propongas todavía el alcance final.

```

```
### Prompt 5
Continúa con la definición del MVP.

Toma como hechos las respuestas de producto ya proporcionadas.

Mantén como supuestos explícitos, no como requisitos confirmados:

- que exista una pantalla específica de llegada/resumen;
- el mecanismo técnico usado para actualización sin refresco;
- que filtrar por estado sea la única navegación;
- cómo funciona la pertenencia o invitación al espacio;
- si hace falta histórico o auditoría.

No resuelvas esos supuestos con decisiones técnicas.

Propón ahora el MVP en exactamente estos cinco bloques:

1. Problema
2. Usuarios
3. Propuesta de valor
4. Alcance
5. NO-alcance

Sé agresivo recortando.

En "Alcance", enumera explícitamente cada capacidad incluida para poder contar cuántas propones.

En "NO-alcance", enumera cada exclusión y explica para cada una qué hipótesis del producto NO ayuda a validar.

No incluyas:
- modelo de datos,
- tablas,
- endpoints,
- arquitectura,
- tecnologías,
- diagramas,
- requisitos técnicos.

El documento debe seguir siendo un documento de producto, no una especificación técnica.
```
```
### Prompt 6
Recorta la propuesta anterior de 6 capacidades a 5.

No elimines la capacidad de reflejar cambios de estado sin refresco manual, porque forma parte de la definición de “tiempo real” del producto.

Elimina la capacidad que menos contribuya a validar la hipótesis principal del MVP.

Devuélveme:
1. las 5 capacidades finales;
2. cuál eliminaste;
3. por qué esa exclusión no impide validar la hipótesis principal.
```