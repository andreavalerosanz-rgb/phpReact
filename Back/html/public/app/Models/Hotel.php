<?php
namespace App\Models;

use App\Core\Model;

class Hotel extends Model {

    protected $table = 'tranfer_hotel';

    public function all() {
        return $this->fetchAll("SELECT * FROM {$this->table}");
    }

    public function find($id) {
        return $this->fetchOne("SELECT * FROM {$this->table} WHERE id_hotel = ?", [$id]);
    }
}
