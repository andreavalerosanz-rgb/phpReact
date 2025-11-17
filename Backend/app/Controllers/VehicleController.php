<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Core\DB;

class VehicleController extends Controller {

    // Listar todos los vehículos
    public function index() {
        $st = DB::pdo()->query("SELECT * FROM transfer_vehiculos ORDER BY id_vehiculo ASC");
        $this->json($st->fetchAll());
    }

    // Mostrar un vehículo por ID
    public function show($id) {
        $st = DB::pdo()->prepare("SELECT * FROM transfer_vehiculos WHERE id_vehiculo=?");
        $st->execute([(int)$id]);
        $vehicle = $st->fetch();
        $vehicle ? $this->json($vehicle) : $this->json(['error'=>'Not found'],404);
    }

    // Crear un nuevo vehículo
    public function store() {
        $in = $this->body();

        $descripcion = trim($in['descripcion'] ?? '');
        $email       = trim($in['email_conductor'] ?? '');
        $password    = trim($in['password'] ?? '');

        $errors = [];

        // Validaciones
        if (!$descripcion) $errors['descripcion'] = 'descripcion es requerida';
        if (!$email) $errors['email_conductor'] = 'email_conductor es requerido';
        elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email_conductor'] = 'email_conductor no es válido';
        if (!$password) $errors['password'] = 'password es requerido';

        if ($errors) {
            $this->json(['error'=>'VALIDATION_ERROR','details'=>$errors], 400);
            return;
        }

        $st = DB::pdo()->prepare("INSERT INTO transfer_vehiculos (Descripción,email_conductor,password) VALUES (?,?,?)");
        $st->execute([$descripcion, $email, $password]);

        $this->json([
            'id' => (int)DB::pdo()->lastInsertId(),
            'descripcion' => $descripcion,
            'email_conductor' => $email
        ], 201);
    }

    // Actualizar vehículo
    public function update($id) {
        $in = $this->body();

        $allowed = ['descripcion','email_conductor','password'];
        $set = [];
        $params = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $in)) {
                $set[] = ($field === 'descripcion' ? 'Descripción' : $field) . ' = ?';
                $params[] = $in[$field];
            }
        }

        if (!$set) {
            $this->json(['error'=>'Nada que actualizar'], 400);
            return;
        }

        $sql = "UPDATE transfer_vehiculos SET ".implode(', ', $set)." WHERE id_vehiculo = ?";
        $params[] = (int)$id;

        $st = DB::pdo()->prepare($sql);
        $st->execute($params);

        $this->json(['ok'=>true]);
    }

    // Eliminar vehículo
    public function destroy($id) {
        $st = DB::pdo()->prepare("DELETE FROM transfer_vehiculos WHERE id_vehiculo=?");
        $st->execute([(int)$id]);
        $this->json(['deleted'=>(int)$id]);
    }
}
