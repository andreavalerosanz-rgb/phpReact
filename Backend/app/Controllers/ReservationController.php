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

 public function show($id) {
    try {
        $db = DB::pdo();

        // ============================
        // 1️⃣ OBTENER LA RESERVA BASE
        // ============================
        $st = $db->prepare("SELECT * FROM transfer_reservas WHERE id_reserva = ?");
        $st->execute([(int)$id]);
        $reserva = $st->fetch();

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        // ============================
        // 2️⃣ OBTENER HOTEL (nombre)
        // ============================
        $st = $db->prepare("SELECT nombre FROM transfer_hoteles WHERE id_hotel = ?");
        $st->execute([$reserva['id_hotel']]);
        $hotelNombre = $st->fetchColumn() ?: null;

        // ============================
        // 3️⃣ OBTENER VEHÍCULO (Descripción)
        // ============================
        $st = $db->prepare("SELECT `Descripción` FROM transfer_vehiculos WHERE id_vehiculo = ?");
        $st->execute([$reserva['id_vehiculo']]);
        $vehiculoDescripcion = $st->fetchColumn() ?: null;

        // ============================
        // 4️⃣ AÑADIR CAMPOS AL JSON
        // ============================
        $reserva['hotel_nombre'] = $hotelNombre;
        $reserva['vehiculo_descripcion'] = $vehiculoDescripcion;

        // (zona NO se añade porque NO debe mostrarse)

        return $this->json($reserva);

    } catch (\Throwable $e) {
        http_response_code(500);
        return $this->json([
            "php_error" => $e->getMessage(),
            "line" => $e->getLine(),
            "file" => $e->getFile()
        ]);
    }
}




  /** Comprueba existencia FK genérica */
  private function fkExists(string $table, string $pk, int $id): bool {
    $st = DB::pdo()->prepare("SELECT 1 FROM {$table} WHERE {$pk}=? LIMIT 1");
    $st->execute([$id]);
    return (bool)$st->fetchColumn();
  }


