<?php
// public/index.php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;
use App\Core\DB;
use App\Controllers\AuthController;
use App\Controllers\ReservationController;

// Inicia sesión global
session_start();

// Cargar configuración y conexión a la base de datos
$config = require __DIR__ . '/../config/config.php';
$pdo = DB::getInstance($config['db'])->pdo();

// Crear router
$router = new Router();

// Página principal
$router->get('/', function() {
    require __DIR__ . '/../views/home.php';
});

// Página "Cómo funciona"
$router->get('/how', [SiteController::class, 'how']);

// Auth
$router->get('/login', [AuthController::class, 'login']);
$router->post('/login', [AuthController::class, 'login']);

$router->get('/register', [AuthController::class, 'register']);
$router->post('/register', [AuthController::class, 'register']);

$router->get('/logout', [AuthController::class, 'logout']);

// Reservas
$router->get('/reservations', [ReservationController::class, 'index']);
$router->post('/reservations/create', [ReservationController::class, 'create']);

// Despachar rutas PASANDO $pdo y $config a los controladores
$router->dispatch($pdo, $config);
