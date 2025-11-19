<?php
declare(strict_types=1);

// spl_autoload_register(function($class){
//     $prefix='App\\'; 
//     $base=__DIR__.'/../app/';
//     if (strncmp($prefix,$class,strlen($prefix))!==0) return;
//     $rel = substr($class, strlen($prefix));
//     $file=$base.str_replace('\\','/',$rel).'.php';
//     if (file_exists($file)) require $file;
// });
/**
 * 1. Cargar configuración
 *    (ajusta la ruta si tu config está en otro sitio)
 */
$config = require __DIR__ . '/../config/config.php';

/**
 * 2. CORS: permitir llamadas desde el Front (Vite)
 */
$origin = $config['cors']['origin'] ?? '*';

header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Si el navegador hace una preflight request (OPTIONS),
// respondemos vacío y salimos
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * 3. Autoloader y router (lo que ya tenías)
 */
spl_autoload_register(function($class){
    $prefix='App\\'; 
    $base=__DIR__.'/../app/';
    if (strncmp($prefix,$class,strlen($prefix))!==0) return;
    $rel = substr($class, strlen($prefix));
    $file=$base.str_replace('\\','/',$rel).'.php';
    if (file_exists($file)) require $file;
});

use App\Core\Router;

$router = new Router();

// ------------------ SITE ------------------
$router->get('/', 'SiteController@home'); // página de inicio
$router->get('/api/health', 'TestController@db'); // health check de la base de datos

// ---------------- AUTH -------------------
$router->post('/api/login', 'AuthController@login'); // login de usuario/admin/hotel
$router->post('/api/register', 'AuthController@registerUser'); // registro de usuario
$router->post('/api/register-hotel', 'AuthController@registerHotel'); // registro de hotel

// ----------------- ADMIN ------------------
$router->get('/api/admin/dashboard', 'AdminController@dashboard'); // datos para el dashboard
$router->get('/api/admin/users', 'AdminController@listUsers');              // listar todos los usuarios
$router->get('/api/admin/users/{id}', 'AdminController@getUserById');      // obtener usuario por ID

// ----------------- HOTEL ------------------
$router->get('/api/reservas', 'ReservationController@index'); // listar reservas
$router->get('/api/reservas/{id}', 'ReservationController@show'); // mostrar reserva
$router->post('/api/reservas', 'ReservationController@store'); // crear reserva
$router->put('/api/reservas/{id}', 'ReservationController@update'); // actualizar reserva
$router->delete('/api/reservas/{id}', 'ReservationController@destroy'); // eliminar reserva
$router->get('/api/hotel/{id}/reservas', 'HotelController@reservas'); // reservas de un hotel (por id)
$router->get('/api/hotel/{id}/calendario', 'CalendarController@hotelCalendar'); // Calendario Hotel - Sin filtaros día/semana/mes
$router->get('/api/hotel/{id}/calendario-view', 'CalendarController@hotelCalendarView'); // Celendario Hotel - Con filtros día/semana/mes
$router->get('/api/hoteles/{id}', 'HotelController@show');


// ----------------- USER ------------------
$router->get('/api/user/{id}/dashboard', 'UserController@dashboard');
$router->get('/api/user/{id}/reservas', 'UserController@reservas');
$router->get('/api/user/{id}/calendario', 'UserController@calendario');
$router->get('/api/user/{id}/calendario-view', 'UserController@calendarioView');
$router->get('/api/hoteles', 'HotelController@index');


// ----------------- CALENDAR ----------------
$router->get('/api/calendar/events', 'CalendarController@events'); // eventos del calendario

// ----------------- PROFILE -----------------
$router->get('/api/profile', 'ProfileController@show'); // obtener perfil
$router->put('/api/profile', 'ProfileController@update'); // actualizar perfil

// ----------------- TIPO RESERVAS -----------
$router->get('/api/tipo-reservas', 'ReservationController@tipoReservas'); // obtener tipos de reserva

// ----------------- PRECIOS -----------------
$router->get('/api/precios', 'ReservationController@precios'); // obtener precios
$router->get('/api/precios/{id_hotel}/{id_vehiculo}', 'ReservationController@precioDetalle'); // detalle de precio por hotel y vehículo

// ----------------- VEHÍCULOS -----------------
$router->get('/api/vehiculos', 'VehicleController@index'); // listar vehículos
$router->get('/api/vehiculos/{id}', 'VehicleController@show'); // mostrar vehículo
$router->post('/api/vehiculos', 'VehicleController@store'); // crear vehículo
$router->put('/api/vehiculos/{id}', 'VehicleController@update'); // actualizar vehículo
$router->delete('/api/vehiculos/{id}', 'VehicleController@destroy'); // eliminar vehículo

// ----------------- ZONAS -----------------
$router->get('/api/zonas', 'ZoneController@index'); // listar zonas
$router->post('/api/zonas', 'ZoneController@store'); // crear zona
$router->delete('/api/zonas/{id}', 'ZoneController@destroy'); // eliminar zona

// Dispatch
$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
