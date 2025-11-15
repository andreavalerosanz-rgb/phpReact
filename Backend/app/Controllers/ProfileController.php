<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class ProfileController extends Controller {

    // Usuario autenticado (demo: fija id=1)
    private function authUser() {
    // Demo: retorna usuario fijo id=1
    $st = DB::pdo()->prepare("SELECT id_viajero AS id, nombre, email FROM transfer_viajeros WHERE id_viajero = ?");
    $st->execute([1]); // aquí debería ir sesión o token real
    return $st->fetch();
}

    public function show() {
        $user = $this->authUser(); 
        if(!$user) $this->json(['error'=>'No autorizado'],401);
        $this->json($user);
    }

    public function update() {
        $user = $this->authUser();
        if(!$user) $this->json(['error'=>'No autorizado'],401);

        $in   = $this->body();
        $fields = ['nombre','email','password'];
        $set = [];
        $params = [];

        foreach ($fields as $f) {
            if(isset($in[$f])) {
                $set[] = "$f = ?";
                $params[] = $in[$f];
            }
        }

        if(!$set) $this->json(['error'=>'Nada que actualizar'],400);

        $params[] = $user['id'];
        $sql = "UPDATE transfer_viajeros SET ".implode(',', $set)." WHERE id_viajero=?";
        $st = DB::pdo()->prepare($sql);
        $st->execute($params);

        $this->json(['ok'=>true]);
    }
}
