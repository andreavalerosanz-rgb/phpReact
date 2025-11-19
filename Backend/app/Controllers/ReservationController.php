<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;
use App\Helpers\Helpers; // trait para generarLocalizador()

class ReservationController extends Controller {
  use Helpers;

  public function index(){
    $st = DB::pdo()->query("SELECT * FROM transfer_reservas ORDER BY id_reserva DESC LIMIT 50");
    $this->json($st->fetchAll());
  }

  public function show($id){
    $st = DB::pdo()->prepare("SELECT * FROM transfer_reservas WHERE id_reserva=?");
    $st->execute([(int)$id]);
    $r = $st->fetch();
    $r ? $this->json($r) : $this->json(['error'=>'Not found'],404);
  }

  /** Comprueba existencia FK genérica */
  private function fkExists(string $table, string $pk, int $id): bool {
    $st = DB::pdo()->prepare("SELECT 1 FROM {$table} WHERE {$pk}=? LIMIT 1");
    $st->execute([$id]);
    return (bool)$st->fetchColumn();
  }

public function store() {
    $in = $this->body();

    // --------------------------
    // MAPEO TIPO
    // --------------------------
    $tipoTxt = strtoupper(trim($in['tipo'] ?? ''));
    $map = ['IDA'=>1, 'VUELTA'=>2, 'IDA_VUELTA'=>3];
    $idTipo = $map[$tipoTxt] ?? null;

    $idHotel    = $in['id_hotel']    ?? null;
    $idDestino  = $in['id_destino']  ?? null;
    $idVehiculo = $in['id_vehiculo'] ?? null;
    $pax        = $in['num_viajeros'] ?? null;
    $emailCliente = isset($in['email_cliente']) ? trim($in['email_cliente']) : null;

    // --------------------------
    // DATOS IDA (aeropuerto → hotel)
    // --------------------------
    $fechaEntrada   = $in['fecha_entrada']        ?? null;
    $horaEntrada    = $in['hora_entrada']         ?? null;
    $vueloEntrada   = $in['numero_vuelo_entrada'] ?? null;
    $origenEntrada  = $in['origen_vuelo_entrada'] ?? null;

    // --------------------------
    // DATOS VUELTA (hotel → aeropuerto)
    // Se guardan como ENTRADA si es VUELTA o IDA_VUELTA
    // --------------------------
    $fechaSalida = $in['fecha_vuelo_salida'] ?? null;
    $horaSalida  = $in['hora_vuelo_salida']  ?? null;

    if ($tipoTxt === 'VUELTA') {
        // VUELTA simple
        $fechaEntrada  = $fechaSalida;
        $horaEntrada   = $horaSalida;
        $vueloEntrada  = $in['numero_vuelo_salida'] ?? null;
        $origenEntrada = $in['origen_vuelo_salida'] ?? null;
    }

    if ($tipoTxt === 'IDA_VUELTA') {
        // IDA_VUELTA usa hora de recogida en hotel
        $fechaEntrada  = $fechaSalida;
        $horaEntrada   = $in['hora_recogida_hotel'] ?? null; 
        $vueloEntrada  = $in['numero_vuelo_salida'] ?? null;
        $origenEntrada = $in['origen_vuelo_salida'] ?? null;
    }

    $role = strtolower($in['role'] ?? 'user');

    // --------------------------
    // VALIDACIONES
    // --------------------------
    $errors = [];

    if (!$idTipo) $errors['tipo'] = 'tipo debe ser IDA | VUELTA | IDA_VUELTA';

    foreach (['id_hotel','id_destino','id_vehiculo','num_viajeros'] as $fld) {
        if (!isset($in[$fld]) || !is_numeric($in[$fld])) {
            $errors[$fld] = "$fld es requerido y numérico";
        }
    }

    if (!$emailCliente)
        $errors['email_cliente'] = 'email_cliente es requerido';
    elseif (!filter_var($emailCliente, FILTER_VALIDATE_EMAIL))
        $errors['email_cliente'] = 'email_cliente no tiene un formato válido';

    // VALIDACIONES IDA
    if ($tipoTxt === 'IDA') {
        foreach (['fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada'] as $f) {
            if (empty($in[$f])) $errors[$f] = "Campo $f requerido para IDA";
        }
    }

    // VALIDACIONES VUELTA
    if ($tipoTxt === 'VUELTA') {
        foreach (['fecha_vuelo_salida','hora_vuelo_salida','numero_vuelo_salida','origen_vuelo_salida'] as $f) {
            if (empty($in[$f])) $errors[$f] = "Campo $f requerido para VUELTA";
        }
    }

    // VALIDACIONES IDA_VUELTA
    if ($tipoTxt === 'IDA_VUELTA') {
        foreach (['fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada'] as $f) {
            if (empty($in[$f])) $errors[$f] = "Campo $f requerido para IDA_VUELTA (IDA)";
        }
        foreach (['fecha_vuelo_salida','hora_vuelo_salida','numero_vuelo_salida','origen_vuelo_salida','hora_recogida_hotel'] as $f) {
            if (empty($in[$f])) $errors[$f] = "Campo $f requerido para IDA_VUELTA (VUELTA)";
        }
    }

    if ($errors) {
        $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors],400);
        return;
    }

    // --------------------------
    // CHECK FKs
    // --------------------------
    if ($idTipo && !$this->fkExists('transfer_tipo_reservas','id_tipo_reserva',(int)$idTipo)) $errors['id_tipo_reserva']='No existe';
    if ($idHotel && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idHotel)) $errors['id_hotel']='No existe';
    if ($idDestino && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idDestino)) $errors['id_destino']='No existe';
    if ($idVehiculo && !$this->fkExists('transfer_vehiculos','id_vehiculo',(int)$idVehiculo)) $errors['id_vehiculo']='No existe';

    if ($errors) {
        $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors],400);
        return;
    }

    // Normalizar DATETIME si solo llega la hora
