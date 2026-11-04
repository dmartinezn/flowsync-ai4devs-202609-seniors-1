# Ejercicio 8 — Registro de prompts

## Herramienta y modelo

- Herramienta: Claude Code.
- Modelo: Claude Opus 5.5.
- Proveedor: Amazon Bedrock.

## Prompt utilizado

Se utilizó exactamente el mismo prompt en los cinco intentos.

### Intentos 1, 2, 3, 4 y 5

```text
Añade a la capacidad tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a los demás de tasks.


```

## Metodología

1. Restaurar el repositorio a upstream/s8/start.
2. Iniciar una nueva sesión de Claude Code.
3. Ejecutar el mismo prompt sin mencionar el README.
4. Verificar los cambios mediante git diff.
5. Registrar el resultado antes del siguiente intento.

## Resultado

Predicción inicial: 4/5 (80 %).
Resultado observado: 5/5 (100 %).

## Registro por ejecución

| Intento | Herramienta | Modelo | README actualizado |
|---|---|---|---|
| 1 | Claude Code | Opus 5.5 (Bedrock) | Sí |
| 2 | Claude Code | Opus 5.5 (Bedrock) | Sí |
| 3 | Claude Code | Opus 5.5 (Bedrock) | Sí |
| 4 | Claude Code | Opus 5.5 (Bedrock) | Sí |
| 5 | Claude Code | Opus 5.5 (Bedrock) | Sí |

Los cinco intentos utilizaron literalmente el prompt documentado arriba, sin instrucciones adicionales para actualizar el README.
