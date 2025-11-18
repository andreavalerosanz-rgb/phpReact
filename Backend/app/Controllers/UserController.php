<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;
use App\Helpers\JWT;

class UserController extends Controller {

    /**
     * Obtener datos del usuario a partir del token JWT
     */
    private function getUserFromToken() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!$authHeader) return null;

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) return null;

        $token = $matches[1];
        $payload = JWT::decode($token); // tu clase JWT ya hace la verificación

        return $payload ?: null;
    }

    /**
     * Dashboard del usuario
     * GET /api/user/{id}/dashboard
     */
    public function dashboard($userId = null) {
        $payload = $this->getUserFromToken();
        if (!$payload) {
            $this->json(['error' => 'No autenticado'], 401);
            return;
        }

        // Verificar que el ID de URL coincida con el del token (opcional)
        if ($userId !== null && $userId != $payload['userId']) {
            $this->json(['error' => 'No autorizado'], 403);
            return;
        }

        $userEmail = $payload['email'];

        $sql = "SELECT * FROM transfer_reservas WHERE email_cliente = ? ORDER BY id_reserva DESC";
        $st = DB::pdo()->prepare($sql);
        $st->execute([$userEmail]);
        $reservas = $st->fetchAll();

        $this->json([
            'debug_email' => $userEmail,
            'reservas_count' => count($reservas),
            'reservas' => $reservas
        ]);
    }

    /**
     * Listar todas las reservas de un usuario
     * GET /api/user/{id}/reservas
     */
    public function reservas($userId = null) {
        $payload = $this->getUserFromToken();
        if (!$payload) {
            $this->json(['error' => 'No autenticado'], 401);
            return;
        }

        if (($userId !== null && $userId != $payload['userId']) || ($payload['role'] ?? '') !== 'user') {
            $this->json(['error' => 'No autorizado'], 403);
            return;
        }

        $userEmail = $payload['email'];

        $sql = "SELECT * FROM transfer_reservas WHERE email_cliente = ? ORDER BY id_reserva DESC";
        $st = DB::pdo()->prepare($sql);
        $st->execute([$userEmail]);
        $reservas = $st->fetchAll();

        $this->json([
            'debug_id_viajero' => $payload['userId'],
            'debug_email' => $userEmail,
            'reservas_count' => count($reservas),
            'reservas' => $reservas
        ]);
    }

    /**
     * Calendario de reservas de un usuario
     * GET /api/user/{id}/calendario?from=YYYY-MM-DD&to=YYYY-MM-DD
     */
    public function calendario($userId = null) {
        $payload = $this->getUserFromToken();
        if (!$payload) {
            $this->json(['error' => 'No autenticado'], 401);
            return;
        }

        if ($userId !== null && $userId != $payload['userId']) {
            $this->json(['error' => 'No autorizado'], 403);
            return;
        }

        $from = $this->query('from');
        $to   = $this->query('to');
        if (!$from || !$to) {
            $this->json(['error' => 'Se requieren parámetros from y to'], 400);
            return;
        }

        $userEmail = $payload['email'];

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

        $this->json([
            'debug_id_viajero' => $payload['userId'],
            'debug_email' => $userEmail,
            'events_count' => count($events),
            'events' => $events
        ]);
    }

    /**
     * Calendario con vista day/week/month
     * GET /api/user/{id}/calendario-view?view=day|week|month
     */
    public function calendarioView($userId = null) {
        $payload = $this->getUserFromToken();
        if (!$payload) {
            $this->json(['error' => 'No autenticado'], 401);
            return;
        }

        if ($userId !== null && $userId != $payload['userId']) {
            $this->json(['error' => 'No autorizado'], 403);
            return;
        }

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

        $userEmail = $payload['email'];

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
            'debug_id_viajero' => $payload['userId'],
            'debug_email' => $userEmail,
            'events_count' => count($events),
            'events' => $events
        ]);
    }
}
