<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\DB;

class CalendarController extends Controller {

    /**
     * Eventos del calendario para:
     * - user → solo sus reservas
     * - hotel → reservas cuyo id_hotel = ownerId
     * - admin → TODAS las reservas
     */
    public function events() {

    $from = $this->query('from', date('Y-m-01'));
    $to   = $this->query('to', date('Y-m-t'));

    $role    = $this->query('role', null);
    $ownerId = $this->query('owner', null);

    // Base query: incluir IDA o VUELTA entre fechas
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
                id_vehiculo

            FROM transfer_reservas
            WHERE
                (
                    (fecha_entrada BETWEEN ? AND ?)
                    OR
                    (fecha_vuelo_salida BETWEEN ? AND ?)
                )
    ";

    $params = [$from, $to, $from, $to];

    /**
     * =============================
     * FILTRO SEGÚN TIPO DE USUARIO
     * =============================
     */

    // ADMIN → ve TODO
    if ($role === 'admin') {
        // no añadimos filtros
    }

    // HOTEL → ver reservas asociadas a SU hotel
    else if ($role === 'hotel' && $ownerId) {
        $sql .= " AND id_hotel = ?";
        $params[] = (int)$ownerId;
    }

    // USER → ver solo sus reservas
    else if ($role === 'user' && $ownerId) {
        $sql .= " AND id_owner = ? AND tipo_owner = 'user'";
        $params[] = (int)$ownerId;
    }

    // ejecutar
    $st = DB::pdo()->prepare($sql);
    $st->execute($params);

    $reservas = $st->fetchAll();

    // Preparar fecha completa
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