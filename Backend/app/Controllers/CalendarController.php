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

    // ✔ Incluir reservas con FECHA DE ENTRADA o FECHA DE SALIDA
  $sql = "SELECT 
            id_reserva AS id,
            localizador,
            id_tipo_reserva,

            fecha_entrada,
            hora_entrada,

            fecha_vuelo_salida,
            hora_vuelo_salida,

            id_hotel,
            id_destino,
            id_vehiculo,

            tipo_owner,
            id_owner

        FROM transfer_reservas
        WHERE
            (
                (fecha_entrada BETWEEN ? AND ?)
                OR
                (fecha_vuelo_salida BETWEEN ? AND ?)
            )
";

$params = [$from, $to, $from, $to];

if ($role && $ownerId) {
    $sql .= " AND tipo_owner = ? AND id_owner = ?";
    $params[] = $role;
    $params[] = (int)$ownerId;
}
    $st = DB::pdo()->prepare($sql);
    $st->execute($params);

    $reservas = $st->fetchAll();

    foreach ($reservas as &$r) {

        if (!empty($r['fecha_entrada']) && !empty($r['hora_entrada'])) {
            $r['fecha_completa'] = $r['fecha_entrada'] . "T" . $r['hora_entrada'];
        }
        elseif (!empty($r['fecha_vuelo_salida']) && !empty($r['hora_vuelo_salida'])) {
            $r['fecha_completa'] = $r['fecha_vuelo_salida'] . "T" . $r['hora_vuelo_salida'];
        }
        else {
            $r['fecha_completa'] = null;
        }
    }

    return $this->json($reservas);
}
}
