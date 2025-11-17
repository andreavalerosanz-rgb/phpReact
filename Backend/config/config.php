<?php

$inDocker = getenv('DOCKER') ?: (php_sapi_name() !== 'cli' && file_exists('/.dockerenv'));

return [
    'db' => [
        'host' => $inDocker ? (getenv('DB_HOST_INTERNAL') ?: 'db') : (getenv('DB_HOST_EXTERNAL') ?: 'host.docker.internal'),
        'port' => $inDocker ? (getenv('DB_PORT_INTERNAL') ?: 3306) : (getenv('DB_PORT_EXTERNAL') ?: 3307),
        'name' => getenv('MYSQL_DATABASE') ?: 'isla_transfer',
        'user' => getenv('DB_USER') ?: 'apiuser',
        'pass' => getenv('DB_PASS') ?: 'apipassword',
        'charset' => 'utf8mb4',
    ],
    'cors' => [
        'origin' => '*'
    ]
];