if (isset($in['hora_vuelo_salida']) && strlen($in['hora_vuelo_salida']) === 5) {
    // añadir fecha obligatoria
    if (!empty($in['fecha_vuelo_salida'])) {
        $in['hora_vuelo_salida'] = $in['fecha_vuelo_salida'] . ' ' . $in['hora_vuelo_salida'] . ':00';
    }
}

    // --------------------------
    // FECHAS FINALES
    // --------------------------
    $fechaEntrada = $fechaEntrada ?: date('Y-m-d');
    $horaEntrada  = $horaEntrada  ?: '09:00:00';

    $fechaSalida = $fechaSalida ?: $fechaEntrada;
    $horaSalida  = $horaSalida  ?: '18:00:00';


// NORMALIZAR hora_vuelo_salida
// --- NORMALIZAR hora_vuelo_salida ---
if (!empty($in['hora_vuelo_salida'])) {

    // Si ya incluye fecha → no tocar
    if (preg_match('/^\d{4}-\d{2}-\d{2}/', $in['hora_vuelo_salida'])) {
        // ya es datetime
    } else {
        // Solo hora, añadir fecha
        if (!empty($in['fecha_vuelo_salida'])) {

            $hora = $in['hora_vuelo_salida'];
            if (strlen($hora) === 5) {
                $hora .= ':00';
            }

            $in['hora_vuelo_salida'] = $in['fecha_vuelo_salida'].' '.$hora;
        }
    }
}

    // --------------------------
    // INSERT
    // --------------------------
    $localizador = $this->generarLocalizador();

     $sql = "INSERT INTO transfer_reservas
(
    localizador,
    id_hotel,
    id_tipo_reserva,
    email_cliente,
    fecha_reserva,
    fecha_modificacion,
    id_destino,
    fecha_entrada,
    hora_entrada,
    numero_vuelo_entrada,
    origen_vuelo_entrada,
    hora_vuelo_salida,
    fecha_vuelo_salida,
    num_viajeros,
    id_vehiculo
)
VALUES (
    ?, ?, ?, ?, NOW(), NOW(),
    ?, ?, ?, ?, ?, ?, ?, ?, ?
)";

