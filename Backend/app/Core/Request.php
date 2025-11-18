<?php
namespace App\Core;

class Request {
  public static function json(): array {

    // Leer el cuerpo bruto
    $raw = file_get_contents('php://input');

    // Si vienen datos como JSON → parsearlos
    if ($raw) {
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            return $json;
        }
    }

    // Si no había JSON → usar los datos de FORM-DATA (POST)
    if (!empty($_POST)) {
        return $_POST;
    }

    return [];
  }
}