public function store() {
    try {
        // --------------------------
        // 1. Leer JSON de la petición
        // --------------------------
        $in = $this->body();

        // --------------------------
        // 2. OWNER (usuario / hotel / admin)
        // --------------------------
        $tipoOwner = $in['tipo_owner'] ?? null;   // "user" | "hotel" | "admin"
        $idOwner   = isset($in['id_owner']) ? (int)$in['id_owner'] : null;

        if (empty($tipoOwner) || !array_key_exists('id_owner', $in)) {
    return $this->json(['error' => 'Falta tipo_owner o id_owner'], 400);
}


        // --------------------------
        // 3. MAPEO TIPO DE RESERVA
        // --------------------------
        $tipoTxt = strtoupper(trim($in['tipo'] ?? ''));
        $map     = ['IDA'=>1, 'VUELTA'=>2, 'IDA_VUELTA'=>3];
        $idTipo  = $map[$tipoTxt] ?? null;

        // Campos base
        $idHotel     = isset($in['id_hotel'])    ? (int)$in['id_hotel']    : null;
        $idDestino   = isset($in['id_destino'])  ? (int)$in['id_destino']  : null;
        $idVehiculo  = isset($in['id_vehiculo']) ? (int)$in['id_vehiculo'] : null;
        $pax         = isset($in['num_viajeros'])? (int)$in['num_viajeros']: null;
        $emailCliente = $in['email_cliente'] ?? null;

        // --------------------------
        // 4. DATOS IDA (Aeropuerto → Hotel)
        // --------------------------
        $fechaEntrada   = $in['fecha_entrada']         ?? null;
        $horaEntrada    = $in['hora_entrada']          ?? null;
        $vueloEntrada   = $in['numero_vuelo_entrada']  ?? null;
        $origenEntrada  = $in['origen_vuelo_entrada']  ?? null;

        // --------------------------
        // 5. DATOS VUELTA (Hotel → Aeropuerto)
        // --------------------------
        $fechaSalida    = $in['fecha_vuelo_salida']    ?? null;
        $horaVueloSalida = $in['hora_vuelo_salida']    ?? null;

        if ($tipoTxt === 'VUELTA') {
            // VUELTA simple: se guarda como "entrada"
            $fechaEntrada  = $fechaSalida;
            $horaEntrada   = $horaVueloSalida;
            $vueloEntrada  = $in['numero_vuelo_salida'] ?? null;
            $origenEntrada = $in['origen_vuelo_salida'] ?? null;
        }

        if ($tipoTxt === 'IDA_VUELTA') {
            // La VUELTA usa hora de recogida en hotel
            $fechaEntrada  = $fechaSalida;
            $horaEntrada   = $in['hora_recogida_hotel'] ?? null;
            $vueloEntrada  = $in['numero_vuelo_salida'] ?? null;
            $origenEntrada = $in['origen_vuelo_salida'] ?? null;
        }

        // --------------------------
        // 6. VALIDACIONES
        // --------------------------
        $errors = [];

        if (!$idTipo) {
            $errors['tipo'] = "tipo debe ser IDA | VUELTA | IDA_VUELTA";
        }

        foreach (['id_hotel','id_destino','id_vehiculo','num_viajeros'] as $f) {
            if (!isset($in[$f]) || !is_numeric($in[$f])) {
                $errors[$f] = "$f es requerido y numérico";
            }
        }

        if (!$emailCliente) {
            $errors['email_cliente'] = "email_cliente es requerido";
        } elseif (!filter_var($emailCliente, FILTER_VALIDATE_EMAIL)) {
            $errors['email_cliente'] = "email_cliente no es válido";
        }

        // Validaciones por tipo
        if ($tipoTxt === 'IDA') {
            foreach (['fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada'] as $f) {
                if (empty($in[$f])) {
                    $errors[$f] = "Campo $f requerido para IDA";
                }
            }
        }

        if ($tipoTxt === 'VUELTA') {
            foreach (['fecha_vuelo_salida','hora_vuelo_salida','numero_vuelo_salida','origen_vuelo_salida'] as $f) {
                if (empty($in[$f])) {
                    $errors[$f] = "Campo $f requerido para VUELTA";
                }
            }
        }

        if ($tipoTxt === 'IDA_VUELTA') {
            foreach (['fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada'] as $f) {
                if (empty($in[$f])) {
                    $errors[$f] = "Campo $f requerido para IDA_VUELTA (IDA)";
                }
            }
            foreach (['fecha_vuelo_salida','hora_vuelo_salida','numero_vuelo_salida','origen_vuelo_salida','hora_recogida_hotel'] as $f) {
                if (empty($in[$f])) {
                    $errors[$f] = "Campo $f requerido para IDA_VUELTA (VUELTA)";
                }
            }
        }

        if (!empty($errors)) {
            return $this->json(['error' => 'VALIDATION_ERROR', 'details' => $errors], 400);
        }

        // --------------------------
        // 7. CHECK FKs
        // --------------------------

        // Validar OWNER según su tipo

        $tipoOwner = isset($in['tipo_owner'])
    ? strtolower(trim($in['tipo_owner']))
    : null;

switch ($tipoOwner) {
    case 'user':
        if (!$this->fkExists('transfer_viajeros', 'id_viajero', $idOwner)) {
            $errors['id_owner'] = "El viajero no existe (id_viajero=$idOwner)";
        }
        break;

    case 'admin':
        if (!$this->fkExists('transfer_admin', 'id_admin', $idOwner)) {
            $errors['id_owner'] = "El admin no existe (id_admin=$idOwner)";
        }
        break;

    case 'hotel':
        if (!$this->fkExists('transfer_hoteles', 'id_hotel', $idOwner)) {
            $errors['id_owner'] = "El hotel no existe (id_hotel=$idOwner)";
        }
        break;

    default:
        $errors['tipo_owner'] = "tipo_owner debe ser user | admin | hotel";
}

        if (!$this->fkExists('transfer_tipo_reservas','id_tipo_reserva',(int)$idTipo)) {
            $errors['id_tipo_reserva'] = "No existe";
        }

        if (!$this->fkExists('transfer_hoteles','id_hotel',(int)$idHotel)) {
            $errors['id_hotel'] = "No existe";
        }

        if (!$this->fkExists('transfer_hoteles','id_hotel',(int)$idDestino)) {
            $errors['id_destino'] = "No existe";
        }

        if (!$this->fkExists('transfer_vehiculos','id_vehiculo',(int)$idVehiculo)) {
            $errors['id_vehiculo'] = "No existe";
        }

        if (!empty($errors)) {
            return $this->json(['error' => 'VALIDATION_ERROR', 'details' => $errors], 400);
        }

        // --------------------------
        // 8. Normalizar horas
        // --------------------------
        if ($horaEntrada && strlen($horaEntrada) === 5) {
            $horaEntrada .= ':00'; // "HH:MM" → "HH:MM:00"
        }

        if ($horaVueloSalida && strlen($horaVueloSalida) === 5) {
            $horaVueloSalida .= ':00';
        }

        // --------------------------
        // 9. INSERT
        // --------------------------
        $localizador = $this->generarLocalizador();

        $sql = "INSERT INTO transfer_reservas (
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
            tipo_owner,
            id_owner,
            id_vehiculo
        ) VALUES (
            ?, ?, ?, ?, NOW(), NOW(),
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";

        $params = [
    $localizador,          // 1 localizador
    (int)$idHotel,         // 2 id_hotel
    (int)$idTipo,          // 3 id_tipo_reserva
    $emailCliente,         // 4 email_cliente
    // 5 NOW() → fecha_reserva
    // 6 NOW() → fecha_modificacion
    (int)$idDestino,       // 7 id_destino
    $fechaEntrada,         // 8 fecha_entrada
    $horaEntrada,          // 9 hora_entrada
    $vueloEntrada,         // 10 numero_vuelo_entrada
    $origenEntrada,        // 11 origen_vuelo_entrada
    $horaVueloSalida,      // 12 hora_vuelo_salida
    $fechaSalida,          // 13 fecha_vuelo_salida
    (int)$pax,             // 14 num_viajeros
    $tipoOwner,            // 15 tipo_owner
    (int)$idOwner,         // 16 id_owner
    (int)$idVehiculo       // 17 id_vehiculo
];


        $st = DB::pdo()->prepare($sql);
        if (!$st->execute($params)) {
            // Debug de error SQL si algo falla
            return $this->json([
                'error'    => 'SQL_ERROR',
                'info'     => $st->errorInfo(),
                'params'   => $params
            ], 500);
        }

        return $this->json([
            'id'          => DB::pdo()->lastInsertId(),
            'localizador' => $localizador,
            'tipo'        => $tipoTxt
        ], 201);

    } catch (\Throwable $e) {
        http_response_code(500);
        return $this->json([
            "php_error" => $e->getMessage(),
            "line"      => $e->getLine(),
            "file"      => $e->getFile()
        ]);
    }
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
