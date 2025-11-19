<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class ProfileController extends Controller {

    /**
     * Autenticación mediante JWT
     */
    private function authUser() {

        // 1. Leer Authorization de varias fuentes
        $auth = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        // 2. Intentar con apache_request_headers() si no existe
        if (!$auth && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $auth = $headers['Authorization'];
            }
            if (isset($headers['authorization'])) {
                $auth = $headers['authorization'];
            }
        }

        if (strpos($auth, 'Bearer ') !== 0) {
            return null;
        }

        $token = trim(str_replace('Bearer ', '', $auth));

        // 3. Decodificar JWT
        $payload = \App\Helpers\JWT::decode($token);
        if (!$payload) return null;

        if (!isset($payload['userId']) || !isset($payload['role'])) {
            return null;
        }

        return [
            'userId' => (int)$payload['userId'],
            'role'   => $payload['role'],
            'email'  => $payload['email'] ?? null
        ];
    }


    /**
     * Obtener perfil según rol
     */
    public function show()
    {
        $user = $this->authUser();

        if (!$user) {
            return $this->json(['error' => 'No autorizado'], 401);
        }

        // SQL por tipo de usuario
        switch ($user['role']) {

            case 'admin':
                $sql = "SELECT 
                            id_admin AS id,
                            nombre,
                            email_admin
                        FROM transfer_admin
                        WHERE id_admin = ?";
                break;

            case 'hotel':
                $sql = "SELECT 
                            id_hotel AS id,
                            nombre,
                            email_hotel,
                            id_zona,
                            Comision
                        FROM transfer_hoteles
                        WHERE id_hotel = ?";
                break;

            case 'user':
                $sql = "SELECT 
                            id_viajero AS id,
                            nombre,
                            apellido1,
                            apellido2,
                            direccion,
                            codigoPostal,
                            ciudad,
                            pais,
                            email_viajero
                        FROM transfer_viajeros
                        WHERE id_viajero = ?";
                break;

            default:
                return $this->json(['error' => 'Rol desconocido'], 400);
        }

        $st = DB::pdo()->prepare($sql);
        $st->execute([$user['userId']]);
        $data = $st->fetch();

        if (!$data) {
            return $this->json(['error' => 'No encontrado'], 404);
        }

        // Normalizar para el frontend
        $data['role'] = $user['role'];

        if ($user['role'] === 'user') {
            $data['email'] = $data['email_viajero'];
            unset($data['email_viajero']);
        }

        if ($user['role'] === 'hotel') {
            $data['email_hotel'] = $data['email_hotel'];
        }

        if ($user['role'] === 'admin') {
            $data['email_admin'] = $data['email_admin'];
        }

        return $this->json($data);
    }


    /**
     * Actualizar perfil según rol
     */
    public function update() 
    {
        $user = $this->authUser();
        if (!$user || !isset($user['userId'])) {
            return $this->json(['error'=>'No autorizado'], 401);
        }

        $in = $this->body();
        $set = [];
        $params = [];

        // Campos válidos
        if (isset($in['nombre'])) {
            $set[] = "nombre = ?";
            $params[] = $in['nombre'];
        }

        if (isset($in['password'])) {
            $set[] = "password = ?";
            $params[] = $in['password'];
        }

        if (isset($in['email'])) {
            $col = match($user['role']) {
                'user' => 'email_viajero',
                'hotel' => 'email_hotel',
                'admin' => 'email_admin',
            };
            $set[] = "$col = ?";
            $params[] = $in['email'];
        }

        if (!$set) {
            return $this->json(['error'=>'Nada que actualizar'], 400);
        }

        $table = match($user['role']) {
            'user' => 'transfer_viajeros',
            'hotel' => 'transfer_hoteles',
            'admin' => 'transfer_admin',
        };

        $idCol = match($user['role']) {
            'user' => 'id_viajero',
            'hotel' => 'id_hotel',
            'admin' => 'id_admin',
        };

        $params[] = $user['userId'];

        $sql = "UPDATE $table SET ".implode(',', $set)." WHERE $idCol = ?";

        try {
            $st = DB::pdo()->prepare($sql);
            $st->execute($params);
        } catch (\PDOException $e) {
            return $this->json(['error'=>'Error al actualizar'],500);
        }

        return $this->json(['ok'=>true]);
    }
}