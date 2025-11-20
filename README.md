# Isla Transfers – Aplicación web de reserva y gestión de traslados

## 📝 Explicación

En esta segunda actividad se ha desarrollado una aplicación web destinada a la **reserva y gestión de transferecias**. La empresa ficticia **Isla Transfers** realiza traslados de viajeros desde el aeropuerto hacia diferentes hoteles de la isla.

A través de esta plataforma web, los usuarios pueden gestionar todos los aspectos relacionados con sus transfers:

* **Clientes (Viajeros):** pueden realizar reservas y modificarlas.
* **Clientes corporativos (Hoteles):** tienen acceso para gestionar las reservas relacionadas con su establecimiento.
* **Administradores:** pueden visualizar, gestionar y controlar todas las reservas y la información del sistema.

---

## 📦 Instalación

### 0. **Clonar el repositorio**

Clona este repositorio en tu máquina:

```
git clone https://github.com/andreavalerosanz-rgb/phpReact.git
```

Accede al directorio principal del proyecto:

```
cd phpReact
```
---

### 1. **Back-end**

Acceder al backend:

```
cd Backend
```

Levantar los contenedores Docker:

```
docker compose up -d --build   # Construye y levanta contenedores
```

Verificar que los contenedores están activos:

```
docker ps
```

> Esto levantará **apache_php**, **isla_db** y **phpmyadmin**.

Una vez levantado Docker, iniciar el servidor PHP local:

```
php -S localhost:8080 -t public
```

---

### 2. **Base de Datos**

Con phpMyAdmin levantado, accede a:

```
http://localhost:8082
```

Importa la base de datos del archivo:

```
isla_transfer.sql
```

---

### 3. **Front-end**

Volver al directorio raíz del proyecto y entrar al front:

```
cd ../Front
```

Instalar dependencias:

```
npm install
```

Levantar el entorno de desarrollo con Vite:

```
npm run dev
```

## 🧰 Tecnologías usadas

* **PHP** para el back-end y la gestión de datos.
* **MySQL** como sistema de base de datos.
* **HTML, CSS y JavaScript** para el front-end básico.
* **React** para la capa de interfaz interactiva.
* **Docker** para facilitar el despliegue en un entorno local.
* **Patrón MVC** para una organización clara y modular del código.

---

## 📁 Estructura del proyecto MVC

```
phpReact/
├── Backend/
│   ├── apache-php/
│   ├── app/
│   │   ├── Controllers/ - Controlador
│   │   ├── Core/
│   │   ├── Helpers/
│   │   └── Models/ -  Modelos
│   ├── config/
│   └── public/
│
├── Front/ -  Vista
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── ui/
│       ├── hooks/
│       ├── i18n/
│       ├── lib/
│       └── pages/
│
└── isla_transfer.sql
```

---

## 🛠️ Problemas comunes y soluciones

### 🔹 Error de permisos en Docker

Asegúrate de que los contenedores tienen acceso correcto a los volúmenes:

```
sudo chmod -R 775 Backend/app
```

### 🔹 Error al levantar Vite

Prueba con:

```
npm install
npm run dev -- --host
```

---

## 👥 Autores

Proyecto desarrollado por:
**Helena Vivas I Ramajo**, 
**Martha Milena Aguilar Parra**, 
**Cèlia Trullà Estruch** y 
**Andrea Valero Sanz** 
