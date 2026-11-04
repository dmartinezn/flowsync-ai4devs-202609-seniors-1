# Ejercicio 8 — Evaluación de cumplimiento de documentación

## Parte A. Predicción inicial

Predicción registrada antes de ejecutar Claude: 4 de 5 intentos (80 %).

Hipótesis: Claude actualizará espontáneamente el README de la
capacidad tasks en cuatro de cinco ejecuciones, aunque el prompt
solo solicite implementar el endpoint DELETE.

## Parte B. Resultados observados

Se realizaron cinco ejecuciones independientes del mismo prompt,
partiendo de la rama s8/start.

| Intento | Endpoint DELETE | README actualizado | Pruebas reportadas | Commit | Cumple |
|---|---|---|---|---|---|
| 1 | Sí | Sí | 29/29 | f34f54b | Sí |
| 2 | Sí | Sí | 27/27 | 7ba9c4d | Sí |
| 3 | Sí | Sí | 29/29 | b0d11dc | Sí |
| 4 | Sí | Sí | 27/27 | 1f44e1d | Sí |
| 5 | Sí | Sí | 27/27 | fb84206 | Sí |

### Resultado

- Predicción inicial: 4/5 (80 %).
- Resultado observado: 5/5 (100 %).
- Diferencia: +20 puntos porcentuales.
- Criterio de cumplimiento: actualización de
  docs/capabilities/tasks/README.md documentando DELETE.

### Tres conclusiones

1. La regla de documentación se cumplió en las cinco ejecuciones,
   incluso cuando el prompt no solicitaba actualizar el README.

2. La predicción inicial fue conservadora: se estimó un 80 % de
   cumplimiento y se observó un 100 % en esta muestra de cinco intentos.
   El resultado no garantiza el mismo comportamiento en futuras ejecuciones.

3. La actualización del README fue consistente, pero se observaron
   incidencias técnicas con la generación o validación de OpenAPI
   en el entorno local. Es importante evaluar por separado el
   cumplimiento de documentación y la ejecución de herramientas.

## Evidencia y metodología

- Herramienta: Claude Code.
- Modelo: Claude Opus 5.5 mediante Amazon Bedrock.
- Base inicial de cada intento: upstream/s8/start.
- Se utilizó el mismo prompt en las cinco ejecuciones.
- La documentación se verificó mediante diferencias de Git
  respecto a upstream/s8/start.
- Las pruebas indicadas corresponden a los resultados reportados
  por Claude en cada ejecución.
- Se conservaron las ramas y commits de los intentos.
