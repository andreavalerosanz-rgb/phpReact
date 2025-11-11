<?php
namespace App\Core;

class View {
  public static function render(string $view, array $data = []) {
    extract($data);
    $viewFile = __DIR__ . '/../../views/' . $view . '.php';
    if (!file_exists($viewFile)) { http_response_code(404); echo "View not found: $view"; return; }
    include __DIR__ . '/../../views/layouts/header.php';
    include $viewFile;
    include __DIR__ . '/../../views/layouts/footer.php';
  }
  public static function renderRaw(string $view, array $data = []) {
    extract($data);
    $viewFile = __DIR__ . '/../../views/' . $view . '.php';
    if (!file_exists($viewFile)) { http_response_code(404); echo "View not found: $view"; return; }
    include $viewFile;
  }
}