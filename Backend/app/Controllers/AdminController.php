<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AdminController extends Controller {
  public function dashboard(){
    $r = [];
    $r['reservas']   = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_reservas")->fetchColumn();
    $r['viajeros']   = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_viajeros")->fetchColumn();
    $r['hoteles']    = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_hoteles")->fetchColumn();
    $r['vehiculos']  = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_vehiculos")->fetchColumn();
    $this->json($r);
  }
}
