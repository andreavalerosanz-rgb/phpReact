<?php
return [
    'db' => [
        'host' => '127.0.0.1',        // localhost de Windows
        'port' => 3307,               // puerto que mapeaste en docker-compose
        'name' => 'isla_transfer',
        'user' => 'root',
        'pass' => 'root',
        'charset' => 'utf8mb4',
    ],
    'cors' => [
        'origin' => 'http://localhost:5173',
    ],
];
