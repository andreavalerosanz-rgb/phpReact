# Guía para levantar el entorno del proyecto *Isla Transfers*

Este documento explica paso a paso cómo poner en marcha todos los
servicios necesarios para ejecutar correctamente la aplicación web del
proyecto **Isla Transfers**.

------------------------------------------------------------------------

## 1. Levantar los servicios con Docker

En la carpeta **`/Backend`** del proyecto se encuentra el archivo
`docker-compose.yml` que contiene la configuración de los servicios
necesarios.

Ejecuta:

``` bash
docker-compose up -d
```

------------------------------------------------------------------------

## 2. Levantar el servidor PHP

``` bash
php -S localhost:8080 -t public
```

------------------------------------------------------------------------

## 3. Importar la base de datos en phpMyAdmin

1.  Accede a phpMyAdmin (normalmente en `http://localhost:8081`)
2.  En la pestaña **Importar**, selecciona **`isla_transfers.sql`**.
El archivo se encuentra en la carpeta del proyecto.
3.  Ejecuta la importación.

------------------------------------------------------------------------

## 4. Levantar el frontend con npm

``` bash
npm run dev
```

A continuación, acceder al enlace proporcionado por consola.

------------------------------------------------------------------------

## ¡Listo!

El proyecto debería estar corriendo correctamente.
