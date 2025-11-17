<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class ZoneController extends Controller {

    // GET /api/zonas
    public function index() {
        $st = DB::pdo()->query("SELECT * FROM transfer_zonas ORDER BY id_zona ASC");
        $this->json($st->fetchAll());
    }

    // POST /api/zonas
    public function store() {
        $in = $this->body();
        $role = strtolower($in['role'] ?? 'user');

        if ($role !== 'admin') {
            $this->json(['error'=>'FORBIDDEN', 'message'=>'Solo admin puede crear zonas'], 403);
            return;
        }

        $descripcion = trim($in['descripcion'] ?? '');
        if (!$descripcion) {
            $this->json(['error'=>'VALIDATION_ERROR','message'=>'descripcion es requerida'], 400);
            return;
        }

        $st = DB::pdo()->prepare("INSERT INTO transfer_zonas (descripcion) VALUES (?)");
        $st->execute([$descripcion]);

        $this->json([
            'id_zona' => (int)DB::pdo()->lastInsertId(),
            'descripcion' => $descripcion
        ], 201);
    }

    // DELETE /api/zonas/{id}
    public function destroy($id) {
        // Solo admin puede eliminar
        $role = strtolower($this->query('role', 'user')); // prueba fácil desde Postman
        if ($role !== 'admin') {
            $this->json(['error'=>'FORBIDDEN', 'message'=>'Solo admin puede eliminar zonas'], 403);
            return;
        }

        $st = DB::pdo()->prepare("DELETE FROM transfer_zonas WHERE id_zona=?");
        $st->execute([(int)$id]);

        $this->json(['deleted' => (int)$id]);
    }
}