$params = [
    $localizador,
    (int)$idHotel,
    (int)$idTipo,
    $emailCliente,
    (int)$idDestino,
    $fechaEntrada,
    $horaEntrada,
    $vueloEntrada,
    $origenEntrada,
    $horaSalidaTS,
    $fechaSalida,
    (int)$pax,
    (int)$idVehiculo
];


    $st = DB::pdo()->prepare($sql);
    $st->execute($params);

    $reservaId = (int)DB::pdo()->lastInsertId();

    $this->json([
        'id' => $reservaId,
        'localizador' => $localizador,
        'tipo' => $tipoTxt
    ],201);
}

public function update($id) {
    try {

        $in   = $this->body();
        $id   = (int)$id;
        $role = strtolower($in['role'] ?? 'user');

        // ------------------------------------------
        // 1. Cargar la reserva original
        // ------------------------------------------
        $st0 = DB::pdo()->prepare("SELECT * FROM transfer_reservas WHERE id_reserva=?");
        $st0->execute([$id]);
        $reserva = $st0->fetch();

        if (!$reserva) {
            return $this->json(['error'=>'Not found'],404);
        }

        // ------------------------------------------
        // 2. Normalización segura de hora_vuelo_salida
        // ------------------------------------------
        if (!empty($in['hora_vuelo_salida'])) {

            // ➤ Si YA es datetime válido, no tocar
            if (!preg_match('/^\d{4}-\d{2}-\d{2}/', $in['hora_vuelo_salida'])) {

                // ➤ Si viene solo la hora, añadir fecha
                if (!empty($in['fecha_vuelo_salida'])) {

                    $hora = $in['hora_vuelo_salida'];

                    // HH:MM → HH:MM:00
                    if (strlen($hora) === 5) {
                        $hora .= ":00";
                    }

                    $in['hora_vuelo_salida'] = $in['fecha_vuelo_salida'] . ' ' . $hora;
                }
            }
        }

        // ------------------------------------------
        // 3. Normalización segura de hora_entrada
        // ------------------------------------------
        if (!empty($in['hora_entrada'])) {

            if (!preg_match('/^\d{4}-\d{2}-\d{2}/', $in['hora_entrada'])) {

                if (!empty($in['fecha_entrada'])) {

                    $hora = $in['hora_entrada'];

                    if (strlen($hora) === 5) {
                        $hora .= ":00";
                    }

                    $in['hora_entrada'] = $in['fecha_entrada'] . ' ' . $hora;
                }
            }
        }

        // ------------------------------------------
        // 4. Regla de 48 horas (solo usuarios)
        // ------------------------------------------
        if ($role !== 'admin') {
            $now = new \DateTime();

            $targets = [];

            // Fecha/hora de ida
            if ($reserva['fecha_entrada'] && $reserva['hora_entrada']) {
                $targets[] = new \DateTime($reserva['fecha_entrada'].' '.$reserva['hora_entrada']);
            }

            // Fecha/hora de vuelta
           if ($reserva['fecha_vuelo_salida'] && $reserva['hora_vuelo_salida']) {

    // si hora ya contiene fecha → usarla tal cual
    if (preg_match('/^\d{4}-\d{2}-\d{2}/', $reserva['hora_vuelo_salida'])) {
        $targets[] = new \DateTime($reserva['hora_vuelo_salida']);
    } else {
        // si SOLO es hora → combinar
        $targets[] = new \DateTime($reserva['fecha_vuelo_salida'].' '.$reserva['hora_vuelo_salida']);
    }
}


            foreach ($targets as $dt) {
                $diffH = ($dt->getTimestamp() - $now->getTimestamp()) / 3600;
                if ($diffH < 48) {
                    return $this->json([
                        'error' => 'REGRA_48H',
                        'message' => 'No puedes editar esta reserva a menos de 48h'
                    ], 400);
                }
            }
        }

        // ------------------------------------------
        // 5. Campos editables permitidos
        // ------------------------------------------
        $allowed = [
            'fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada',
            'fecha_vuelo_salida','hora_vuelo_salida','numero_vuelo_salida','origen_vuelo_salida',
            'hora_recogida_hotel','id_vehiculo','num_viajeros',
            'id_hotel','id_destino','email_cliente','telefono_cliente','nombre_cliente'
        ];

        $set = [];
        $params = [];

        foreach ($allowed as $campo) {
            if (isset($in[$campo]) && $in[$campo] !== "") {
                $set[] = "$campo = ?";
                $params[] = $in[$campo];
            }
        }

        // Tipo de reserva (si viene)
        if (isset($in['tipo'])) {
            $map = ['IDA'=>1,'VUELTA'=>2,'IDA_VUELTA'=>3];
            $tipoMap = $map[strtoupper($in['tipo'])] ?? $reserva['id_tipo_reserva'];
            $set[] = "id_tipo_reserva = ?";
            $params[] = $tipoMap;
        }

        if (empty($set)) {
            return $this->json(['error'=>'No hay campos válidos para actualizar'],400);
        }

        $set[] = "fecha_modificacion = NOW()";

        // ------------------------------------------
        // 6. UPDATE final
        // ------------------------------------------
        $sql = "UPDATE transfer_reservas SET ".implode(", ", $set)." WHERE id_reserva=?";
        $params[] = $id;

        $st = DB::pdo()->prepare($sql);
        $st->execute($params);

        return $this->json(['updated'=>true, 'id'=>$id]);

    } catch (\Throwable $e) {
        http_response_code(500);
        header("Content-Type: application/json");
        echo json_encode([
            "php_error" => $e->getMessage(),
            "line" => $e->getLine(),
            "file" => $e->getFile()
        ]);
        return;
    }
}

