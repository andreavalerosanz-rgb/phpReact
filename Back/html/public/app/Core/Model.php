<?php
namespace App\Core;

class Model {
    protected $db;

    public function __construct(\PDO $db) {
        $this->db = $db;
    }

    protected function query($sql, $params = []) {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }

    protected function fetchOne($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
}

