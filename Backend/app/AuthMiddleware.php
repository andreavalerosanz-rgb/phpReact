<?php
namespace App\Middleware;

use App\Helpers\JWT;

class AuthMiddleware {

    public static function check() {
        // Revisar headers
        $headers = apache_request_headers();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            http_response_code(401);
            echo json_encode(['error' => 'Token no enviado']);
            exit;
        }

        // Extraer token
        $token = trim(str_replace('Bearer', '', $auth));

        // Decodificar
        $payload = JWT::decode($token);

        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido o expirado']);
            exit;
        }

        // Guardar usuario para el controlador
        return $payload;
    }
}
