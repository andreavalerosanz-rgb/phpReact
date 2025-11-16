# Isla Transfers – API Backend

Documentación oficial para integración con el Frontend (React).  
Formato: **Markdown (.md)**

---

## 🌐 Base URL

```text
http://localhost:8080
```

---

## 0. Convenciones generales

### 0.1. Formato de error estándar

```json
{ "error": "Mensaje de error" }
```

### 0.2. Errores de validación

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "campo": "Mensaje específico"
  }
}
```

### 0.3. Códigos de estado habituales

- `200` – OK  
- `201` – Creado  
- `400` – Petición incorrecta / validación  
- `401` – No autorizado / login incorrecto  
- `404` – No encontrado  
- `500` – Error interno de servidor  

---

## 1. SITE / HEALTH

### GET `/api/health`

Comprueba que la API y la Base de Datos responden correctamente.

**Respuesta 200**

```json
{
  "status": "ok",
  "db": "connected"
}
```

---

## 2. AUTH

### 2.1. POST `/api/login`

Login unificado para:

- **Admin** → tabla `transfer_admin`
- **Hotel** → tabla `transfer_hoteles`
- **Usuario particular (viajero)** → tabla `transfer_viajeros`

#### Request

```json
{
  "email": "admin@islatransfers.com",
  "password": "admin123"
}
```

#### 200 – Admin

```json
{
  "role": "admin",
  "userId": 1,
  "name": "Admin Demo",
  "email": "admin@islatransfers.com",
  "token": "abc123xyz"
}
```

#### 200 – Hotel

```json
{
  "role": "hotel",
  "userId": 2,
  "name": "Hotel Demo",
  "email": "hotel@demo.com",
  "token": "abc123xyz"
}
```

#### 200 – Usuario

```json
{
  "role": "user",
  "userId": 3,
  "name": "Usuario Demo",
  "email": "user@demo.com",
  "token": "abc123xyz"
}
```

#### 401 – Credenciales inválidas

```json
{ "error": "Credenciales inválidas" }
```

---

### 2.2. POST `/api/register`  (registro usuario particular)

Crea un viajero en `transfer_viajeros`.

#### Request

```json
{
  "nombre": "Usuario",
  "apellido1": "Demo",
  "apellido2": "Ejemplo",
  "direccion": "Calle Falsa 123",
  "codigoPostal": "08001",
  "ciudad": "Barcelona",
  "pais": "España",
  "email": "user@demo.com",
  "password": "123456"
}
```

#### 201 – Creado

```json
{
  "id": 3,
  "nombre": "Usuario",
  "email": "user@demo.com"
}
```

#### 400 – Error de validación (ejemplo)

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "email": "Email ya registrado"
  }
}
```

---

### 2.3. POST `/api/register-hotel`  (registro hotel corporativo)

Crea un registro en `transfer_hoteles`.

#### Request

```json
{
  "nombre": "Hotel Demo",
  "email": "hotel@demo.com",
  "password": "hotel123",
  "id_zona": 1,
  "comision": 10
}
```

#### 201 – Creado

```json
{
  "id_hotel": 2,
  "nombre": "Hotel Demo",
  "email": "hotel@demo.com"
}
```

---

## 3. ADMIN

### 3.1. GET `/api/admin/dashboard`

Datos agregados para el panel del administrador.

#### 200

```json
{
  "totalReservas": 25,
  "reservasHoy": 3,
  "reservasSemana": 10,
  "totalUsuarios": 12,
  "totalHoteles": 5,
  "totalVehiculos": 4
}
```

---

### 3.2. GET `/api/admin/users`

Lista de usuarios viajeros (`transfer_viajeros`).

#### 200

```json
[
  {
    "id_viajero": 1,
    "nombre": "Cèlia",
    "apellido1": "Trullà",
    "apellido2": "Estruch",
    "email": "celia@example.com",
    "ciudad": "Barcelona",
    "pais": "España"
  }
]
```

---

### 3.3. GET `/api/admin/users/{id}`

Detalle de un viajero concreto.

#### 200

```json
{
  "id_viajero": 3,
  "nombre": "Usuario",
  "apellido1": "Demo",
  "apellido2": "Ejemplo",
  "direccion": "Calle Falsa 123",
  "codigoPostal": "08001",
  "ciudad": "Barcelona",
  "pais": "España",
  "email": "user@demo.com"
}
```

