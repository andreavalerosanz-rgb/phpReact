<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AuthController extends Controller {

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            // CORRECCIÓN
            $config = require __DIR__ . '/../../config/config.php';
            $pdo = DB::getInstance($config['db'])->pdo();

            // 1️⃣ Buscar primero en admins
            $stmt = $pdo->prepare("SELECT * FROM transfer_admin WHERE email_admin = ?");
            $stmt->execute([$email]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password'])) {
                session_start();
                $_SESSION['user'] = [
                    'id' => $admin['id_admin'],
                    'email' => $admin['email_admin'],
                    'role' => 'admin'
                ];
                $this->redirect('/admin/dashboard');
                return;
            }

            // 2️⃣ Si no es admin, buscar en viajeros
            $stmt = $pdo->prepare("SELECT * FROM transfer_viajeros WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['user'] = [
                    'id' => $user['id_viajero'],
                    'email' => $user['email'],
                    'role' => 'user'
                ];
                $this->redirect('/reservations');
            } else {
                echo "❌ Email o contraseña incorrecta";
            }
        } else {
            $this->view('auth/login');
        }
    }

    public function register() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fields = ['nombre', 'apellido1', 'apellido2', 'direccion', 'codigoPostal', 'ciudad', 'pais', 'email', 'password'];
        foreach ($fields as $f) {
            if (empty($_POST[$f])) {
                echo "Falta $f";
                return;
            }
        }

        $email = $_POST['email'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "❌ Email no válido";
            return;
        }

        // CORRECCIÓN
        $config = require __DIR__ . '/../../config/config.php';
        $pdo = DB::getInstance($config['db'])->pdo();

        // Comprobar si ya existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM transfer_viajeros WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            echo "❌ Ya existe un usuario con ese email";
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO transfer_viajeros (nombre, apellido1, apellido2, direccion, codigoPostal, ciudad, pais, email, password)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['nombre'], $_POST['apellido1'], $_POST['apellido2'], $_POST['direccion'],
            $_POST['codigoPostal'], $_POST['ciudad'], $_POST['pais'], $email, password_hash($_POST['password'], PASSWORD_DEFAULT)
        ]);

        // ✅ Registrar mensaje en sesión y redirigir
        session_start();
        $_SESSION['success'] = "✅ Registro completado. Ahora puedes iniciar sesión.";
        $this->redirect('/login');
     } else {
        $this->view('auth/register');
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        $this->redirect('/login');
    }

    private function redirect($path) {
        header("Location: $path");
        exit;
    }
}
