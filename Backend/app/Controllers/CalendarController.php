<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\DB;

class CalendarController extends Controller {

    // Calendario general de eventos
    public function events() {
        $from    = $this->query('from', date('Y-m-01'));
        $to      = $this->query('to', date('Y-m-t'));
        $hotelId = $this->query('hotel'); // opcional

        $sql = "SELECT 
                    id_reserva AS id,
                    localizador,
                    fecha_entrada AS start,
                    CASE id_tipo_reserva
                        WHEN 1 THEN '#4caf50'   -- IDA
                        WHEN 2 THEN '#1976d2'   -- VUELTA
                        ELSE '#ff9800'          -- Otro
                    END AS color
                FROM transfer_reservas
                WHERE fecha_entrada BETWEEN ? AND ?";

        $params = [$from, $to];

        if ($hotelId) {
            $sql .= " AND id_hotel = ?";
            $params[] = $hotelId;
        }

        $st = DB::pdo()->prepare($sql);
        $st->execute($params);
        $this->json($st->fetchAll());
    }

    // Calendario del hotel sin vista (day, week, month)
    public function hotelCalendar($id) {
    $from = $this->query('from', null); // null si no viene
    $to   = $this->query('to', null);

    $sql = "SELECT 
                id_reserva AS id,
                localizador,
                fecha_entrada AS start,
                CASE id_tipo_reserva
                    WHEN 1 THEN '#4caf50'
                    WHEN 2 THEN '#1976d2'
                    ELSE '#ff9800'
                END AS color
            FROM transfer_reservas
            WHERE id_hotel = ?";

    $params = [$id];

    if ($from && $to) {
        $sql .= " AND fecha_entrada BETWEEN ? AND ?";
        $params[] = $from;
        $params[] = $to;
    }

    $st = DB::pdo()->prepare($sql);
    $st->execute($params);
    $this->json($st->fetchAll());
  }

  // Calendario del hotel con vista (day, week, month)
    public function hotelCalendarView($id) {
      $view = $this->query('view', 'month'); // day | week | month
      $date = $this->query('date', date('Y-m-d'));

      // Aquí puedes calcular rango según la vista
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

      $sql = "SELECT id_reserva AS id, localizador, fecha_entrada AS start,
                  CASE id_tipo_reserva
                      WHEN 1 THEN '#4caf50'
                      WHEN 2 THEN '#1976d2'
                      ELSE '#ff9800'
                  END AS color
              FROM transfer_reservas
              WHERE id_hotel = ? AND fecha_entrada BETWEEN ? AND ?";
      $st = DB::pdo()->prepare($sql);
      $st->execute([$id, $from, $to]);
      $this->json($st->fetchAll());
  }
}