<?php
// config/config.php
return [
  'app' => [
    'base_url' => 'http://localhost:8080/public', // puerto de Apache del contenedor mapeado a Windows
    'env' => 'local',
    'timezone' => 'Europe/Madrid',
  ],
  'db' => [
    'host' => 'mysql_db',    // nombre del contenedor MySQL
    'port' => 3306,          // puerto del contenedor MySQL
    'name' => 'isla-transfer',
    'user' => 'celia',
    'pass' => '1234',
    'charset' => 'utf8mb4',
],
  //Configuraciion de seguridad
  'security' => [
    'csrf_key' => 'change-me',
  ],
];
