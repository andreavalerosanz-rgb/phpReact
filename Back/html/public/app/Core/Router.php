<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';
$config = require __DIR__ . '/../config/config.php';
$db = \App\Core\DB::getInstance($config['db'])->pdo();

// parse URL
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$routes = [
  '' => ['App\Controllers\SiteControlers','home'],
  'login' => ['App\Controllers\AuthControllers','login'],
  'register' => ['App\Controllers\AuthControllers','register'],
  'admin/reservations' => ['App\Controllers\AdminControllers','listReservations'],
  'admin/users' => ['App\Controllers\AdminControllers','listUsers'],
  'admin/vehicles' => ['App\Controllers\AdminControllers','listVehicles'],
  'admin/locations' => ['App\Controllers\AdminControllers','listLocations'],
];

if(array_key_exists($uri, $routes)) {
    [$class, $method] = $routes[$uri];
    $controller = new $class($db, $config);
    $controller->{$method}();
} else {
    header("HTTP/1.0 404 Not Found");
    echo "404";
}
