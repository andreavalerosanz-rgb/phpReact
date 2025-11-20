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

    // Mapeo tipo
    $tipoTxt = strtoupper(trim($in['tipo'] ?? ''));
    $map     = ['IDA'=>1, 'VUELTA'=>2, 'IDA_VUELTA'=>3];
    $idTipo  = $map[$tipoTxt] ?? null;

    $idHotel     = $in['id_hotel']     ?? null;
    $idDestino   = $in['id_destino']   ?? null;
    $idVehiculo  = $in['id_vehiculo']  ?? null;
    $pax         = $in['num_viajeros'] ?? null;
    $emailCliente= isset($in['email_cliente']) ? trim((string)$in['email_cliente']) : null;

    // IDA
    $fechaEntrada  = $in['fecha_entrada']        ?? null;
    $horaEntrada   = $in['hora_entrada']         ?? null;
    $vueloEntrada  = $in['numero_vuelo_entrada'] ?? null;
    $origenEntrada = $in['origen_vuelo_entrada'] ?? null;

    // VUELTA
    $fechaSalida = $in['fecha_vuelo_salida'] ?? null;
    $horaSalida  = $in['hora_vuelo_salida']  ?? null;

    $role = strtolower($in['role'] ?? 'user');

    // ---------- VALIDACIONES ----------
    $errors = [];

    if (!$idTipo) $errors['tipo'] = 'tipo debe ser IDA | VUELTA | IDA_VUELTA';
    foreach (['id_hotel','id_destino','id_vehiculo','num_viajeros'] as $fld) {
        if (!isset($in[$fld]) || !is_numeric($in[$fld])) $errors[$fld] = "$fld es requerido y numérico";
    }
    if (!$emailCliente) $errors['email_cliente'] = 'email_cliente es requerido';
    elseif (!filter_var($emailCliente, FILTER_VALIDATE_EMAIL)) $errors['email_cliente'] = 'email_cliente no tiene un formato válido';

        // Para VUELTA e IDA_VUELTA, permitimos null si el usuario no lo pone
    if (in_array($tipoTxt, ['VUELTA','IDA_VUELTA'], true)) {
        $fechaSalida = $in['fecha_vuelo_salida'] ?? null;
        $horaSalida  = $in['hora_vuelo_salida'] ?? null;

        // Si viene vacío string, lo convertimos a null
        if ($fechaSalida === '') $fechaSalida = null;
        if ($horaSalida  === '') $horaSalida  = null;
    } else {
        $fechaSalida = null;
        $horaSalida  = null;
    }
    if (in_array($tipoTxt, ['VUELTA','IDA_VUELTA'], true)) {
    // Si no viene o viene vacío, lo dejamos en null
    $fechaSalida = isset($in['fecha_vuelo_salida']) && trim($in['fecha_vuelo_salida']) !== '' 
        ? $in['fecha_vuelo_salida'] 
        : null;

    $horaSalida = isset($in['hora_vuelo_salida']) && trim($in['hora_vuelo_salida']) !== '' 
        ? $in['hora_vuelo_salida'] 
        : null;
    }   

    // regla 48h
    if ($role !== 'admin') {
        $ahora = new \DateTime('now');
        $toCheck = [];
        if ($fechaEntrada && $horaEntrada && in_array($tipoTxt, ['IDA','IDA_VUELTA'], true)) {
            $toCheck[] = new \DateTime("$fechaEntrada $horaEntrada");
        }
        if ($fechaSalida && $horaSalida && in_array($tipoTxt, ['VUELTA','IDA_VUELTA'], true)) {
            $toCheck[] = new \DateTime("$fechaSalida $horaSalida");
        }
        foreach ($toCheck as $dt) {
            $diff = $ahora->diff($dt);
            $hours = ($diff->days * 24) + $diff->h + ($diff->i/60);
            if ($dt <= $ahora || $hours < 48) {
                $errors['regla_48h'] = 'Reservas de usuario: mínimo 48h de antelación';
                break;
            }
        }
    }

    // Validación FKs
    if ($idTipo && !$this->fkExists('transfer_tipo_reservas','id_tipo_reserva',(int)$idTipo)) $errors['id_tipo_reserva']='No existe';
    if ($idHotel && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idHotel)) $errors['id_hotel']='No existe';
    if ($idDestino && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idDestino)) $errors['id_destino']='No existe';
    if ($idVehiculo && !$this->fkExists('transfer_vehiculos','id_vehiculo',(int)$idVehiculo)) $errors['id_vehiculo']='No existe';

    if ($errors) { $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors],400); return; }

    // ---------- FALLBACKS DATETIME ----------
    $fechaEntrada = $fechaEntrada ?: ($fechaSalida ?? date('Y-m-d'));
    $horaEntrada  = $horaEntrada  ?: '09:00:00';
    $horaSalidaTS = ($fechaSalida && $horaSalida) ? "$fechaSalida $horaSalida" : null;
    $horaSalida   = $horaSalida   ?: '18:00:00';

    $horaSalidaTS = "$fechaSalida $horaSalida"; // DATETIME válido

    // ---------- INSERT ----------
    $localizador = $this->generarLocalizador();

    $sql = "INSERT INTO transfer_reservas
        (localizador, id_hotel, id_tipo_reserva, email_cliente, fecha_reserva, fecha_modificacion,
        id_destino, fecha_entrada, hora_entrada, numero_vuelo_entrada, origen_vuelo_entrada,
        hora_vuelo_salida, num_viajeros, id_vehiculo)
        VALUES (?,?,?,?,NOW(),NOW(),?,?,?,?,?,?,?,?)";

    $params = [
        $localizador,
        (int)$idHotel,
        (int)$idTipo,
        $emailCliente,
        $idDestino,      // <--- id_destino, sin castear a int si quieres
        $fechaEntrada,
        $horaEntrada,
        $vueloEntrada,
        $origenEntrada,
        $horaSalidaTS,   // DATETIME o null
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
        $toCheck[] = new \DateTime($reserva['hora_vuelo_salida']); // timestamp completo
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