#### 404

```json
{ "error": "Not found" }
```

---

## 4. RESERVAS

> Tabla principal: `transfer_reservas`

Campos relevantes:

```text
id_reserva, localizador, id_hotel, id_tipo_reserva, email_cliente,
fecha_reserva, fecha_modificacion, id_destino,
fecha_entrada, hora_entrada, numero_vuelo_entrada, origen_vuelo_entrada,
hora_vuelo_salida, fecha_vuelo_salida, num_viajeros, id_vehiculo
```

---

### 4.1. GET `/api/reservas`

Lista de reservas (de momento listado general; los filtros por rol se pueden aplicar en Front).

#### 200

```json
[
  {
    "id_reserva": 8,
    "localizador": "TRF-20251112-B3796C",
    "id_hotel": 2,
    "hotel_nombre": "Hotel Demo",
    "id_tipo_reserva": 2,
    "tipo_reserva": "VUELTA",
    "email_cliente": "user@demo.com",

    "fecha_reserva": "2025-11-12 20:30:32",
    "fecha_modificacion": "2025-11-12 20:30:32",

    "id_destino": 2,
    "fecha_entrada": "2025-12-12",
    "hora_entrada": "10:30:00",
    "numero_vuelo_entrada": "IB1234",
    "origen_vuelo_entrada": "MAD",

    "hora_vuelo_salida": "2025-12-20 09:00:00",
    "fecha_vuelo_salida": "2025-12-20",
    "num_viajeros": 3,
    "id_vehiculo": 1
  }
]
```

---

### 4.2. GET `/api/reservas/{id}`

Detalle de una reserva.

#### 200

```json
{
  "id_reserva": 8,
  "localizador": "TRF-20251112-B3796C",
  "id_hotel": 2,
  "id_tipo_reserva": 2,
  "tipo_reserva": "VUELTA",
  "email_cliente": "user@demo.com",
  "fecha_reserva": "2025-11-12 20:30:32",
  "fecha_modificacion": "2025-11-12 20:30:32",
  "id_destino": 2,
  "fecha_entrada": "2025-12-12",
  "hora_entrada": "10:30:00",
  "numero_vuelo_entrada": "IB1234",
  "origen_vuelo_entrada": "MAD",
  "hora_vuelo_salida": "2025-12-20 09:00:00",
  "fecha_vuelo_salida": "2025-12-20",
  "num_viajeros": 3,
  "id_vehiculo": 1
}
```

#### 404

```json
{ "error": "Not found" }
```

---

### 4.3. POST `/api/reservas`

Creación de reserva por parte de **admin** o **usuario**.  

- La validación de **48 horas** se aplica cuando `role = "user"`.
- `tipo` se mapea a `id_tipo_reserva` usando la tabla de tipos.

#### Request (ejemplo completo)

```json
{
  "role": "user",                     
  "tipo": "IDA",                      

  "id_hotel": 2,
  "id_destino": 2,
  "id_viajero": 3,
  "id_vehiculo": 1,
  "num_viajeros": 2,

  "fecha_entrada": "2025-12-12",
  "hora_entrada": "10:30:00",
  "numero_vuelo_entrada": "IB1234",
  "origen_vuelo_entrada": "MAD",

  "fecha_vuelo_salida": "2025-12-20",
  "hora_vuelo_salida": "09:00:00"
}
```

#### 201 – Creado

```json
{
  "id": 9,
  "localizador": "TRF-20251116-AB12CD",
  "tipo": "IDA"
}
```

