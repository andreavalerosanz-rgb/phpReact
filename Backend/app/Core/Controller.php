<?php
namespace App\Core;

abstract class Controller {
  protected function json($data, int $status=200){ Response::json($data,$status); }
  protected function body(): array { return Request::json(); }
  protected function query(string $key, $default=null){ return $_GET[$key] ?? $default; }
}
