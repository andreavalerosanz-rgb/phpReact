<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class PriceController extends Controller {
    public function index() {
        $st = DB::pdo()->query("SELECT * FROM transfer_precios");
        $this->json($st->fetchAll());
    }

    public function show($id_hotel, $id_vehiculo) {
        $st = DB::pdo()->prepare("SELECT * FROM transfer_precios WHERE id_hotel=? AND id_vehiculo=?");
        $st->execute([(int)$id_hotel,(int)$id_vehiculo]);
        $price = $st->fetch();
        $price ? $this->json($price) : $this->json(['error'=>'Not found'],404);
    }
}
