<?php $role = $_SESSION['role'] ?? 'GUEST'; ?>
<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= $title ?? 'Isla Transfers' ?></title>
<link rel="stylesheet" href="/assets/css/styles.css">
</head><body>
<header class="site-header">
  <a href="/reservar">Nueva Reserva</a> |
  <a href="/reservas">Mis Reservas</a> |
  <a href="/calendario">Calendario</a>
  <nav class="nav">
    <a href="/" class="brand">Isla Transfers</a>
    <div class="links">
      <a href="/how">Cómo funciona</a>
      <?php if ($role === 'GUEST'): ?>
        <a href="/login">Login</a>
        <a href="/register" class="btn">Registro</a>
      <?php endif; ?>
      <?php if ($role === 'PARTICULAR'): ?>
        <a href="/me/reservations">Mis reservas</a>
        <a href="/profile">Perfil</a>
      <?php endif; ?>
      <?php if ($role === 'ADMIN'): ?>
        <a href="/admin">Admin</a>
        <a href="/admin/reservations/create">Nueva reserva</a>
        <a href="/admin/calendar/week">Calendario</a>
      <?php endif; ?>
      <?php if ($role !== 'GUEST'): ?>
        <form action="/logout" method="post" class="inline">
          <button class="btn btn-outline">Salir</button>
        </form>
      <?php endif; ?>
    </div>
  </nav>
</header>
<main class="container">