#### 400 – Error de validación (ejemplo)

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "tipo": "tipo debe ser IDA | VUELTA | IDA_VUELTA",
    "id_hotel": "id_hotel no existe en transfer_hoteles",
    "regla_48h": "Reservas de usuario: mínimo 48h de antelación"
  }
}
```

---

### 4.4. PUT `/api/reservas/{id}`

Actualiza los datos de una reserva (típicamente admin).

#### Request (ejemplo parcial)

```json
{
  "num_viajeros": 4,
  "id_vehiculo": 2,
  "fecha_entrada": "2025-12-13",
  "hora_entrada": "11:00:00"
}
```

#### 200

```json
{ "ok": true }
```

---

### 4.5. DELETE `/api/reservas/{id}`

Cancela una reserva (borrado o soft-delete, según implementación).

#### 200

```json
{ "ok": true }
```

---

## 5. HOTEL

### 5.1. GET `/api/hotel/{id}/reservas`

Reservas asociadas a un hotel específico (panel del hotel o vista filtrada para admin).

#### 200

```json
[
  {
    "id_reserva": 8,
    "localizador": "TRF-20251112-B3796C",
    "id_tipo_reserva": 2,
    "tipo_reserva": "VUELTA",
    "fecha_entrada": "2025-12-12",
    "hora_entrada": "10:30:00",
    "fecha_vuelo_salida": "2025-12-20",
    "hora_vuelo_salida": "09:00:00",
    "num_viajeros": 3,
    "email_cliente": "user@demo.com"
  }
]
```

---

### 5.2. GET `/api/hotel/{id}/calendario`

Eventos de calendario para un hotel (sin filtros día/semana/mes).

#### 200

```json
[
  {
    "id": 8,
    "title": "IDA - TRF-20251112-B3796C",
    "start": "2025-12-12T10:30:00",
    "end": "2025-12-12T11:30:00",
    "tipo": "IDA",
    "hotelId": 2
  }
]
```

---

### 5.3. GET `/api/hotel/{id}/calendario-view`

Misma idea que el anterior, pero pensado para incluir filtros de vista (día / semana / mes).

#### 200

```json
[
  {
    "id": 8,
    "title": "VUELTA - TRF-20251112-B3796C",
    "start": "2025-12-20T09:00:00",
    "end": "2025-12-20T10:00:00",
    "tipo": "VUELTA",
    "hotelId": 2
  }
]
```

---

## 6. CALENDARIO GLOBAL

### 6.1. GET `/api/calendar/events`

Eventos de todas las reservas (panel global del administrador).

#### 200

```json
[
  {
    "id": 8,
    "title": "IDA - TRF-20251112-B3796C",
    "start": "2025-12-12T10:30:00",
    "end": "2025-12-12T11:30:00",
    "tipo": "IDA",
    "hotelId": 2
  }
]
```

---

## 7. PERFIL

### 7.1. GET `/api/profile`

Información del perfil del usuario autenticado (según token/ID que useis en el Front).

#### 200 – Ejemplo usuario

```json
{
  "role": "user",
  "userId": 3,
  "nombre": "Usuario",
  "apellido1": "Demo",
  "apellido2": "Ejemplo",
  "email": "user@demo.com",
  "ciudad": "Barcelona",
  "pais": "España"
}
```

---

### 7.2. PUT `/api/profile`

Actualiza los datos del perfil.

#### Request

```json
{
  "nombre": "Usuario Actualizado",
  "email": "new@demo.com",
  "password": "nueva-clave"
}
```

#### 200

```json
{ "ok": true }
```

---

## 8. TIPOS DE RESERVA

> Tabla: `transfer_tipo_reservas`

Campos relevantes:  
`id_tipo_reserva`, `Descripción` (valores: "IDA", "VUELTA", "IDA_VUELTA")

### 8.1. GET `/api/tipo-reservas`

#### 200

```json
[
  { "id_tipo_reserva": 1, "codigo": "IDA" },
  { "id_tipo_reserva": 2, "codigo": "VUELTA" },
  { "id_tipo_reserva": 3, "codigo": "IDA_VUELTA" }
]
```

---

## 9. PRECIOS

> Tabla: `transfer_precios`  
> Campos: `id_precios`, `id_vehiculo`, `id_hotel`, `Precio`

### 9.1. GET `/api/precios`

#### 200

```json
[
  {
    "id_precios": 1,
    "id_hotel": 2,
    "id_vehiculo": 1,
    "precio": 50.0
  }
]
```

---

### 9.2. GET `/api/precios/{id_hotel}/{id_vehiculo}`

#### 200

```json
{
  "id_precios": 1,
  "id_hotel": 2,
  "id_vehiculo": 1,
  "precio": 50.0
}
```

---

## 10. VEHÍCULOS

> Tabla: `transfer_vehiculos`  
> Campos: `id_vehiculo`, `Descripción`, `email_conductor`, `password`

### 10.1. GET `/api/vehiculos`

#### 200

```json
[
  {
    "id_vehiculo": 1,
    "descripcion": "Sedán",
    "email_conductor": "driver1@demo.com"
  },
  {
    "id_vehiculo": 2,
    "descripcion": "Minivan",
    "email_conductor": "driver2@demo.com"
  }
]
```

---

### 10.2. GET `/api/vehiculos/{id}`

#### 200

```json
{
  "id_vehiculo": 1,
  "descripcion": "Sedán",
  "email_conductor": "driver1@demo.com"
}
```

---

### 10.3. POST `/api/vehiculos`

#### Request

```json
{
  "descripcion": "Minivan",
  "email_conductor": "driver2@demo.com",
  "password": "clave-vehiculo"
}
```

#### 201

```json
{
  "ok": true,
  "id_vehiculo": 2
}
```

---

### 10.4. PUT `/api/vehiculos/{id}`

#### Request

```json
{
  "descripcion": "Minivan Actualizada",
  "email_conductor": "driver2@demo.com"
}
```

#### 200

```json
{ "ok": true }
```

---

### 10.5. DELETE `/api/vehiculos/{id}`

#### 200

```json
{ "ok": true }
```

---

## 11. ZONAS

> Tabla: `transfer_zonas`  
> Campos: `id_zona`, `descripcion`

### 11.1. GET `/api/zonas`

#### 200

```json
[
  { "id_zona": 1, "descripcion": "Norte" },
  { "id_zona": 2, "descripcion": "Sur" },
  { "id_zona": 3, "descripcion": "Este" },
  { "id_zona": 4, "descripcion": "Oeste" },
  { "id_zona": 5, "descripcion": "Centro" }
]
```

---

### 11.2. POST `/api/zonas`

#### Request

```json
{
  "descripcion": "Nueva zona"
}
```

#### 201

```json
{
  "id_zona": 6,
  "descripcion": "Nueva zona"
}
```

---

### 11.3. DELETE `/api/zonas/{id}`

#### 200

```json
{ "ok": true }
```

---

## 12. Tabla resumen de endpoints

| Método | Endpoint                          | Descripción                                      |
|--------|------------------------------------|--------------------------------------------------|
| GET    | /api/health                       | Comprobar estado de API y BD                     |
| POST   | /api/login                        | Login (admin / hotel / usuario)                  |
| POST   | /api/register                     | Registro de usuario particular                   |
| POST   | /api/register-hotel               | Registro de hotel                                |
| GET    | /api/admin/dashboard              | Datos agregados del panel admin                  |
| GET    | /api/admin/users                  | Listado de viajeros                              |
| GET    | /api/admin/users/{id}             | Detalle de viajero                               |
| GET    | /api/reservas                     | Listado de reservas                              |
| GET    | /api/reservas/{id}                | Detalle de reserva                               |
| POST   | /api/reservas                     | Crear reserva                                    |
| PUT    | /api/reservas/{id}                | Actualizar reserva                               |
| DELETE | /api/reservas/{id}                | Eliminar / cancelar reserva                      |
| GET    | /api/hotel/{id}/reservas          | Reservas de un hotel                             |
| GET    | /api/hotel/{id}/calendario        | Eventos calendario de un hotel                   |
| GET    | /api/hotel/{id}/calendario-view   | Eventos calendario (vista filtrada)              |
| GET    | /api/calendar/events              | Eventos calendario global                        |
| GET    | /api/profile                      | Ver perfil del usuario actual                    |
| PUT    | /api/profile                      | Actualizar perfil                                |
| GET    | /api/tipo-reservas                | Listado de tipos de reserva                      |
| GET    | /api/precios                      | Listado de precios                               |
| GET    | /api/precios/{hotel}/{vehiculo}   | Precio por hotel y vehículo                      |
| GET    | /api/vehiculos                    | Listado de vehículos                             |
| GET    | /api/vehiculos/{id}               | Detalle vehículo                                 |
| POST   | /api/vehiculos                    | Crear vehículo                                   |
| PUT    | /api/vehiculos/{id}               | Actualizar vehículo                              |
| DELETE | /api/vehiculos/{id}               | Eliminar vehículo                                |
| GET    | /api/zonas                        | Listado de zonas                                 |
| POST   | /api/zonas                        | Crear zona                                       |
| DELETE | /api/zonas/{id}                   | Eliminar zona                                    |
