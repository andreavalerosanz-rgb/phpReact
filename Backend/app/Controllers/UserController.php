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

        $sqlUser = "SELECT * FROM transfer_viajeros WHERE id_viajero = ?";
        $st = DB::pdo()->prepare($sqlUser);
        $st->execute([(int)$userId]);
        $user = $st->fetch();

        if (!$user) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Ahora filtramos por tipo_owner + id_owner
        $sql = "SELECT *
                FROM transfer_reservas
                WHERE tipo_owner = 'user'
                AND id_owner = ?
                ORDER BY id_reserva DESC";

        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$userId]);
        $reservas = $st->fetchAll();

        return $this->json([
            'user' => $user,
            'reservas' => $reservas
        ]);
    }

    /**
     * Listar reservas de un usuario por ID
     * GET /api/user/{id}/reservas
     */
    public function reservas($userId) {

        $sql = "SELECT *
                FROM transfer_reservas
                WHERE tipo_owner = 'user'
                AND id_owner = ?
                ORDER BY id_reserva DESC";

        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$userId]);
        $reservas = $st->fetchAll();

        return $this->json($reservas);
    }

    /**
     * Calendario simple
     * GET /api/user/{id}/calendario?from=YYYY-MM-DD&to=YYYY-MM-DD
     */
    public function calendario($userId) {

        $from = $this->query('from');
        $to   = $this->query('to');

        if (!$from || !$to) {
            return $this->json(['error' => 'Se requieren parámetros from y to'], 400);
        }

        $sql = "SELECT 
                    id_reserva,
                    fecha_entrada,
                    fecha_vuelo_salida,
                    hora_entrada,
                    hora_vuelo_salida,
                    id_tipo_reserva
                FROM transfer_reservas
                WHERE tipo_owner = 'user'
                AND id_owner = ?
                AND (
                    fecha_entrada BETWEEN ? AND ?
                    OR fecha_vuelo_salida BETWEEN ? AND ?
                )";

        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$userId, $from, $to, $from, $to]);
        $rows = $st->fetchAll();

        $events = [];

        foreach ($rows as $r) {
            if ($r['fecha_entrada']) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_entrada'].'T'.($r['hora_entrada'] ?? '00:00'),
                    'type' => 'IDA',
                    'color' => '#4caf50'
                ];
            }
            if ($r['fecha_vuelo_salida']) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_vuelo_salida'].'T'.($r['hora_vuelo_salida'] ?? '00:00'),
                    'type' => 'VUELTA',
                    'color' => '#1976d2'
                ];
            }
        }

        return $this->json($events);
    }

    /**
     * Calendario con vista day/week/month
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

        $sql = "SELECT 
                    id_reserva,
                    fecha_entrada,
                    fecha_vuelo_salida,
                    hora_entrada,
                    hora_vuelo_salida,
                    id_tipo_reserva
                FROM transfer_reservas
                WHERE tipo_owner = 'user'
                AND id_owner = ?
                AND (
                    fecha_entrada BETWEEN ? AND ?
                    OR fecha_vuelo_salida BETWEEN ? AND ?
                )";

        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$userId, $from, $to, $from, $to]);
        $rows = $st->fetchAll();

        $events = [];

        foreach ($rows as $r) {
            if ($r['fecha_entrada']) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_entrada'].'T'.($r['hora_entrada'] ?? '00:00'),
                    'type' => 'IDA',
                    'color' => '#4caf50'
                ];
            }
            if ($r['fecha_vuelo_salida']) {
                $events[] = [
                    'id' => $r['id_reserva'],
                    'start' => $r['fecha_vuelo_salida'].'T'.($r['hora_vuelo_salida'] ?? '00:00'),
                    'type' => 'VUELTA',
                    'color' => '#1976d2'
                ];
            }
        }

        return $this->json($events);
    }
}
