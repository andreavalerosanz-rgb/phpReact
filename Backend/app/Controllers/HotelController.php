<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class HotelController extends Controller {

    public function dashboard($id) {
    $st = DB::pdo()->prepare("SELECT * FROM transfer_hoteles WHERE id_hotel = ?");
    $st->execute([(int)$id]);
    $hotel = $st->fetch();

    if (!$hotel) {
        $this->json(['error'=>'Hotel no encontrado'],404);
        return;
    }

    // Contar reservas
    $st2 = DB::pdo()->prepare("SELECT COUNT(*) as total_reservas FROM transfer_reservas WHERE id_hotel = ?");
    $st2->execute([(int)$id]);
    $total_reservas = $st2->fetchColumn();

    $this->json([
        'hotel' => $hotel,
        'total_reservas' => (int)$total_reservas
    ]);
}

public function listarHoteles() {
    $st = DB::pdo()->query("SELECT * FROM transfer_hoteles ORDER BY id_hotel ASC");
    $hoteles = $st->fetchAll();
    $this->json($hoteles);
}


    // Listar reservas del hotel
    public function reservas($hotelId){
        $sql = "SELECT * FROM transfer_reservas
                WHERE id_hotel = ?
                ORDER BY id_reserva DESC";
        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$hotelId]);
        $this->json($st->fetchAll());
    }

    public function index() {
    $st = DB::pdo()->query("SELECT * FROM transfer_hoteles ORDER BY id_hotel ASC");
    $this->json($st->fetchAll());
}

    // Mostrar calendario del hotel (rango de fechas)
    public function calendario($hotelId){
        $from = $_GET['from'] ?? null;
        $to   = $_GET['to'] ?? null;

        if (!$from || !$to) {
            $this->json(['error'=>'Faltan parámetros from/to (YYYY-MM-DD)'], 400);
            return;
        }

        $sql = "SELECT id_reserva, fecha_entrada, hora_entrada, fecha_vuelo_salida, hora_vuelo_salida
                FROM transfer_reservas
                WHERE id_hotel = ?
                  AND (
                        (fecha_entrada BETWEEN ? AND ?)
                     OR (fecha_vuelo_salida BETWEEN ? AND ?)
                  )
                ORDER BY id_reserva DESC";

        $st = DB::pdo()->prepare($sql);
        $st->execute([(int)$hotelId, $from, $to, $from, $to]);
        $rows = $st->fetchAll();

        $events = [];
        foreach ($rows as $r) {
            if (!empty($r['fecha_entrada'])) {
                $events[] = [
                    'id'    => (int)$r['id_reserva'],
                    'title' => 'IDA',
                    'start' => $r['fecha_entrada'].'T'.($r['hora_entrada'] ?? '00:00:00'),
                    'type'  => 'IDA',
                    'color' => '#3b82f6'
                ];
            }
            if (!empty($r['fecha_vuelo_salida'])) {
                $events[] = [
                    'id'    => (int)$r['id_reserva'],
                    'title' => 'VUELTA',
                    'start' => $r['fecha_vuelo_salida'].'T'.(substr((string)$r['hora_vuelo_salida'],11,8) ?: '00:00:00'),
                    'type'  => 'VUELTA',
                    'color' => '#10b981'
                ];
            }
        }
        $this->json($events);
    }
}
