<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AdminControllers extends Controller {

    public function dashboard() {
        $this->authAdmin();

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
        $stmt = $pdo->query("SELECT * FROM transfer_reservas ORDER BY fecha_entrada DESC");
        $reservas = $stmt->fetchAll();

        $this->view('admin/dashboard', ['reservas' => $reservas]);
    }

    public function createReservation() {
        $this->authAdmin();
        // Reutilizar lógica de ReservationController::create()
        (new ReservationController())->create();
    }

    public function editReservation($id) {
        $this->authAdmin();
        // Lógica de edición de reserva
    }

    public function deleteReservation($id) {
        $this->authAdmin();

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
        $stmt = $pdo->prepare("DELETE FROM transfer_reservas WHERE id_reserva = ?");
        $stmt->execute([$id]);

        echo "✅ Reserva eliminada";
    }

    private function authAdmin() {
        session_start();
        $user = $_SESSION['user'] ?? null;
        if (!$user || $user['role'] !== 'admin') {
            $this->redirect('/login');
        }
    }

    private function redirect($path) {
        header("Location: $path");
        exit;
    }
}
