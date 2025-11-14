<?php
namespace App\Helpers;
use App\Core\DB;

trait Helpers {
  protected function generarLocalizador(): string {
    do {
      $loc = 'TRF-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(3)));
      $st = DB::pdo()->prepare("SELECT 1 FROM transfer_reservas WHERE localizador=?");
      $st->execute([$loc]);
      $exists = (bool)$st->fetchColumn();
    } while ($exists);
    return $loc;
  }
}