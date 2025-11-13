<?php
namespace App\Models;
use App\Core\DB;

class Vehicle {
  private string $table='transfer_vehiculos';
  private string $pk='id_vehiculo';

  public function all(): array {
    return DB::pdo()->query("SELECT * FROM {$this->table} ORDER BY id_vehiculo")->fetchAll();
  }
}
