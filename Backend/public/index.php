<?php
declare(strict_types=1);

spl_autoload_register(function($class){
  $prefix='App\\'; $base=__DIR__.'/../app/';
  if (strncmp($prefix,$class,strlen($prefix))!==0) return;
  $rel = substr($class, strlen($prefix));
  $file=$base.str_replace('\\','/',$rel).'.php';
  if (file_exists($file)) require $file;
});

use App\Core\Router;

$router = new Router();

// Rutas
// ------------------ SITE ------------------
$router->get('/', 'SiteController@home');
$router->get('/api/health', 'TestController@db');

// ---------------- AUTH -------------------
$router->post('/api/login', 'AuthController@login');
$router->post('/api/register', 'AuthController@registerUser');
$router->post('/api/register-hotel', 'AuthController@registerHotel');

// ----------------- ADMIN ------------------
$router->get('/api/admin/dashboard', 'AdminController@dashboard');

// ----------------- HOTEL ------------------
$router->get('/api/reservas', 'ReservationController@index');
$router->get('/api/reservas/{id}', 'ReservationController@show');
$router->post('/api/reservas', 'ReservationController@store');
$router->get('/api/hotel/{id}/reservas',   'HotelController@reservas');
$router->get('/api/hotel/{id}/calendario', 'HotelController@calendario');

// ----------------- CALENDAR ----------------
$router->get('/api/calendar/events', 'CalendarController@events');

// ---------------- RESERVATIONS -------------
$router->put('/api/reservas/{id}', 'ReservationController@update');
$router->delete('/api/reservas/{id}', 'ReservationController@destroy');


$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
