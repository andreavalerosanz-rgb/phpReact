<?php
namespace App\Models;
use App\Core\DB;

class Traveler {
  private string $table='transfer_viajeros';
  private string $pk='id_viajero';

  public function byEmail(string $email): ?array {
    $st = DB::pdo()->prepare("SELECT * FROM {$this->table} WHERE email=? LIMIT 1");
    $st->execute([$email]);
    $r = $st->fetch();
    return $r ?: null;
  }
}
