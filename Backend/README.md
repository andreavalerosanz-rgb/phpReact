# Isla Transfers - Starter MVC (PHP sin framework)

## MVC resumido
- **Model**: acceso a BD y entidades (en `/app/Models` + `/app/Repositories`).
- **View**: plantillas HTML+PHP en `/views/**`.
- **Controller**: recibe ruta y decide qué vista renderizar.

## Dónde trabaja el FRONT
- `/views/**` (maquetación), `/public/assets/css|js` (estilos y JS).

## Ejecutar
`php -S localhost:8080 -t public`