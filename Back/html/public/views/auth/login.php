<?php
session_start(); // ⬅ Aquí, al inicio, antes de cualquier HTML
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Iniciar sesión</title>
<link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
<nav class="nav">
  <a class="logo" href="/">Isla Transfers</a>
</nav>

<main>
<?php if (!empty($_SESSION['success'])): ?>
  <p class="success"><?= $_SESSION['success'] ?></p>
  <?php unset($_SESSION['success']); ?>
<?php endif; ?>

<form class="card" method="POST" action="/login" style="max-width:400px;margin:auto;">
  <h1>Iniciar sesión</h1>

  <label>Email</label>
  <input type="email" name="email" placeholder="tu@correo.com" required>

  <label>Contraseña</label>
  <input type="password" name="password" placeholder="••••••••" required>

  <button class="btn" type="submit">Entrar</button>

  <p style="margin-top:1rem;text-align:center;">
    ¿No tienes cuenta? <a href="/register">Regístrate</a>
  </p>
</form>
</main>

<footer class="footer">© 2025 Isla Transfers</footer>
</body>
</html>
