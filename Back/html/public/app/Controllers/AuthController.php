<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AuthControllers extends Controller {

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
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
                $this->redirect('/');
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

            $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
            $stmt = $pdo->prepare("INSERT INTO transfer_viajeros (nombre, apellido1, apellido2, direccion, codigoPostal, ciudad, pais, email, password)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $_POST['nombre'], $_POST['apellido1'], $_POST['apellido2'], $_POST['direccion'],
                $_POST['codigoPostal'], $_POST['ciudad'], $_POST['pais'], $_POST['email'], password_hash($_POST['password'], PASSWORD_DEFAULT)
            ]);

            echo "✅ Registro completado. Ahora puedes iniciar sesión.";
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
