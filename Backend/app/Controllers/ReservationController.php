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

  public function store(){
  $in = $this->body();

  // tipo → id_tipo_reserva
  $tipoTxt = strtoupper(trim($in['tipo'] ?? '')); // IDA|VUELTA|IDA_VUELTA
  $map     = ['IDA'=>1,'VUELTA'=>2,'IDA_VUELTA'=>3];
  $idTipo  = $map[$tipoTxt] ?? null;

  $idHotel     = $in['id_hotel']     ?? null;
  $idDestino   = $in['id_destino']   ?? null; // FK a transfer_hoteles.id_hotel
  $idVehiculo  = $in['id_vehiculo']  ?? null;
  $pax         = $in['num_viajeros'] ?? null;
  $emailCliente= isset($in['email_cliente']) ? trim((string)$in['email_cliente']) : null;

  // IDA
  $fechaEntrada  = $in['fecha_entrada']        ?? null; // DATE
  $horaEntrada   = $in['hora_entrada']         ?? null; // TIME
  $vueloEntrada  = $in['numero_vuelo_entrada'] ?? null;
  $origenEntrada = $in['origen_vuelo_entrada'] ?? null;

  // VUELTA
  $fechaSalida = $in['fecha_vuelo_salida'] ?? null; // DATE
  $horaSalida  = $in['hora_vuelo_salida']  ?? null; // HH:MM:SS (BD TIMESTAMP)

  $role = strtolower($in['role'] ?? 'user');

  // ---------- VALIDACIONES ----------
  $errors = [];

  // tipo requerido
  if (!$idTipo) $errors['tipo'] = 'tipo debe ser IDA | VUELTA | IDA_VUELTA';

  // requeridos comunes
  foreach (['id_hotel','id_destino','id_vehiculo','num_viajeros'] as $fld) {
    if (!isset($in[$fld]) || !is_numeric($in[$fld])) {
      $errors[$fld] = "$fld es requerido y numérico";
    }
  }

  // email requerido + formato
  if (!$emailCliente) {
    $errors['email_cliente'] = 'email_cliente es requerido';
  } elseif (!filter_var($emailCliente, FILTER_VALIDATE_EMAIL)) {
    $errors['email_cliente'] = 'email_cliente no tiene un formato válido';
  }

  // por tipo: requeridos
  if (in_array($tipoTxt, ['IDA','IDA_VUELTA'], true)) {
    foreach (['fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada'] as $f) {
      if (empty($in[$f])) $errors[$f] = "Campo $f requerido para $tipoTxt";
    }
  }
  if (in_array($tipoTxt, ['VUELTA','IDA_VUELTA'], true)) {
    foreach (['fecha_vuelo_salida','hora_vuelo_salida'] as $f) {
      if (empty($in[$f])) $errors[$f] = "Campo $f requerido para $tipoTxt";
    }
  }

  // regla 48h (no admin)
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
      $diff  = $ahora->diff($dt);
      $hours = ($diff->days * 24) + $diff->h + ($diff->i/60);
      if ($dt <= $ahora || $hours < 48) {
        $errors['regla_48h'] = 'Reservas de usuario: mínimo 48h de antelación';
        break;
      }
    }
  }

  // Validación de FKs (400 en vez de 500)
  if (isset($idTipo)     && !$this->fkExists('transfer_tipo_reservas','id_tipo_reserva',(int)$idTipo)) $errors['id_tipo_reserva'] = 'id_tipo_reserva no existe en transfer_tipo_reservas';
  if (isset($idHotel)    && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idHotel))             $errors['id_hotel']       = 'id_hotel no existe en transfer_hoteles';
  if (isset($idDestino)  && !$this->fkExists('transfer_hoteles','id_hotel',(int)$idDestino))           $errors['id_destino']     = 'id_destino no existe en transfer_hoteles';
  if (isset($idVehiculo) && !$this->fkExists('transfer_vehiculos','id_vehiculo',(int)$idVehiculo))     $errors['id_vehiculo']    = 'id_vehiculo no existe en transfer_vehiculos';

  if ($errors) { $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors], 400); return; }

  // ---------- FALLBACKS NOT NULL (modo demo) ----------
  if ($tipoTxt === 'IDA') {
    if (!$fechaSalida) $fechaSalida = $fechaEntrada ?: date('Y-m-d');
    if (!$horaSalida)  $horaSalida  = '00:00:00';
  }
  if ($tipoTxt === 'VUELTA') {
    if (!$fechaEntrada) $fechaEntrada = $fechaSalida ?: date('Y-m-d');
    if (!$horaEntrada)  $horaEntrada  = '00:00:00';
    if (!$vueloEntrada)  $vueloEntrada  = 'N/A';
    if (!$origenEntrada) $origenEntrada = 'N/A';
  }

  // TIMESTAMP para hora_vuelo_salida (YYYY-MM-DD HH:MM:SS)
  $horaSalidaTS = ($fechaSalida && $horaSalida) ? "$fechaSalida $horaSalida" : null;

  // ---------- INSERT ----------
  $localizador = $this->generarLocalizador();

  $sql = "INSERT INTO transfer_reservas
    (localizador, id_hotel, id_tipo_reserva, email_cliente, fecha_reserva, fecha_modificacion,
     id_destino, fecha_entrada, hora_entrada, numero_vuelo_entrada, origen_vuelo_entrada,
     hora_vuelo_salida, fecha_vuelo_salida, num_viajeros, id_vehiculo)
    VALUES
    (?,?,?,?,NOW(),NOW(),?,?,?,?,?,?,?,?,?)";

  $params = [
    $localizador,
    (int)$idHotel,
    (int)$idTipo,
    $emailCliente,         // <--- ahora texto (email)
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

  $this->json([
    'id'          => (int)DB::pdo()->lastInsertId(),
    'localizador' => $localizador,
    'tipo'        => $tipoTxt
  ], 201);
}


  public function update($id){
    $in   = $this->body();
    $role = strtolower($in['role'] ?? 'user'); // demo: llega en body

    // Campos permitidos
    $allowed = [
      'id_hotel','id_destino','id_viajero','id_vehiculo','num_viajeros',
      'fecha_entrada','hora_entrada','numero_vuelo_entrada','origen_vuelo_entrada',
      'fecha_vuelo_salida','hora_vuelo_salida'
    ];

    $set = [];
    $params = [];
    foreach ($allowed as $k) {
      if (array_key_exists($k, $in)) {
        $set[] = "$k = ?";
        $params[] = $in[$k];
      }
    }
    if (!$set) { $this->json(['error'=>'Nada que actualizar'], 400); return; }

    // Validar FKs si vienen
    $errors = [];
    $mapFK = [
      'id_hotel'    => ['transfer_hoteles','id_hotel'],
      'id_destino'  => ['transfer_hoteles','id_hotel'],
      'id_viajero'  => ['transfer_viajeros','id_viajero'],
      'id_vehiculo' => ['transfer_vehiculos','id_vehiculo'],
    ];
    foreach ($mapFK as $field => [$table,$pk]) {
      if (array_key_exists($field, $in)) {
        if (!is_numeric($in[$field]) || !$this->fkExists($table,$pk,(int)$in[$field])) {
          $errors[$field] = "$field no existe en $table";
        }
      }
    }
    if ($errors) { $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors], 400); return; }

    // Regla 48h para usuario (admin puede todo)
    if ($role !== 'admin') {
      $st0 = DB::pdo()->prepare("SELECT fecha_entrada, hora_entrada, fecha_vuelo_salida, hora_vuelo_salida FROM transfer_reservas WHERE id_reserva=?");
      $st0->execute([(int)$id]);
      $cur = $st0->fetch();
      if (!$cur) { $this->json(['error'=>'Not found'],404); return; }

      $fEnt = $in['fecha_entrada']       ?? $cur['fecha_entrada'];
      $hEnt = $in['hora_entrada']        ?? $cur['hora_entrada'];
      $fSal = $in['fecha_vuelo_salida']  ?? $cur['fecha_vuelo_salida'];
      $hSal = $in['hora_vuelo_salida']   ?? (is_string($cur['hora_vuelo_salida']) ? substr($cur['hora_vuelo_salida'],11,8) : null);

      $ahora = new \DateTime('now');
      $toCheck = [];
      if ($fEnt && $hEnt) $toCheck[] = new \DateTime("$fEnt $hEnt");
      if ($fSal && $hSal) $toCheck[] = new \DateTime("$fSal $hSal");

      foreach ($toCheck as $dt) {
        $diff = $ahora->diff($dt);
        $hours = ($diff->days * 24) + $diff->h + ($diff->i/60);
        if ($dt <= $ahora || $hours < 48) {
          $this->json(['error'=>'REGRA_48H','message'=>'Usuarios no pueden modificar dentro de 48h'], 400);
          return;
        }
      }
    }

    // fecha_modificacion auto
    $set[] = "fecha_modificacion = NOW()";
    $sql = "UPDATE transfer_reservas SET ".implode(', ', $set)." WHERE id_reserva = ?";
    $params[] = (int)$id;

    $st = DB::pdo()->prepare($sql);
    $st->execute($params);

    $this->json(['ok'=>true]);
  }

  public function destroy($id){
    // Cancelación simple: borrado físico (válido para Producto 2)
    $st = DB::pdo()->prepare("DELETE FROM transfer_reservas WHERE id_reserva=?");
    $st->execute([(int)$id]);
    $this->json(['deleted'=> (int)$id]);
  }
}