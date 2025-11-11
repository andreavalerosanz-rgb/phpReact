<?php
namespace App\Models;

use App\Core\Model;

class Reservation extends Model {

    protected $table = 'transfer_reservas';

    public function all() {
        return $this->fetchAll("SELECT * FROM {$this->table}");
    }

    public function find($id) {
        return $this->fetchOne("SELECT * FROM {$this->table} WHERE id_reserva = ?", [$id]);
    }

    public function create($data) {
        $this->query("INSERT INTO {$this->table}
            (localizador, id_hotel, id_tipo_reserva, email_cliente, fecha_reserva, fecha_modificacion,
             id_destino, fecha_entrada, hora_entrada, numero_vuelo_entrada, origen_vuelo_entrada,
             fecha_vuelo_salida, hora_vuelo_salida, num_viajeros, id_vehiculo)
            VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['localizador'], $data['id_hotel'], $data['id_tipo_reserva'], $data['email_cliente'],
                $data['id_destino'], $data['fecha_entrada'], $data['hora_entrada'], $data['numero_vuelo_entrada'],
                $data['origen_vuelo_entrada'], $data['fecha_vuelo_salida'], $data['hora_vuelo_salida'],
                $data['num_viajeros'], $data['id_vehiculo']
            ]
        );
        return $this->db->lastInsertId();
    }
}
