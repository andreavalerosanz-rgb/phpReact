<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;
use App\Helpers\JWT;

class AuthController extends Controller
{
    public function login()
    {
        $in    = $this->body(); // esta es la variable que entra en el controlador
        $email = trim($in['email'] ?? '');
        $pass  = $in['password'] ?? '';
    

        // ADMIN (email_admin + password texto plano)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_admin WHERE email_admin = ? LIMIT 1");
        $st->execute([$email]);
        $admin = $st->fetch(); // con esto se ejecuta la consulta a BD
        
        if ($admin && $pass === $admin['password']) {
            //print_r($admin);
            // Construir el token
            $payload = [
                'userId'=> $admin['id_admin'],
                'role'=> '$admin',
                'email'=> $admin['email_admin'],
                'iat'=> time(),
                'exp'=> time()*(60*60*2),
            ];
            $token = JWT::encode($payload); // aqui el token recibe el array que se construyó
            // Respuesta JSON
            $this->json([
                'role' => 'admin',
                'name' => $admin['nombre'], 
                'userId' => (int)$admin['id_admin'],
                'token' => $token,
            ]);
            return;
        }

        // HOTEL (usa el campo 'usuario' que ahora es VARCHAR)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_hoteles WHERE usuario = ? LIMIT 1");
        $st->execute([$email]);
        $hotel = $st->fetch();
        
        if ($hotel && $pass === $hotel['password']) {
            //print_r($hotel);
            // Construir el token
            $payload = [
                'userId'=> $hotel['id_hotel'],
                'role'=> '$admin',
                'email'=> $user['email'],
                'iat'=> time(),
                'exp'=> time()*(60*60*2),
            ];
            $token = JWT::encode($payload); // aqui el token recibe el array que se construyó
            // Respuesta JSON
            $this->json([
                'role' => 'hotel',
                'name' => $hotel['nombre'],
                'userId' => (int)$hotel['id_hotel'],
                'token' => $token,
            ]);
            return;
        }

        // USUARIO / VIAJERO (email + password texto plano)
        $st = DB::pdo()->prepare("SELECT * FROM transfer_viajeros WHERE email = ? LIMIT 1");
        $st->execute([$email]);
        $user = $st->fetch();
        if ($user && $pass === $user['password']) {
            // Construir el token
            $payload = [
                'userId'=> $user['id_viajero'],
                'role'=> '$admin',
                'email'=> $user['email'],
                'iat'=> time(),
                'exp'=> time()*(60*60*2),
            ];
            $token = JWT::encode($payload); // aqui el token recibe el array que se construyó
            // Respuesta JSON
            $this->json([
                'role' => 'user',
                'name' => $user['nombre'], 
                'userId' => (int)$user['id_viajero'],
                'token' => $token,
            ]);
            return;
        }

        // Si no coincide ninguno
        $this->json(['error' => 'Credenciales inválidas'], 401);
    }
}
