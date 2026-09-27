# Alcance MVP — FlowSync

## 1. Terreno existente

FlowSync ya dispone de autenticación end-to-end: registro, login, logout y consulta del perfil del usuario autenticado, con backend en AdonisJS y frontend en React.

El modelo de datos actual contiene únicamente usuarios y tokens de acceso.

Todavía no existen capacidades de gestión de tareas, equipos o proyectos, ni entidades de dominio asociadas.

Por tanto, el punto de partida es una aplicación con autenticación funcional, pero sin implementación del dominio de trabajo colaborativo.

---

## 2. Interrogatorio del problema

Antes de definir el MVP se plantearon cinco preguntas destinadas a reducir la incertidumbre sobre el problema, los usuarios y la frontera del producto.

### Pregunta 1

**¿Qué pasa hoy, concretamente, cuando un equipo remoto no hace su reunión de sincronización? ¿Qué se rompe o qué decisión se retrasa?**

El dolor principal es la daily de sincronización y la pregunta constante de “¿en qué estás?”.

El problema concreto aparece cuando dos personas terminan trabajando sobre el mismo módulo o tarea sin saberlo.

La información sobre el trabajo actual no es suficientemente visible ni fresca para que los miembros del equipo puedan tomar decisiones sin preguntarse directamente.

### Pregunta 2

**Si FlowSync funcionara perfectamente, ¿quién notaría la diferencia primero?**

El valor principal lo reciben los pares del equipo.

FlowSync no está concebido como una herramienta de reporte hacia un lead, manager o stakeholder. Su propósito inicial es mejorar la coordinación horizontal entre las personas que realizan el trabajo.

### Pregunta 3

**¿Qué reunión o hábito concreto se quiere hacer innecesario?**

La ronda diaria de “¿en qué estás?”.

El MVP no pretende sustituir toda la coordinación del equipo ni todas sus reuniones. La hipótesis es más limitada: una vista suficientemente clara y fresca del trabajo actual puede hacer innecesaria esa ronda de sincronización.

### Pregunta 4

**¿Qué significa exactamente “más en tiempo real”?**

“Tiempo real” significa que los cambios de estado de las tareas deben poder verse sin que el usuario tenga que refrescar manualmente la información.

La frescura corresponde al estado de la tarea, no a la presencia de las personas.

El estado lo actualiza manualmente la persona que realiza la tarea.

### Pregunta 5

**¿Cuál es la versión más pequeña del producto que permitiría probar la hipótesis con un equipo real?**

Una vertical fina y usable de punta a punta.

Cada tarea necesita como mínimo:

- título;
- responsable;
- estado;
- fecha.

La lista de trabajo debe permitir conocer qué está ocurriendo y concentrarse en las tareas mediante un filtro por estado.

El primer equipo de referencia es un equipo remoto pequeño de producto SaaS, de entre 3 y 10 personas.

---

## 3. Definición del MVP

### Problema

Los equipos remotos pequeños dependen de una ronda frecuente de “¿en qué estás?” para conocer el estado del trabajo.

La ausencia de una fuente suficientemente visible y fresca puede provocar duplicidad de trabajo y decisiones incorrectas, como comenzar una actividad que otra persona ya está realizando.

El problema que se quiere resolver no es la existencia de reuniones en general, sino la necesidad de preguntar repetidamente por el estado actual del trabajo.

### Usuarios

El usuario principal es cada miembro individual de un equipo remoto pequeño, de entre 3 y 10 personas.

El valor se produce entre pares: una persona actualiza el estado de su trabajo y las demás pueden consultarlo antes de decidir qué hacer.

El perfil inicial de referencia es un miembro de un equipo distribuido de producto SaaS.

El MVP no está orientado a managers, leads o stakeholders que necesiten una herramienta de reporte hacia arriba.

### Propuesta de valor

FlowSync proporciona un espacio compartido en el que los miembros de un equipo pueden consultar qué tareas existen, quién es responsable de ellas y cuál es su estado actual.

La actualización del estado debe ser suficientemente sencilla y rápida para formar parte natural del trabajo diario.

El valor que se pretende validar es que una fuente compartida y suficientemente fresca sobre el trabajo actual permita reducir o eliminar la ronda de “¿en qué estás?”.

FlowSync pretende ser el lugar donde se actualiza el trabajo, no una herramienta en la que posteriormente se redacta un reporte sobre lo ocurrido.

### Alcance

El MVP incluye cinco capacidades.

1. **Crear una tarea**

   Un usuario puede crear una tarea con los datos mínimos necesarios para que el resto del equipo pueda comprenderla: título, responsable, estado y fecha.

2. **Cambiar el estado de una tarea**

   La persona que realiza el trabajo puede actualizar el estado de la tarea cuando cambia su situación.

   Esta es la acción central para mantener fresca la información compartida.

3. **Listar las tareas del espacio compartido**

   Los miembros pueden consultar las tareas existentes y ver, como mínimo, su título, responsable y estado.

4. **Filtrar las tareas por estado**

   El usuario puede centrarse en las tareas que se encuentran en un estado determinado.

