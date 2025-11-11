<?php
namespace App\Models;

use App\Core\Model;

class User extends Model {

    protected $table = 'transfer_viajeros';

    public function findByEmail($email) {
        return $this->fetchOne("SELECT * FROM {$this->table} WHERE email = ?", [$email]);
    }

    public function create($data) {
        $this->query("INSERT INTO {$this->table} 
            (nombre, apellido1, apellido2, direccion, codigoPostal, ciudad, pais, email, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            $data['nombre'], $data['apellido1'], $data['apellido2'], $data['direccion'],
            $data['codigoPostal'], $data['ciudad'], $data['pais'], $data['email'], password_hash($data['password'], PASSWORD_DEFAULT)
        ]);
        return $this->db->lastInsertId();
    }
}
