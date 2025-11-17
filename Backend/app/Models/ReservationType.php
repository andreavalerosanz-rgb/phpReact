<?php
namespace App\Models;
use App\Core\DB;

class ReservationType {
  private string $table='transfer_tipo_reservas';
  private string $pk='id_tipo';

  public function all(): array {
    return DB::pdo()->query("SELECT * FROM {$this->table} ORDER BY id_tipo")->fetchAll();
  }
}