public function destroy($id){
    $in   = $this->body(); // rol llega en body
    $role = strtolower($in['role'] ?? 'user');

    // Comprobar que la reserva existe
    $st0 = DB::pdo()->prepare("SELECT fecha_entrada, hora_entrada, fecha_vuelo_salida, hora_vuelo_salida FROM transfer_reservas WHERE id_reserva=?");
    $st0->execute([(int)$id]);
    $reserva = $st0->fetch();

    if (!$reserva) {
        $this->json(['error'=>'Not found'],404);
        return;
    }

    $ahora = new \DateTime('now');

    // Si es admin → puede borrar todo
    if ($role === 'admin') {
        $st = DB::pdo()->prepare("DELETE FROM transfer_reservas WHERE id_reserva=?");
        $st->execute([(int)$id]);
        $this->json(['deleted'=> (int)$id]);
        return;
    }

    // Usuario normal → comprobar regla 48h
    $toCheck = [];
    if ($reserva['fecha_entrada'] && $reserva['hora_entrada']) {
        $toCheck[] = new \DateTime($reserva['fecha_entrada'].' '.$reserva['hora_entrada']);
    }
    if ($reserva['fecha_vuelo_salida'] && $reserva['hora_vuelo_salida']) {
    $toCheck[] = new \DateTime($reserva['fecha_vuelo_salida'].' '.$reserva['hora_vuelo_salida']);
}

    foreach ($toCheck as $dt) {
        $diff = $ahora->diff($dt);
        $hours = ($diff->days * 24) + $diff->h + ($diff->i / 60);
        if ($dt <= $ahora || $hours < 48) {
            $this->json([
                'error'=>'REGRA_48H',
                'message'=>'Usuarios no pueden eliminar dentro de las 48h'
            ], 400);
            return;
        }
    }

    // Fuera de las 48h → puede borrar
    $st = DB::pdo()->prepare("DELETE FROM transfer_reservas WHERE id_reserva=?");
    $st->execute([(int)$id]);
    $this->json(['deleted'=> (int)$id]);
}

}
