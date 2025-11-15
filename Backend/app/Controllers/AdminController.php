<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class AdminController extends Controller {

    // ------------------ DASHBOARD ------------------
    public function dashboard(){
        $r = [];
        $r['reservas']   = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_reservas")->fetchColumn();
        $r['viajeros']   = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_viajeros")->fetchColumn();
        $r['hoteles']    = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_hoteles")->fetchColumn();
        $r['vehiculos']  = (int)DB::pdo()->query("SELECT COUNT(*) FROM transfer_vehiculos")->fetchColumn();
        $this->json($r);
    }

    // ------------------ LISTAR USUARIOS ------------------
    public function listUsers(){
        $stmt = DB::pdo()->query("
            SELECT 
                id_viajero AS id_usuario,
                nombre,
                apellido1,
                apellido2,
                direccion,
                codigoPostal,
                ciudad,
                pais,
                email_viajero AS email,
                'user' AS role
            FROM transfer_viajeros
        ");
        $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $this->json($users);
    }

    // ------------------ USUARIO POR ID ------------------
    public function getUserById($id){
        $stmt = DB::pdo()->prepare("
            SELECT 
                id_viajero AS id_usuario,
                nombre,
                apellido1,
                apellido2,
                direccion,
                codigoPostal,
                ciudad,
                pais,
                email_viajero AS email,
                'user' AS role
            FROM transfer_viajeros
            WHERE id_viajero = ?
        ");
        $stmt->execute([(int)$id]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        if(!$user){
            $this->json(['error'=>'Not found'],404);
            return;
        }
        $this->json($user);
    }

}