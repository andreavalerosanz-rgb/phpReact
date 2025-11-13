<?php
namespace App\Models;
use App\Core\DB;

class Reservation {
  private string $table = 'transfer_reservas';
  private string $pk = 'id_reserva';

  public function all(int $limit=50): array {
    $st = DB::pdo()->prepare("SELECT * FROM {$this->table} ORDER BY {$this->pk} DESC LIMIT ?");
    $st->bindValue(1,$limit,\PDO::PARAM_INT);
    $st->execute();
    return $st->fetchAll();
  }
  public function find(int $id): ?array {
    $st = DB::pdo()->prepare("SELECT * FROM {$this->table} WHERE {$this->pk}=?");
    $st->execute([$id]);
    $r = $st->fetch();
    return $r ?: null;
  }
  public function create(array $data): int {
    $cols = array_keys($data);
    $vals = array_values($data);
    $ph   = implode(',', array_fill(0,count($cols),'?'));
    $sql  = "INSERT INTO {$this->table} (".implode(',',$cols).") VALUES ($ph)";
    DB::pdo()->prepare($sql)->execute($vals);
    return (int)DB::pdo()->lastInsertId();
  }
}
