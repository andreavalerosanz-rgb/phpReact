<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\DB;

class CalendarController extends Controller {

    /**
     * Calendario global — aplica filtros por owner
     */
   public function events() {

    $from = $this->query('from', date('Y-m-01'));
    $to   = $this->query('to', date('Y-m-t'));

    $role    = $this->query('role', null);
    $ownerId = $this->query('owner', null);

    $sql = "SELECT 
                id_reserva AS id,
                localizador,
                DATE(fecha_entrada) AS start,
                CASE id_tipo_reserva
                    WHEN 1 THEN '#4caf50'
                    WHEN 2 THEN '#1976d2'
                    ELSE '#ff9800'
                END AS color
            FROM transfer_reservas
            WHERE fecha_entrada BETWEEN ? AND ?";

    $params = [$from, $to];

    if ($role && $ownerId) {
        $sql .= " AND tipo_owner = ? AND id_owner = ?";
        $params[] = $role;
        $params[] = (int)$ownerId;
    }

    $st = DB::pdo()->prepare($sql);
    $st->execute($params);

    return $this->json($st->fetchAll());
}
}
