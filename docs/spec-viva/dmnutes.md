## Purpose

Esta especificación documenta el comportamiento actual del vertical de cuentas y acceso de FlowSync: registro, inicio de sesión, cierre de sesión, protección de acceso y consulta del perfil. Describe únicamente comportamiento observable desde fuera del sistema, ajustado tras contrastar una primera versión contra el código y realizar verificaciones directas sobre la API.

## Requirements

### Requirement: Registro de una cuenta nueva

El sistema SHALL permitir crear una cuenta indicando email, contraseña, confirmación de contraseña y el campo de nombre completo, que puede no tener un valor asignado, e iniciar sesión automáticamente cuando el registro se completa con éxito.

#### Scenario: Registro con datos válidos

- **WHEN** se envían un email no usado previamente, una contraseña de entre 8 y 32 caracteres, su confirmación idéntica y el campo de nombre completo
- **THEN** se crea la cuenta y se devuelven los datos del usuario junto con un token de sesión ya activo, sin necesidad de iniciar sesión por separado

#### Scenario: Email ya registrado

- **WHEN** se intenta registrar una cuenta con un email que ya existe en el sistema
- **THEN** el registro se rechaza con un error asociado al campo de email por conflicto de unicidad; el texto exacto del mensaje mostrado no queda establecido por este documento

#### Scenario: La confirmación de contraseña no coincide

- **WHEN** la contraseña y su confirmación no son iguales
- **THEN** el registro se rechaza y el error se asocia al campo de confirmación de contraseña

#### Scenario: Contraseña fuera del rango permitido

- **WHEN** la contraseña tiene menos de 8 caracteres o más de 32
- **THEN** el registro se rechaza indicando el límite de longitud incumplido

#### Scenario: Email con formato inválido

- **WHEN** el email no tiene un formato de correo válido
- **THEN** el registro se rechaza indicando que el email no es válido

#### Scenario: Campo de nombre completo omitido

- **WHEN** se intenta registrar una cuenta sin incluir el campo de nombre completo
- **THEN** el registro se rechaza indicando que el campo debe estar definido

#### Scenario: Nombre completo sin valor

- **WHEN** se registra una cuenta incluyendo el campo de nombre completo con valor nulo
- **THEN** la cuenta se crea correctamente, el usuario queda sin nombre completo asignado y la sesión se inicia

### Requirement: Inicio de sesión

El sistema SHALL permitir iniciar sesión con email y contraseña, devolviendo un token de sesión cuando las credenciales son correctas.

#### Scenario: Credenciales correctas

- **WHEN** se envían el email y la contraseña de una cuenta existente y coinciden
- **THEN** se devuelven los datos del usuario junto con un token de sesión válido

#### Scenario: Credenciales incorrectas

- **WHEN** el email no corresponde a ninguna cuenta, o la contraseña no coincide con la de la cuenta
- **THEN** el inicio de sesión se rechaza; no queda establecido por este documento si ambos casos producen la misma respuesta ni si el mensaje mostrado permite distinguir cuál de los dos datos es el incorrecto

### Requirement: Cierre de sesión

El sistema SHALL permitir cerrar una sesión activa, invalidando el token con el que se accedía.

#### Scenario: Cierre de sesión con sesión válida

- **WHEN** un usuario autenticado solicita cerrar sesión
- **THEN** el token usado deja de ser válido para futuras peticiones y la sesión local del usuario se da por finalizada

#### Scenario: Cierre de sesión con fallo en la petición remota

- **WHEN** se solicita cerrar sesión y la petición de cierre al servidor no se completa correctamente, sea por la razón que sea
- **THEN** la sesión se da por finalizada igualmente en el lado del usuario, con independencia del resultado de esa petición

### Requirement: Persistencia y validez de la sesión

El sistema SHALL mantener la sesión entre recargas de la aplicación mientras el token siga siendo válido, revalidándolo contra el servidor al arrancar.

#### Scenario: Recarga de la aplicación con una sesión previa

- **WHEN** se abre la aplicación y existe un token de una sesión anterior
- **THEN** se muestra un estado de carga mientras se comprueba ese token contra el servidor, y solo después se decide si el usuario está autenticado o no

#### Scenario: Token de una sesión anterior rechazado explícitamente como inválido

