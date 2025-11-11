<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class ReservationController extends Controller {

    public function index() {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/');

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

        if ($user['role'] === 'admin') {
            $stmt = $pdo->query("SELECT * FROM transfer_reservas ORDER BY fecha_entrada DESC");
        } else {
            $stmt = $pdo->prepare("SELECT * FROM transfer_reservas WHERE email_cliente = ? ORDER BY fecha_entrada DESC");
            $stmt->execute([$user['email']]);
        }

        $reservations = $stmt->fetchAll();
        $this->view('user/reservation_show', ['reservations' => $reservations]);
    }

    public function create() {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/');

        $data = [
            'tipo_reserva' => $_POST['tipo_reserva'],
            'fecha_entrada' => $_POST['fecha_entrada'],
            'hora_entrada' => $_POST['hora_entrada'],
            'numero_vuelo_entrada' => $_POST['numero_vuelo_entrada'],
            'origen_vuelo_entrada' => $_POST['origen_vuelo_entrada'],
            'fecha_vuelo_salida' => $_POST['fecha_vuelo_salida'],
            'hora_vuelo_salida' => $_POST['hora_vuelo_salida'],
            'id_hotel' => $_POST['id_hotel'],
            'num_viajeros' => $_POST['num_viajeros'],
            'id_vehiculo' => $_POST['id_vehiculo']
        ];

        // validación mínima
        foreach ($data as $key => $value) {
            if (empty($value)) {
                echo "Falta el campo $key";
                return;
            }
        }

        // Generar localizador único
        $locator = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
        $stmt = $pdo->prepare("INSERT INTO transfer_reservas 
            (localizador, email_cliente, id_tipo_reserva, fecha_reserva, fecha_modificacion, id_destino, fecha_entrada, hora_entrada, numero_vuelo_entrada, origen_vuelo_entrada, fecha_vuelo_salida, hora_vuelo_salida, num_viajeros, id_vehiculo)
            VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $locator,
            $user['email'],
            $data['tipo_reserva'],
            $data['id_hotel'],
            $data['fecha_entrada'],
            $data['hora_entrada'],
            $data['numero_vuelo_entrada'],
            $data['origen_vuelo_entrada'],
            $data['fecha_vuelo_salida'],
            $data['hora_vuelo_salida'],
            $data['num_viajeros'],
            $data['id_vehiculo']
        ]);

        echo "✅ Reserva creada con localizador: $locator";
    }

    private function authUser() {
        session_start();
        return $_SESSION['user'] ?? null;
    }

    private function redirect($path) {
        header("Location: $path");
        exit;
    }

    public function edit($id) {
    $user = $this->authUser();
    if (!$user) return $this->redirect('/');

    $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

    // Obtener reserva
    $stmt = $pdo->prepare("SELECT * FROM transfer_reservas WHERE id_reserva = ?");
    $stmt->execute([$id]);
    $reserva = $stmt->fetch();

    if (!$reserva) {
        echo "❌ Reserva no encontrada";
        return;
    }

    // Validar 48h si no es admin
    if ($user['role'] !== 'admin') {
        $fechaLimite = strtotime($reserva['fecha_entrada']) - 48*3600;
        if ($fechaLimite <= time()) {
            echo "❌ No puedes modificar esta reserva, faltan menos de 48 horas";
            return;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fields = ['tipo_reserva', 'fecha_entrada', 'hora_entrada', 'numero_vuelo_entrada', 'origen_vuelo_entrada', 'fecha_vuelo_salida', 'hora_vuelo_salida', 'id_hotel', 'num_viajeros', 'id_vehiculo'];
        $data = [];
        foreach ($fields as $f) {
            $data[$f] = $_POST[$f] ?? $reserva[$f];
        }

        $stmt = $pdo->prepare("UPDATE transfer_reservas SET id_tipo_reserva=?, fecha_modificacion=NOW(), fecha_entrada=?, hora_entrada=?, numero_vuelo_entrada=?, origen_vuelo_entrada=?, fecha_vuelo_salida=?, hora_vuelo_salida=?, id_hotel=?, num_viajeros=?, id_vehiculo=? WHERE id_reserva=?");
        $stmt->execute([
            $data['tipo_reserva'], $data['fecha_entrada'], $data['hora_entrada'], $data['numero_vuelo_entrada'], $data['origen_vuelo_entrada'],
            $data['fecha_vuelo_salida'], $data['hora_vuelo_salida'], $data['id_hotel'], $data['num_viajeros'], $data['id_vehiculo'], $id
        ]);

        echo "✅ Reserva modificada";
        return;
    }

    $this->view('user/reservation_form', ['reserva' => $reserva]);
}

public function delete($id) {
    $user = $this->authUser();
    if (!$user) return $this->redirect('/');

    $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
    $stmt = $pdo->prepare("SELECT * FROM transfer_reservas WHERE id_reserva=?");
    $stmt->execute([$id]);
    $reserva = $stmt->fetch();

    if (!$reserva) {
        echo "❌ Reserva no encontrada";
        return;
    }

    // Validar 48h si no es admin
    if ($user['role'] !== 'admin') {
        $fechaLimite = strtotime($reserva['fecha_entrada']) - 48*3600;
        if ($fechaLimite <= time()) {
            echo "❌ No puedes cancelar esta reserva, faltan menos de 48 horas";
            return;
        }
    }

    $stmt = $pdo->prepare("DELETE FROM transfer_reservas WHERE id_reserva=?");
    $stmt->execute([$id]);

    echo "✅ Reserva eliminada";
}

public function calendarJson() {
    $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
    $stmt = $pdo->query("SELECT * FROM transfer_reservas");
    $reservas = $stmt->fetchAll();

    $data = [];
    foreach ($reservas as $r) {
        $color = match($r['id_tipo_reserva']) {
            1 => '#007bff', // aeropuerto→hotel
            2 => '#28a745', // hotel→aeropuerto
            3 => '#fd7e14', // ida y vuelta
            default => '#6c757d'
        };
        $data[] = [
            'title' => $r['localizador'],
            'start' => $r['fecha_entrada'] . 'T' . $r['hora_entrada'],
            'end' => $r['fecha_vuelo_salida'] . 'T' . $r['hora_vuelo_salida'],
            'color' => $color
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($data);
}
    
}
