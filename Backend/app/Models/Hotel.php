<?php
namespace App\Models;
use App\Core\DB;

class Hotel {
  private string $table='transfer_hoteles';
  private string $pk='id_hotel';

  public function all(): array {
    return DB::pdo()->query("SELECT * FROM {$this->table} ORDER BY nombre")->fetchAll();
  }
}
