<?php
namespace App\Core;

class Response {
  public static function json($data, int $status = 200): void {
    $c = require __DIR__.'/../../config/config.php';
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: '.$c['cors']['origin']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    http_response_code($status);
    echo json_encode($data);
  }
}
