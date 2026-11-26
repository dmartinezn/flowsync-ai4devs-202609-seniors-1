import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada Scenario del requisito
 * homónimo de `openspec/specs/tasks/spec.md`.
 *
 * Todo entra por HTTP, como el cliente, y lo que se comprueba es el campo
 * `isOverdue` del cuerpo. Solo dos respuestas lo traen: `GET /tasks/:id` (con
 * `today` en la query) y `PUT /tasks/:id/due-date` (con `today` en el cuerpo).
 * `PATCH /tasks/:id/status` responde con la forma de lista, sin vencimiento, así
 * que después de cambiar el estado se vuelve a leer la tarea.
 *
 * El día de referencia es siempre `REFERENCIA` y viaja en la petición, como pide
 * «El día de referencia lo pone quien mira». Ningún test lee el reloj.
 */
test.group('Tasks | cuándo una tarea está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const REFERENCIA = '2026-08-13'
  const AYER = '2026-08-12'
  const MANANA = '2026-08-14'
  const HACE_MESES = '2026-03-02'

  type Cliente = any

  /** Una cuenta con sesión iniciada; devuelve las cabeceras para usar su token. */
  async function conSesion(client: Cliente) {
    const email = 'margaret.hamilton@example.com'
    await User.create({ fullName: 'Margaret Hamilton', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    login.assertStatus(200)
    return { Authorization: `Bearer ${login.body().data.token}` }
  }

  /** Crea una tarea por la API y devuelve el `id` que da la creación. */
  async function crear(client: Cliente, auth: Record<string, string>) {
    const response = await client
      .post('/api/v1/tasks')
      .headers(auth)
      .json({ title: 'Cerrar el trimestre' })
    response.assertStatus(201)
    return response.body().data.id as number
  }

  /** Fija la fecha de vencimiento y devuelve la tarea que trae la respuesta. */
  async function ponerFecha(
    client: Cliente,
    auth: Record<string, string>,
    id: number,
    dueDate: string | null
  ) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(auth)
      .json({ dueDate, today: REFERENCIA })
    response.assertStatus(200)
    return response.body().data
  }

  async function pasarAHecha(client: Cliente, auth: Record<string, string>, id: number) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(auth)
      .json({ status: 'done' })
    response.assertStatus(200)
  }

  /** La tarea suelta, mirada desde `today`. */
  async function leer(
    client: Cliente,
    auth: Record<string, string>,
    id: number,
    today = REFERENCIA
  ) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(auth)
    response.assertStatus(200)
    return response.body().data
  }

  test('Fecha del día anterior: llega marcada como vencida', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, AYER)

    const tarea = await leer(client, auth, id)

    assert.notEqual(tarea.status, 'done')
    assert.strictEqual(tarea.isOverdue, true)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, REFERENCIA)

    const tarea = await leer(client, auth, id)

    assert.notEqual(tarea.status, 'done')
    assert.strictEqual(tarea.isOverdue, false)
  })

  test('Fecha futura: no llega marcada como vencida', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, MANANA)

    const tarea = await leer(client, auth, id)

    assert.strictEqual(tarea.isOverdue, false)
  })

  test('Sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)

    // La API no deja elegir `createdAt`. «Creada hace semanas» se consigue
    // mirándola desde un día muy posterior al de su creación.
    const tarea = await leer(client, auth, id, '2099-12-31')

    assert.equal(tarea.status, 'pending')
    assert.isNull(tarea.dueDate)
    assert.strictEqual(tarea.isOverdue, false)
  })

  test('Darla por hecha la deja de vencer y conserva la fecha', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, AYER)

    const vencida = await leer(client, auth, id)
    assert.strictEqual(vencida.isOverdue, true, 'el Scenario parte de una tarea vencida')

    await pasarAHecha(client, auth, id)
    const hecha = await leer(client, auth, id)

    assert.equal(hecha.status, 'done')
    assert.strictEqual(hecha.isOverdue, false)
    assert.equal(hecha.dueDate, vencida.dueDate)
  })

  test('Una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, HACE_MESES)
    await pasarAHecha(client, auth, id)

    const tarea = await leer(client, auth, id)

    assert.equal(tarea.status, 'done')
    assert.strictEqual(tarea.isOverdue, false)
  })

  test('Aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const auth = await conSesion(client)
    const id = await crear(client, auth)
    await ponerFecha(client, auth, id, AYER)

    // Vencida tal como la ve el cliente: leyéndola.
    const vencida = await leer(client, auth, id)
    assert.strictEqual(vencida.isOverdue, true, 'el Scenario parte de una tarea vencida')

    const aplazada = await ponerFecha(client, auth, id, MANANA)

    assert.strictEqual(aplazada.isOverdue, false)
  })
})
