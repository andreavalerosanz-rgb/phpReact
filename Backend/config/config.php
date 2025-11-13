<?php
return [
  'db' => [
    'host' => '127.0.0.1',  // si PHP está fuera de Docker; si está dentro, usa 'db'
    'port' => 3306,
    'name' => 'isla-transfer',
    'user' => 'isla',
    'pass' => 'isla',
    'charset' => 'utf8mb4',
  ],
  // origen del front (ajústalo)
  'cors' => [
    'origin' => 'http://localhost:5173', // React dev server o tu puerto
  ],
];
