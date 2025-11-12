<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Registro</title>
<link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
<nav class="nav">
  <a class="logo" href="/">Isla Transfers</a>
</nav>

<main>
<form class="card" method="POST" action="/register" style="max-width:400px;margin:auto;">
  <h1>Crear cuenta</h1>

  <label>Nombre:</label>
  <input type="text" name="nombre" required>

  <label>Apellido 1:</label>
  <input type="text" name="apellido1" required>

  <label>Apellido 2:</label>
  <input type="text" name="apellido2">

  <label>Dirección:</label>
  <input type="text" name="direccion">

  <label>Código Postal:</label>
  <input type="text" name="codigoPostal">

  <label>Ciudad:</label>
  <input type="text" name="ciudad">

  <label>País:</label>
  <input type="text" name="pais">

  <label>Email:</label>
  <input type="email" name="email" required>

  <label>Contraseña:</label>
  <input type="password" name="password" required>

  <button class="btn" type="submit">Registrar</button>

  <p style="margin-top:1rem;text-align:center;">
    ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
  </p>
</form>
</main>

<footer class="footer">© 2025 Isla Transfers</footer>
</body>
</html>
