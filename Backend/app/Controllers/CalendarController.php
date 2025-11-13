<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\DB;

class CalendarController extends Controller {
  public function events(){
    $from = $this->query('from', date('Y-m-01'));
    $to   = $this->query('to',   date('Y-m-t'));
    $sql  = "SELECT id_reserva as id, localizador, fecha_trayecto as start,
                    CASE tipo_reserva WHEN 'IDA' THEN '#4caf50'
                                      WHEN 'VUELTA' THEN '#1976d2'
                                      ELSE '#ff9800' END as color
             FROM transfer_reservas
             WHERE fecha_trayecto BETWEEN ? AND ?";
    $st = DB::pdo()->prepare($sql);
    $st->execute([$from,$to]);
    $this->json($st->fetchAll());
  }
}
