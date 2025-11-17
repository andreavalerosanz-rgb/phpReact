<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;
use App\Helpers\JWT;

class AuthController extends Controller
{
    // ---------------- LOGIN ----------------
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
                'role'=> 'admin',
                'email'=> $admin['email_admin'],
                'iat'=> time(),
                'exp'=> time()+ 60*60*2,
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
        $st = DB::pdo()->prepare("SELECT * FROM transfer_hoteles WHERE email_hotel = ? LIMIT 1");
        $st->execute([$email]);
        $hotel = $st->fetch();
        
        if ($hotel && $pass === $hotel['password']) {
            //print_r($hotel);
            // Construir el token
            $payload = [
                'userId'=> $hotel['id_hotel'],
                'role'=> 'hotel',
                'email'=> $hotel['email_hotel'],
                'iat'=> time(),
                'exp'=> time()+ 60*60*2,
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
        $st = DB::pdo()->prepare("SELECT * FROM transfer_viajeros WHERE email_viajero = ? LIMIT 1");
        $st->execute([$email]);
        $user = $st->fetch();
        if ($user && $pass === $user['password'])   {
            // Construir el token
            $payload = [
                'userId'=> $user['id_viajero'],
                'role'=> 'user',
                'email'=> $user['email_viajero'],
                'iat'=> time(),
                'exp'=> time()+ 60*60*2,
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

// ---------------- REGISTRO USUARIO ----------------
        public function registerUser()
        {
            $in = $this->body();

            // Campos obligatorios
            $nombre     = trim($in['nombre'] ?? '');
            $apellido1  = trim($in['apellido1'] ?? '');
            $apellido2  = trim($in['apellido2'] ?? '');
            $direccion  = trim($in['direccion'] ?? '');
            $codigoPostal = trim($in['codigoPostal'] ?? '');
            $ciudad     = trim($in['ciudad'] ?? '');
            $pais       = trim($in['pais'] ?? '');
            $email      = trim($in['email'] ?? '');
            $password   = $in['password'] ?? '';

            $errors = [];
            if (!$nombre) $errors['nombre'] = 'Nombre requerido';
            if (!$apellido1) $errors['apellido1'] = 'Apellido1 requerido';
            if (!$apellido2) $errors['apellido2'] = 'Apellido2 requerido';
            if (!$direccion) $errors['direccion'] = 'Dirección requerida';
            if (!$codigoPostal) $errors['codigoPostal'] = 'Código postal requerido';
            if (!$ciudad) $errors['ciudad'] = 'Ciudad requerida';
            if (!$pais) $errors['pais'] = 'País requerido';
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
            if (!$password) $errors['password'] = 'Password requerido';

            // Verificar email existente
            $st = DB::pdo()->prepare("SELECT 1 FROM transfer_viajeros WHERE email_viajero=? LIMIT 1");
            $st->execute([$email]);
            if ($st->fetchColumn()) $errors['email'] = 'Email ya registrado';

            if ($errors) {
                $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors], 400);
                return;
            }

            // Insertar usuario
            $st = DB::pdo()->prepare("
                INSERT INTO transfer_viajeros 
                (nombre, apellido1, apellido2, direccion, codigoPostal, ciudad, pais, email_viajero, password)
                VALUES (?,?,?,?,?,?,?,?,?)
            ");
            $st->execute([$nombre, $apellido1, $apellido2, $direccion, $codigoPostal, $ciudad, $pais, $email, $password]);

            $id = (int)DB::pdo()->lastInsertId();
            $token = JWT::encode([
                'userId'=> $id,
                'role'=> 'user',
                'email'=> $email,
                'iat'=> time(),
                'exp'=> time() + 2*60*60
            ]);

            $this->json([
                'role'=>'user',
                'name'=>$nombre,
                'userId'=>$id,
                'token'=>$token
            ], 201);
        }

    // ---------------- REGISTRO HOTEL ----------------
    public function registerHotel()
    {
        $in = $this->body();

        $nombre   = trim($in['nombre'] ?? '');
        $email    = trim($in['email'] ?? '');
        $password = $in['password'] ?? '';
        $id_zona  = isset($in['id_zona']) ? (int)$in['id_zona'] : null;
        $comision = isset($in['Comision']) ? (int)$in['Comision'] : null;

        $errors = [];
        if (!$nombre) $errors['nombre'] = 'Nombre del hotel requerido';
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
        if (!$password) $errors['password'] = 'Password requerido';

        // Verificar email existente
        $st = DB::pdo()->prepare("SELECT 1 FROM transfer_hoteles WHERE email_hotel=? LIMIT 1");
        $st->execute([$email]);
        if ($st->fetchColumn()) $errors['email'] = 'Email ya registrado';

        if ($errors) {
            $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors],400);
            return;
        }

        // Insertar hotel
        $st = DB::pdo()->prepare("
            INSERT INTO transfer_hoteles (nombre, id_zona, Comision, email_hotel, password)
            VALUES (?,?,?,?,?)
        ");
        $st->execute([$nombre, $id_zona, $comision, $email, $password]);

        $id = (int)DB::pdo()->lastInsertId();
        $token = JWT::encode([
            'userId'=> $id,
            'role'=> 'hotel',
            'email'=> $email,
            'iat'=> time(),
            'exp'=> time() + 2*60*60
        ]);

        $this->json([
            'role'=>'hotel',
            'name'=>$nombre,
            'userId'=>$id,
            'token'=>$token
        ],201);
    }
}