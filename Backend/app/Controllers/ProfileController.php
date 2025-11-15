<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class ProfileController extends Controller {

    // Usuario autenticado
    private function authUser() {    
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (strpos($auth, 'Bearer ') !== 0) {
        return null;
    }

    $token = trim(str_replace('Bearer ','',$auth));

    try {
        $payload = \App\Helpers\JWT::decode($token);

        if (!isset($payload->userId) || !isset($payload->role)) {
            return null;
        }

        return [
            'userId' => (int)$payload->userId,
            'role'   => $payload->role,
            'email'  => $payload->email ?? null
        ];

    } catch (\Exception $e) {
        return null;
    }
    }

    public function show()
    {
        $user = $this->authUser();

        if (!$user) {
            return $this->json(['error' => 'No autorizado'], 401);
        }

        switch ($user['role']) {

            case 'admin':
                $sql = "SELECT 
                            id_admin AS id,
                            nombre,
                            email_admin AS email
                        FROM transfer_admin
                        WHERE id_admin = ?";
                break;

            case 'hotel':
                $sql = "SELECT 
                            id_hotel AS id,
                            nombre,
                            email_hotel AS email,
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
                            email_viajero AS email
                        FROM transfer_viajeros
                        WHERE id_viajero = ?";
                break;

            default:
                return $this->json(['error' => 'Rol desconocido'], 400);
        }

        $st = DB::pdo()->prepare($sql);
        $st->execute([$user['userId']]);
        $data = $st->fetch();

        return $this->json($data);
    }

    public function update() {
    $user = $this->authUser();

    if (!$user || !isset($user['userId'])) {
        // No autorizado
        return $this->json(['error'=>'No autorizado'], 401);
    }

    $in = $this->body();
    $fields = ['nombre','email','password'];
    $set = [];
    $params = [];

    foreach ($fields as $f) {
        if (isset($in[$f])) {
            // Evitar warning por email
            $col = $f;
            if ($f === 'email') {
                $col = match($user['role'] ?? 'user') {
                    'user' => 'email_viajero',
                    'hotel' => 'email_hotel',
                    'admin' => 'email_admin',
                    default => 'email_viajero'
                };
            }

            $set[] = "$col = ?";
            $params[] = $in[$f];
        }
    }

    if (!$set) {
        return $this->json(['error'=>'Nada que actualizar'], 400);
    }

    // Evitar SQL inválido
    $table = match($user['role'] ?? 'user') {
        'user' => 'transfer_viajeros',
        'hotel' => 'transfer_hoteles',
        'admin' => 'transfer_admin',
        default => 'transfer_viajeros'
    };

    $idCol = match($user['role'] ?? 'user') {
        'user' => 'id_viajero',
        'hotel' => 'id_hotel',
        'admin' => 'id_admin',
        default => 'id_viajero'
    };

    $params[] = $user['userId'];
    $sql = "UPDATE $table SET ".implode(',', $set)." WHERE $idCol = ?";

    try {
        $st = DB::pdo()->prepare($sql);
        $st->execute($params);
    } catch (\PDOException $e) {
        // Evitar error fatal y mostrar mensaje
        return $this->json(['error'=>'Error al actualizar'],500);
    }

    return $this->json(['ok'=>true]);
    }
}