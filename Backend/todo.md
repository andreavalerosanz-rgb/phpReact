## Cambios en la BD

- Se creó una tabla transfer_admin (controlar los admin) --> “Se mantuvo transfer_admin para separar claramente el acceso de administración del acceso de clientes (viajeros/hoteles). Para futuras iteraciones, se plantea unificar el login mediante una vista SQL o tabla de usuarios con roles.”
- Se cambió a plural los nombres de las tablas por buenas prácticas y por la convención de nomenclatura de tablas (naming convention)
- A la tabla transfer_hoteles se cambio el tipo del campo "usuario" de int a varchar para poder almacenar el email cuando este tipo de usuario de loguease
- A la tabla transfer_tipo_reservas se le cambió el tipo al campo "Descripción" de INT a VARCHAR (20) para agregar --> IDA, VUELTA y IDA_VUELTA
- A la tabla reservas se cambio el tipo al campo "email_cliente" de INT a VARCHAR(150)
- A la tabla transfer_precio se cambio el tipo al campo "Precio" de INT a DECIMAL para que acepte decimales, también se modifica el tipo id_precios como PK y AUTOINCREMENTABLE, 


## Postman

- Se utiliza el postman para realizar las distintas validaciones y pruebas con la conexion de la BD y si se hacen las validaciones que se pide en la rúbrica

## Me he quedado en:

- Hacer las pruebas para cancelar y modificar las reserva (admin) ✅ listo probado en postman
- Agregar datos a la tabla precios y a la tabla zona está en blanco ✅ listo 

- Agregar campo name a transfer_hoteles 
- Falta probar el circuito completo --> 




Probar circuito completo:

Login
Crear reserva (user/admin)
Ver reservas
Modificar
Cancelar
Mostrar precios / zonas si quieres añadir endpoints
Subir al GitHub tu proyecto completo ya ordenado.
Mostrarlo a tus compañeras para que integren el front sin complicaciones.
Grabar tu vídeo tranquila, porque todo está ya preparado
