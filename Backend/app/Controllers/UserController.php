<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class UserController extends Controller {

    public function __construct() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Dashboard del usuario
     * GET /api/user/{id}/dashboard
     */
    public function dashboard($userId = null) {
        $input = json_decode(file_get_contents('php://input'), true);
        $userEmail = $input['email'] ?? $_SESSION['user']['email'] ?? null;

        if (!$userEmail) {
            $this->json(['error' => 'No autenticado'], 401);
            return;
        }

        $sql = "SELECT * FROM transfer_reservas WHERE email_cliente = ? ORDER BY id_reserva DESC";
        $st = DB::pdo()->prepare($sql);
        $st->execute([$userEmail]);
        $reservas = $st->fetchAll();

        // DEBUG: mostrar info de email y cantidad de reservas
        $this->json([
            'debug_email' => $userEmail,
            'reservas_count' => count($reservas),
            'reservas' => $reservas
        ]);
    }

    /**
     * Listar todas las reservas de un usuario por ID
     * GET /api/user/{id}/reservas
     */
    public function reservas($userId) {

    
        $st = DB::pdo()->prepare("SELECT email_viajero FROM transfer_viajeros WHERE id_viajero = ?");
    $st->execute([(int)$userId]);
    $viajero = $st->fetch();

    if (!$viajero) {
        $this->json(['error' => 'Viajero no encontrado', 'id_viajero' => $userId], 404);
        return;
    }

    $email = $viajero['email_viajero'];

    // 2) Buscar reservas por email
    $sql = "SELECT * FROM transfer_reservas
            WHERE email_cliente = ?
            ORDER BY id_reserva DESC";

    $st = DB::pdo()->prepare($sql);
    $st->execute([$email]);
    $reservas = $st->fetchAll();

    // 3) Devolver resultado limpio
    $this->json($reservas);
}

    /**
     * Calendario de reservas de un usuario
     * GET /api/user/{id}/calendario?from=YYYY-MM-DD&to=YYYY-MM-DD
     */
    public function calendario($userId) {
        $from = $this->query('from');
        $to   = $this->query('to');

        if (!$from || !$to) {
            $this->json(['error' => 'Se requieren parámetros from y to'], 400);
            return;
        }

        $st = DB::pdo()->prepare("SELECT * FROM transfer_viajeros WHERE id_viajero = ?");
        $st->execute([(int)$userId]);
        $user = $st->fetch();

        if (!$user) {
            $this->json(['error' => 'Usuario no encontrado', 'id_viajero' => $userId]);
            return;
        }

        $userEmail = $user['email_viajero'];

        $sql = "SELECT id_reserva, fecha_entrada, fecha_vuelo_salida, hora_entrada, hora_vuelo_salida, id_tipo_reserva
                FROM transfer_reservas
                WHERE email_cliente = ? AND (fecha_entrada BETWEEN ? AND ? OR fecha_vuelo_salida BETWEEN ? AND ?)";
        $st = DB::pdo()->prepare($sql);
        $st->execute([$userEmail, $from, $to, $from, $to]);
        $rows = $st->fetchAll();

        $events = [];
        foreach ($rows as $r) {
            if (!empty($r['fecha_entrada'])) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_entrada'].'T'.($r['hora_entrada'] ?? '00:00:00'),
                    'type' => 'IDA',
                    'color' => '#4caf50'
                ];
            }
            if (!empty($r['fecha_vuelo_salida'])) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_vuelo_salida'].'T'.($r['hora_vuelo_salida'] ?? '00:00:00'),
                    'type' => 'VUELTA',
                    'color' => '#1976d2'
                ];
            }
        }

        // DEBUG
        $this->json([
            'debug_id_viajero' => $userId,
            'debug_email' => $userEmail,
            'events_count' => count($events),
            'events' => $events
        ]);
    }

    /**
     * Calendario con vista day/week/month
     * GET /api/user/{id}/calendario-view?view=day|week|month
     */
    public function calendarioView($userId) {
        $view = $this->query('view', 'month');
        $date = $this->query('date', date('Y-m-d'));

        switch ($view) {
            case 'day':
                $from = $to = $date;
                break;
            case 'week':
                $dt = new \DateTime($date);
                $dt->modify('monday this week');
                $from = $dt->format('Y-m-d');
                $dt->modify('sunday this week');
                $to = $dt->format('Y-m-d');
                break;
            case 'month':
            default:
                $from = date('Y-m-01', strtotime($date));
                $to   = date('Y-m-t', strtotime($date));
                break;
        }

        $st = DB::pdo()->prepare("SELECT * FROM transfer_viajeros WHERE id_viajero = ?");
        $st->execute([(int)$userId]);
        $user = $st->fetch();
        if (!$user) {
            $this->json(['error' => 'Usuario no encontrado', 'id_viajero' => $userId]);
            return;
        }

        $userEmail = $user['email_viajero'];

        $sql = "SELECT id_reserva, fecha_entrada, fecha_vuelo_salida, hora_entrada, hora_vuelo_salida, id_tipo_reserva
                FROM transfer_reservas
                WHERE email_cliente = ? AND (fecha_entrada BETWEEN ? AND ? OR fecha_vuelo_salida BETWEEN ? AND ?)";
        $st = DB::pdo()->prepare($sql);
        $st->execute([$userEmail, $from, $to, $from, $to]);
        $rows = $st->fetchAll();

        $events = [];
        foreach ($rows as $r) {
            if (!empty($r['fecha_entrada'])) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_entrada'].'T'.($r['hora_entrada'] ?? '00:00:00'),
                    'type' => 'IDA',
                    'view' => $view,
                    'color' => '#4caf50'
                ];
            }
            if (!empty($r['fecha_vuelo_salida'])) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_vuelo_salida'].'T'.($r['hora_vuelo_salida'] ?? '00:00:00'),
                    'type' => 'VUELTA',
                    'view' => $view,
                    'color' => '#1976d2'
                ];
            }
        }

        $this->json([
            'debug_id_viajero' => $userId,
            'debug_email' => $userEmail,
            'events_count' => count($events),
            'events' => $events
        ]);
    }
}
