<?php
require __DIR__ . '/../vendor/autoload.php';

$config = require __DIR__ . '/../config/config.php';
$db = \App\Core\DB::getInstance($config['db'])->pdo();

try {
    $stmt = $db->query("SELECT NOW() as tiempo");
    $row = $stmt->fetch();
    echo "✅ Conexión correcta. Hora DB: " . $row['tiempo'];
} catch (PDOException $e) {
    die("❌ Error DB: " . $e->getMessage());
}