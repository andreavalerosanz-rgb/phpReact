<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;
use PDO;
use Exception;

class ReservationController extends Controller
{
    /**
     * Mostrar listado de reservas (admin o usuario)
     */
    public function index()
    {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/login');

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

        if ($user['role'] === 'admin') {
            $stmt = $pdo->query("
                SELECT r.*, h.usuario AS hotel_usuario
                FROM transfer_reservas r
                LEFT JOIN transfer_hoteles h ON r.id_hotel = h.id_hotel
                ORDER BY r.fecha_entrada DESC
            ");
        } else {
            $stmt = $pdo->prepare("
                SELECT * FROM transfer_reservas
                WHERE email_cliente = ?
                ORDER BY fecha_entrada DESC
            ");
            $stmt->execute([$user['email']]);
        }

        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->view('user/reservation_show', ['reservations' => $reservations]);
    }

    /**
     * Crear nueva reserva
     */
    public function create()
    {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/login');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo "❌ Método no permitido";
            return;
        }

        $required = [
            'tipo_reserva', 'fecha_entrada', 'hora_entrada',
            'numero_vuelo_entrada', 'origen_vuelo_entrada',
            'fecha_vuelo_salida', 'hora_vuelo_salida',
            'id_hotel', 'num_viajeros', 'id_vehiculo'
        ];

        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                echo "⚠️ Falta el campo: $field";
                return;
            }
        }

        $locator = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

        try {
            $stmt = $pdo->prepare("
                INSERT INTO transfer_reservas (
                    localizador, id_hotel, id_tipo_reserva, email_cliente,
                    fecha_reserva, fecha_modificacion, id_destino,
                    fecha_entrada, hora_entrada, numero_vuelo_entrada,
                    origen_vuelo_entrada, fecha_vuelo_salida, hora_vuelo_salida,
                    num_viajeros, id_vehiculo
                )
                VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $locator,
                $_POST['id_hotel'],
                $_POST['tipo_reserva'],
                $user['email'],
                $_POST['id_hotel'], // destino provisional = hotel
                $_POST['fecha_entrada'],
                $_POST['hora_entrada'],
                $_POST['numero_vuelo_entrada'],
                $_POST['origen_vuelo_entrada'],
                $_POST['fecha_vuelo_salida'],
                $_POST['hora_vuelo_salida'],
                $_POST['num_viajeros'],
                $_POST['id_vehiculo']
            ]);

            echo "✅ Reserva creada con localizador: <strong>$locator</strong>";
        } catch (Exception $e) {
            echo "❌ Error al crear la reserva: " . $e->getMessage();
        }
    }

    /**
     * Editar reserva existente
     */
    public function edit($id)
    {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/login');

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

        $stmt = $pdo->prepare("SELECT * FROM transfer_reservas WHERE id_reserva = ?");
        $stmt->execute([$id]);
        $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reserva) {
            echo "❌ Reserva no encontrada";
            return;
        }

        // Restricción 48h para usuarios normales
        if ($user['role'] !== 'admin') {
            $fechaLimite = strtotime($reserva['fecha_entrada']) - 48 * 3600;
            if ($fechaLimite <= time()) {
                echo "❌ No puedes modificar esta reserva (menos de 48h)";
                return;
            }
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $fields = [
                'tipo_reserva', 'fecha_entrada', 'hora_entrada', 'numero_vuelo_entrada',
                'origen_vuelo_entrada', 'fecha_vuelo_salida', 'hora_vuelo_salida',
                'id_hotel', 'num_viajeros', 'id_vehiculo'
            ];

            foreach ($fields as $field) {
                $reserva[$field] = $_POST[$field] ?? $reserva[$field];
            }

            $stmt = $pdo->prepare("
                UPDATE transfer_reservas
                SET id_tipo_reserva=?, fecha_modificacion=NOW(),
                    fecha_entrada=?, hora_entrada=?, numero_vuelo_entrada=?,
                    origen_vuelo_entrada=?, fecha_vuelo_salida=?, hora_vuelo_salida=?,
                    id_hotel=?, num_viajeros=?, id_vehiculo=?
                WHERE id_reserva=?
            ");
            $stmt->execute([
                $reserva['tipo_reserva'], $reserva['fecha_entrada'], $reserva['hora_entrada'],
                $reserva['numero_vuelo_entrada'], $reserva['origen_vuelo_entrada'],
                $reserva['fecha_vuelo_salida'], $reserva['hora_vuelo_salida'],
                $reserva['id_hotel'], $reserva['num_viajeros'], $reserva['id_vehiculo'], $id
            ]);

            echo "✅ Reserva actualizada correctamente";
            return;
        }

        $this->view('user/reservation_form', ['reserva' => $reserva]);
    }

    /**
     * Eliminar reserva
     */
    public function delete($id)
    {
        $user = $this->authUser();
        if (!$user) return $this->redirect('/login');

        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();

        $stmt = $pdo->prepare("SELECT * FROM transfer_reservas WHERE id_reserva=?");
        $stmt->execute([$id]);
        $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reserva) {
            echo "❌ Reserva no encontrada";
            return;
        }

        if ($user['role'] !== 'admin') {
            $fechaLimite = strtotime($reserva['fecha_entrada']) - 48 * 3600;
            if ($fechaLimite <= time()) {
                echo "❌ No puedes cancelar esta reserva (menos de 48h)";
                return;
            }
        }

        $stmt = $pdo->prepare("DELETE FROM transfer_reservas WHERE id_reserva=?");
        $stmt->execute([$id]);

        echo "✅ Reserva eliminada correctamente";
    }

    /**
     * Generar JSON de reservas para calendario
     */
    public function calendarJson()
    {
        $pdo = DB::getInstance(require __DIR__ . '/../../config/config.php')['db']->pdo();
        $stmt = $pdo->query("SELECT * FROM transfer_reservas");
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];
        foreach ($reservas as $r) {
            $color = match ($r['id_tipo_reserva']) {
                1 => '#007bff',
                2 => '#28a745',
                3 => '#fd7e14',
                default => '#6c757d',
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

    /**
     * Utilidades
     */
    private function authUser()
    {
        session_start();
        return $_SESSION['user'] ?? null;
    }

    private function redirect($path)
    {
        header("Location: $path");
        exit;
    }
}
