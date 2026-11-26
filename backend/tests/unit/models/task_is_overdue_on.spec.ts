import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * Los bordes de `Task#isOverdueOn`, la regla del requisito «Cuándo una tarea
 * está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Sin servidor y sin base de datos: la tarea se construye en memoria con
 * `new Task()` y nunca se guarda. El día de referencia es fijo y llega por
 * parámetro, como en la regla; ningún test lee el reloj.
 */
test.group('Task | isOverdueOn', () => {
  const REFERENCIA = '2026-08-13'

  function tarea(dueDate: Task['dueDate'], status: TaskStatus = 'pending') {
    const task = new Task()
    task.title = 'Cerrar el trimestre'
    task.status = status
    task.dueDate = dueDate
    return task
  }

  test('fecha anterior al día de referencia y sin hacer: vencida', ({ assert }) => {
    assert.isTrue(tarea('2026-08-12').isOverdueOn(REFERENCIA))
  })

  test('fecha exactamente igual al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-13').isOverdueOn(REFERENCIA))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-14').isOverdueOn(REFERENCIA))
  })

  test('sin fecha: no vencida', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(REFERENCIA))
  })

  test('ya hecha con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-12', 'done').isOverdueOn(REFERENCIA))
  })

  /**
   * No sale de la spec: sale de cómo llega el dato de verdad. El esquema
   * generado declara `dueDate: string | null`, pero una tarea leída de
   * PostgreSQL trae la columna `date` como un `Date` de JavaScript a medianoche
   * UTC de ese día (comprobado leyendo una tarea con `Task.findOrFail`). Recién
   * asignada en memoria, en cambio, es texto. La regla tiene que dar lo mismo
   * con las dos formas del mismo día, en los tres bordes.
   */
  test('da lo mismo recibir la fecha como texto o como objeto Date', ({ assert }) => {
    for (const dia of ['2026-08-12', '2026-08-13', '2026-08-14']) {
      const comoTexto = tarea(dia).isOverdueOn(REFERENCIA)
      const comoDate = tarea(new Date(`${dia}T00:00:00.000Z`) as unknown as string).isOverdueOn(
        REFERENCIA
      )

      assert.strictEqual(comoDate, comoTexto, `${dia} como Date frente a ${dia} como texto`)
    }
  })
})