5. **Ver los cambios de estado sin refrescar manualmente**

   Cuando cambia el estado de una tarea, los demás usuarios pueden percibir ese cambio sin tener que actualizar manualmente la página.

   El MVP define únicamente el efecto esperado para el usuario, no el mecanismo técnico utilizado para conseguirlo.

La hipótesis principal del MVP es:

> Si los miembros de un equipo remoto pequeño disponen de una vista compartida, sencilla y suficientemente fresca del estado actual de sus tareas, podrán reducir la necesidad de realizar la ronda diaria de “¿en qué estás?”.

El criterio inicial de éxito es que, después de una semana de uso real, el equipo pueda cancelar o reducir esa ronda porque la información disponible en FlowSync sea suficiente para decidir qué trabajo iniciar y evitar duplicidades.

### NO-alcance

El NO-alcance forma parte explícita del MVP. Las siguientes capacidades se excluyen porque no son necesarias para validar la hipótesis principal.

#### Edición general de una tarea después de crearla

El MVP no necesita demostrar que FlowSync puede funcionar como un gestor completo de tareas.

Permitir modificar libremente todos los campos después de la creación añade capacidad de mantenimiento, pero no ayuda directamente a validar si la visibilidad del responsable y del estado reduce la necesidad de preguntar “¿en qué estás?”.

El cambio de estado sí permanece dentro porque es parte central de la hipótesis de frescura.

#### Sprints, estimaciones, épicas y backlog priorizado

Estas capacidades ayudarían a validar si FlowSync puede utilizarse para planificación y gestión futura del trabajo.

Esa no es la hipótesis de este MVP.

El MVP pretende validar coordinación sobre el trabajo actual, no planificación de producto ni gestión ágil completa.

#### Notificaciones push

Las notificaciones permitirían probar si interrumpir activamente al usuario mejora la coordinación.

El producto parte de una hipótesis diferente: que la información puede estar disponible cuando el usuario decide consultarla sin necesidad de interrumpirlo.

Por tanto, las notificaciones no son necesarias para validar si una fuente compartida y fresca puede sustituir la ronda de “¿en qué estás?”.

#### Integraciones con Slack, Jira u otras herramientas

Las integraciones permitirían probar si FlowSync debe vivir dentro del flujo de herramientas que el equipo ya utiliza.

El MVP no necesita validar todavía esa hipótesis.

Primero se quiere determinar si el producto genera suficiente valor por sí mismo para mejorar la coordinación.

#### Roles y permisos avanzados

El MVP no pretende validar modelos jerárquicos de acceso, administración o gobierno.

El equipo de referencia es pequeño y trabaja como un grupo de pares.

Añadir permisos granulares no ayuda a probar si compartir el estado actual del trabajo reduce la necesidad de sincronización verbal.

#### Gestión compleja de proyectos y tareas

Quedan fuera funcionalidades como subtareas, dependencias, estimaciones, planificación detallada o estructuras complejas de proyecto.

Estas capacidades probarían si FlowSync puede competir con herramientas completas de gestión de proyectos.

La hipótesis del MVP es mucho más estrecha: comprobar si una representación simple y fresca del trabajo actual mejora la coordinación entre pares.

#### Reportes para leads o managers

No se incluyen dashboards, informes agregados ni vistas específicamente diseñadas para supervisión.

Estas funciones permitirían validar una necesidad de reporte hacia arriba, pero el producto está inicialmente orientado al valor entre pares.

---

# Parte B

## 1. Los dos números

**Capacidades propuestas inicialmente por la IA: 6.**

**Capacidades que quedaron dentro después del recorte: 5.**

La capacidad eliminada del alcance inicial fue la edición general de los campos básicos de una tarea después de su creación.

## 2. Tres cosas que dejé fuera y por qué

### Edición general de una tarea

La dejé fuera porque no ayuda a validar la hipótesis de que una vista compartida del estado actual reduzca la necesidad de preguntar “¿en qué estás?”.

Para probar esa hipótesis es suficiente con crear una tarea y poder cambiar su estado.

### Notificaciones push

Las dejé fuera porque permitirían validar otra hipótesis: que la coordinación mejora cuando el sistema interrumpe activamente a los usuarios.

El MVP pretende probar primero si basta con que la información esté disponible y suficientemente fresca cuando el usuario decide consultarla.

### Integraciones con Slack o Jira

Las dejé fuera porque introducirían la hipótesis adicional de que FlowSync necesita integrarse con herramientas existentes para ser adoptado.

Antes de validar esa integración, el MVP debe comprobar si la propuesta básica genera valor como producto independiente.

## 3. La exclusión de la que menos seguro estoy

La exclusión de la que menos seguro estoy es la **edición general de una tarea después de crearla**.

Por un lado, no es necesaria para validar directamente la hipótesis principal sobre visibilidad y frescura del estado.

Por otro, un equipo real puede cometer errores al crear una tarea o necesitar cambiar posteriormente el responsable o la fecha. Si la ausencia de edición genera suficiente fricción como para impedir el uso cotidiano del producto, entonces dejaría de ser una funcionalidad secundaria y pasaría a ser necesaria para que el experimento fuera viable.

La incorporaría al MVP si durante el uso con el primer equipo se observa que la imposibilidad de corregir los datos básicos de una tarea impide mantener una fuente de información suficientemente fiable como para sustituir la ronda de “¿en qué estás?”.