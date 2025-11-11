<?php
namespace App\Core;

class Controller {
    protected $db;
    protected $config;

    public function __construct($db, $config) {
        $this->db = $db;
        $this->config = $config;
    }

    protected function view($path, $data = []) {
        extract($data);
        require __DIR__ . "/../../views/$path.php";
    }
}
