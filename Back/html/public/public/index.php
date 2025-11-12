<?php
use App\Core\DB;

// composer autoload
require __DIR__ . '/../vendor/autoload.php';

// config
$configPath = __DIR__ . '/../config/config.php';
if (!file_exists($configPath)) {
    die("No se encontró config.php en $configPath");
}
$config = require $configPath;

// validar config db
if (!isset($config['db']) || !is_array($config['db'])) {
    die("'db' no está definido correctamente en config.php");
}

// conectar con la BD (si falla se detiene en DB::__construct)
$db = DB::getInstance($config['db'])->pdo();

// obtener ruta
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// rutas
$routes = [
    '' => ['App\\Controllers\\SiteController', 'home'],
    'login' => ['App\\Controllers\\AuthController', 'login'],
    'register' => ['App\\Controllers\\AuthController', 'register'],
    'admin/reservations' => ['App\\Controllers\\AdminController', 'listReservations'],
    'how' => ['App\\Controllers\\SiteController', 'how'], //
];

// si la ruta existe...
if (array_key_exists($uri, $routes)) {
    [$class, $method] = $routes[$uri];

    if (!class_exists($class)) {
        http_response_code(500);
        echo "Clase '$class' no encontrada. ¿Has ejecutado composer dump-autoload? Comprueba mayúsculas/minúsculas en nombres de fichero.";
        exit;
    }

    $controller = new $class($db, $config);

    if (!method_exists($controller, $method)) {
        http_response_code(500);
        echo "Método '$method' no existe en $class.";
        exit;
    }

    $controller->{$method}();
} else {
    http_response_code(404);
    echo "Ruta no encontrada (404).";
}
