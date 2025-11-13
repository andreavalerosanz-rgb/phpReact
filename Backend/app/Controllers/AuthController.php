<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AuthController extends Controller
{
    public function login()
    {
        $in    = $this->body(); // esta es la variable que entra en el controlador
        $email = trim($in['email'] ?? '');
        $pass  = $in['password'] ?? '';
        // $patata = $in['role'] ?? '';
        // print_r($patata);

        // ADMIN (email_admin + password texto plano)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_admin WHERE email_admin = ? LIMIT 1");
        $st->execute([$email]);
        $admin = $st->fetch(); // con esto se ejecuta la consulta a BD
        if ($admin && $pass === $admin['password']) {
            //print_r($admin);
            $this->json([
                'role' => 'admin',
                'name' => $admin['nombre'], 
                'userId' => (int)$admin['id_admin'],
            ]);
            return;
        }

        // HOTEL (usa el campo 'usuario' que ahora es VARCHAR)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_hoteles WHERE usuario = ? LIMIT 1");
        $st->execute([$email]);
        $hotel = $st->fetch();
        if ($hotel && $pass === $hotel['password']) {
            //print_r($hotel);
            $this->json([
                'role' => 'hotel',
                'name' => $hotel['nombre'],
                'userId' => (int)$hotel['id_hotel'],
            ]);
            return;
        }

        // USUARIO / VIAJERO (email + password texto plano)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_viajeros WHERE email = ? LIMIT 1");
        $st->execute([$email]);
        $user = $st->fetch();
        if ($user && $pass === $user['password']) {
            $this->json([
                'role' => 'user',
                'name' => $user['nombre'], 
                'userId' => (int)$user['id_viajero'],
            ]);
            return;
        }

        // Si no coincide ninguno
        $this->json(['error' => 'Credenciales inválidas'], 401);
    }
}
