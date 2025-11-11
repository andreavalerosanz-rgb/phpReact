<?php
namespace App\Models;

use App\Core\Model;

class Zone extends Model {

    protected $table = 'transfer_zona';

    public function all() {
        return $this->fetchAll("SELECT * FROM {$this->table}");
    }

    public function find($id) {
        return $this->fetchOne("SELECT * FROM {$this->table} WHERE id_zona = ?", [$id]);
    }
}