- **WHEN** el servidor rechaza el token guardado como no válido al comprobarlo
- **THEN** la sesión se cierra localmente, el token guardado se descarta y se informa de que la sesión anterior caducó y hay que iniciar sesión de nuevo

#### Scenario: Fallo al validar una sesión previa por un motivo distinto a un token inválido

- **WHEN** la validación de un token guardado no puede completarse por un motivo distinto a que el servidor lo rechace explícitamente como inválido
- **THEN** el usuario queda como no autenticado durante esa ejecución de la aplicación, y el token guardado no se descarta, por lo que una recarga posterior puede volver a intentar usarlo

#### Scenario: Petición autenticada sin token o con token inválido

- **WHEN** se solicita un recurso que requiere sesión sin aportar un token, o aportando uno que no es válido
- **THEN** la petición se rechaza como no autorizada

### Requirement: Acceso a pantallas según el estado de la sesión

El sistema SHALL restringir qué pantallas pueden verse según si hay una sesión activa o no.

#### Scenario: Acceso a una pantalla protegida sin sesión

- **WHEN** un usuario sin sesión activa intenta acceder a la pantalla de perfil
- **THEN** es redirigido a la pantalla de inicio de sesión

#### Scenario: Acceso a login o registro con sesión activa

- **WHEN** un usuario con sesión activa intenta acceder a las pantallas de inicio de sesión o registro
- **THEN** es redirigido a la pantalla de perfil

#### Scenario: Mientras se resuelve el estado de la sesión

- **WHEN** todavía no se ha determinado si la sesión guardada es válida
- **THEN** no se aplica ninguna redirección de acceso hasta que ese estado quede resuelto

### Requirement: Consulta del perfil del usuario autenticado

El sistema SHALL permitir a un usuario con sesión activa consultar los datos de su propia cuenta.

#### Scenario: Consulta del perfil con sesión válida

- **WHEN** un usuario autenticado solicita los datos de su perfil
- **THEN** se devuelven su nombre completo, si lo tiene, email, iniciales y fechas de creación y última actualización de la cuenta

#### Scenario: Usuario sin nombre completo asignado

- **WHEN** se muestra el perfil de un usuario cuyo nombre completo tiene valor nulo
- **THEN** se indica que no tiene nombre asignado y las iniciales mostradas se derivan de su email

#### Scenario: Consulta del perfil sin sesión válida

- **WHEN** se solicitan los datos de perfil sin una sesión activa y válida
- **THEN** la consulta se rechaza como no autorizada

## Parte B

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 6
- Requisitos comprobados por mí abriendo el código: 6

### 2. Incoherencias encontradas

- **Registro**: la spec original consideraba el nombre completo opcional en el sentido de poder omitir el campo. Al probar la API sin `fullName`, el sistema respondió `422` indicando que el campo debía estar definido. Una segunda prueba enviando `fullName: null` devolvió `200 OK`, por lo que el comportamiento real es que el campo debe estar presente, aunque puede no tener valor.
- **Logout**: la spec original limitaba el escenario de fallo al caso de una petición que no pudiera completarse, dando a entender que solo cubría caídas de red. El comportamiento observado no distingue causas: la sesión local termina incluso si la petición remota falla por otro motivo.
- **Restauración de sesión**: la spec original afirmaba que la sesión podía recuperarse cuando el servidor volviera a estar disponible, sugiriendo una recuperación automática. El comportamiento observado solo vuelve a intentar la validación cuando la aplicación se carga de nuevo; no existe un reintento automático en segundo plano.
- **Login**: la spec original afirmaba que un email inexistente y una contraseña incorrecta producían el mismo mensaje genérico sin distinguir el campo erróneo. Esa afirmación no quedó verificada directamente, por lo que no hay evidencia suficiente para sostenerla como contrato.

### 3. No supe decidir si era bug o contrato

- Cuando la restauración de una sesión falla por un motivo distinto a que el servidor rechace explícitamente el token como inválido, el usuario queda no autenticado durante esa ejecución, pero el token guardado no se elimina y puede volver a intentarse tras una recarga. No pude decidir si conservar el token para una recuperación posterior, sin reintento automático, es el contrato deseado o un efecto secundario de la implementación.
- Al crear un token de sesión no se observa una configuración explícita de expiración temporal. El código revisado no permite decidir si la ausencia de expiración forma parte del contrato del sistema o si es simplemente el comportamiento por defecto de la biblioteca de autenticación. Queda expresamente sin resolver.
