<?php
namespace App\Models;
use App\Core\DB;

class Admin {
  private string $table='transfer_admin';
  private string $pk='id_admin';

  public function byEmail(string $email): ?array {
    $st = DB::pdo()->prepare("SELECT * FROM {$this->table} WHERE email_admin=? LIMIT 1");
    $st->execute([$email]);
    $r = $st->fetch();
    return $r ?: null;
  }
}
