<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class HotelController extends Controller {

  // Listar reservas del hotel
  public function reservas($hotelId){
    $sql = "SELECT * FROM transfer_reservas
            WHERE id_hotel = ?
            ORDER BY id_reserva DESC";
    $st = DB::pdo()->prepare($sql);
    $st->execute([(int)$hotelId]);
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

    $sql = "SELECT
              id_reserva,
              id_hotel,
              id_tipo_reserva,
              fecha_entrada,
              hora_entrada,
              fecha_vuelo_salida,
              hora_vuelo_salida
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
          'date'  => $r['fecha_entrada'].' '.($r['hora_entrada'] ?? '00:00:00'),
          'type'  => 'IDA',
          'color' => '#3b82f6'
        ];
      }
      if (!empty($r['fecha_vuelo_salida'])) {
        $events[] = [
          'id'    => (int)$r['id_reserva'],
          'title' => 'VUELTA',
          'date'  => $r['fecha_vuelo_salida'].' '.(substr((string)$r['hora_vuelo_salida'],11,8) ?: '00:00:00'),
          'type'  => 'VUELTA',
          'color' => '#10b981'
        ];
      }
    }
    $this->json($events);
  }
}
