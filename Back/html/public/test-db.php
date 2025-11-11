<?php
// test-db.php

// Cargamos el autoload de Composer
require __DIR__ . '/vendor/autoload.php'; // Ajusta la ruta si es necesario
$config = require __DIR__ . '/config/config.php';

use App\Core\DB;

try {
    $db = DB::getInstance($config['db'])->pdo();
    echo "✅ Conexión a la base de datos OK";
} catch (Exception $e) {
    echo "❌ Error al conectar: " . $e->getMessage();
}