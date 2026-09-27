# Comparación: con harness vs sin harness

## Ticket utilizado .

**Título:** Mostrar un mensaje claro cuando falle el inicio de sesión

**Descripción:**  
Como usuario de FlowSync, quiero recibir un mensaje claro cuando mis credenciales no sean válidas, para entender por qué no pude iniciar sesión.

**Criterios de aceptación:**

- Si el inicio de sesión falla por credenciales incorrectas, el usuario debe ver un mensaje visible en la interfaz.
- El mensaje debe desaparecer o actualizarse cuando el usuario vuelva a intentar iniciar sesión.
- La funcionalidad existente de inicio de sesión debe seguir funcionando para credenciales válidas.
- La implementación debe mantener el estilo visual existente de la aplicación.

---

## Comparación general

| Criterio | Con harness | Sin harness |
|---|---|---|
| Archivos funcionales modificados | 3 | 0 |
| Archivos modificados | `frontend/src/App.tsx`, `frontend/src/LoginForm.tsx`, `frontend/src/LoginForm.css` | Ninguno |
| Inspeccionó el backend | Sí | Sí |
| Consultó el contrato de login | Sí | Sí |
| Implementó una solución | Sí | No |
| Necesitó intervención del usuario | 0 | 1 |
| Resultado de `npm run lint` | PASS | No aplica |
| Resultado de `npm run build` | PASS | No aplica |
| Estado final | Implementación generada | Ejecución detenida a la espera de aclaración |

---

## Corrida con harness

El harness utilizado tuvo dos piezas principales:

1. `CLAUDE.md`, como archivo de instrucciones persistentes.
2. Verificación posterior mediante:

```bash
cd frontend
npm run lint
npm run build
```

El agente inspeccionó el backend antes de implementar y utilizó el endpoint existente:

```text
POST /api/v1/auth/login
```

En lugar de modificar la lógica del backend, implementó la solución en el frontend mediante los siguientes archivos:

- `frontend/src/App.tsx`
- `frontend/src/LoginForm.tsx`
- `frontend/src/LoginForm.css`

La implementación añadió:

- formulario de email y contraseña;
- llamada al endpoint de login existente;
- tratamiento de errores HTTP;
- mensaje visible para credenciales incorrectas;
- mensaje para errores de validación;
- mensaje para errores de conexión;
- limpieza del mensaje de error al volver a intentar;
- estado visual durante el envío;
- mensaje de sesión iniciada cuando la autenticación tiene éxito.

### Verificaciones

Las comprobaciones posteriores terminaron correctamente:

```text
npm run lint   -> PASS
npm run build  -> PASS
```

### Convenciones respetadas

El agente respetó varias de las reglas incluidas en el harness:

- no modificó la lógica del backend;
- inspeccionó el backend antes de asumir el contrato de la API;
- no inventó un endpoint nuevo;
- mantuvo TypeScript;
- separó el formulario en un componente independiente;
- utilizó estilos compatibles con las variables CSS existentes;
- el código pasó correctamente el linter;
- el frontend compiló correctamente.

### Aspectos que revisaría manualmente

Aunque la implementación funciona técnicamente, el ticket original estaba orientado al tratamiento de errores de inicio de sesión y no solicitaba explícitamente la creación completa del formulario.

El agente amplió el alcance al implementar un formulario mínimo de login porque el frontend inicial no contaba con esa funcionalidad.

Antes de integrar este cambio en un proyecto real revisaría:

- si el formulario completo debía formar parte de este ticket;
- cómo debe almacenarse y gestionarse el token;
- qué comportamiento debe ocurrir después de un login exitoso;
- la coherencia visual con el resto de la aplicación;
- pruebas funcionales contra el backend real.

---

## Corrida sin harness

Se utilizó exactamente el mismo ticket que en la corrida con harness.

El agente inspeccionó el proyecto y detectó que el frontend seguía siendo la plantilla inicial de Vite y que no existía una pantalla de inicio de sesión.

También identificó que el backend ya disponía del endpoint:

```text
POST /api/v1/auth/login
```

Sin embargo, decidió no modificar ningún archivo.

El agente señaló que el ticket asumía una funcionalidad previa que todavía no existía y solicitó una decisión adicional antes de continuar.

Propuso tres alternativas:

1. implementar primero la funcionalidad de login;
2. crear un formulario mínimo como parte del ticket actual;
3. trabajar sobre otra rama donde el login ya estuviera implementado.

La corrida se detuvo en ese punto.

No se proporcionó ninguna aclaración adicional para evitar modificar las condiciones del experimento.

### Archivos funcionales modificados

Ninguno.

Los únicos archivos que aparecían modificados en esta copia eran:

```text
backend/package-lock.json
frontend/package-lock.json
```

Estos cambios correspondían a la instalación previa de dependencias y no a la ejecución del agente.

### Intervenciones requeridas

El agente necesitó una intervención del usuario para decidir cómo resolver la ausencia de una pantalla de login.

La intervención no se realizó.

---

# Parte B

## 1. Qué piezas monté y cuál costó más de lo esperado

Monté dos piezas principales de harness:

- `CLAUDE.md` como mecanismo de orientación previa;
- `npm run lint` y `npm run build` como mecanismos de comprobación posterior.

La pieza que requirió más criterio fue `CLAUDE.md`.

El reto fue escribir instrucciones suficientemente concretas para orientar al agente sin convertirlas en una especificación técnica del ticket.

Las reglas principales indicaban que el agente debía:

- inspeccionar el código existente antes de modificarlo;
- consultar el backend para comprender el contrato real;
- no inventar endpoints ni campos;
- evitar cambios innecesarios en el backend;
- mantener los cambios pequeños y centrados;
- conservar la seguridad de tipos;
- ejecutar verificaciones antes de considerar terminada la tarea.

## 2. Primera diferencia observada entre las dos salidas

La primera diferencia fue el nivel de autonomía con el que los dos agentes resolvieron la ambigüedad del ticket.

En la copia con harness, el agente inspeccionó el backend y tomó la decisión de implementar un formulario mínimo de login para poder satisfacer el ticket.

En la copia sin harness, el agente detectó la misma ausencia de una pantalla de login, pero se detuvo y solicitó una aclaración antes de modificar el código.

La diferencia se hizo visible antes incluso de comparar los archivos modificados: una ejecución produjo una implementación y la otra terminó solicitando una decisión adicional.

## 3. Algo escrito en el harness que el agente no cumplió completamente

El harness indicaba que los cambios debían mantenerse pequeños y centrados en la funcionalidad solicitada.

Sin embargo, el agente amplió el alcance del ticket al crear un formulario completo de inicio de sesión.

Esta decisión era necesaria para poder implementar el mensaje de error en un frontend que todavía no tenía login, pero muestra que una instrucción escrita en el harness no garantiza por sí sola que el agente interprete el alcance exactamente como lo esperaba el desarrollador.

El harness orientó la ejecución y redujo la necesidad de intervención, pero no eliminó la necesidad de revisar las decisiones tomadas por el agente.
