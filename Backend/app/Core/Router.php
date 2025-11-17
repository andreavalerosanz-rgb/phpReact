<?php
namespace App\Core;

class Router {
  private array $routes = [
    'GET' => [], 'POST' => [], 'PUT' => [], 'DELETE' => [],
  ];

  // Registro de rutas
  public function get(string $path, string $handler){   $this->routes['GET'][$this->norm($path)]     = $handler; }
  public function post(string $path, string $handler){  $this->routes['POST'][$this->norm($path)]    = $handler; }
  public function put(string $path, string $handler){   $this->routes['PUT'][$this->norm($path)]     = $handler; }
  public function delete(string $path, string $handler){$this->routes['DELETE'][$this->norm($path)]  = $handler; }

  // Normaliza path (sin trailing slash salvo '/')
  private function norm(string $p): string {
    if ($p !== '/' && str_ends_with($p, '/')) $p = rtrim($p, '/');
    return $p;
  }

  // Convierte patrón '/api/reservas/{id}' a regex y extrae params
  private function match(string $pattern, string $path, array &$params): bool {
    $pattern = $this->norm($pattern);
    $path    = $this->norm($path);

    $re = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $pattern);
    $re = '#^' . $re . '$#';

    if (preg_match($re, $path, $m)) {
      foreach ($m as $k => $v) {
        if (!is_int($k)) $params[$k] = $v;
      }
      return true;
    }
    return false;
  }

  // Permite override del método vía header o _method (útil si algún proxy bloquea PUT/DELETE)
  private function detectMethod(string $fallback): string {
    if (!empty($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
      return strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
    }
    if (isset($_POST['_method'])) {
      return strtoupper((string)$_POST['_method']);
    }
    return strtoupper($fallback);
  }

  public function dispatch(string $uri, string $method): void {
    $method = $this->detectMethod($method);

    // Limpia querystring
    $path = parse_url($uri, PHP_URL_PATH) ?? '/';
    $path = $this->norm($path);

    // Busca coincidencia
    foreach ($this->routes[$method] ?? [] as $pattern => $handler) {
      $params = [];
      if ($this->match($pattern, $path, $params)) {
        [$class, $action] = explode('@', $handler, 2);
        $fqcn = 'App\\Controllers\\' . $class;
        $ctrl = new $fqcn;

        // Pasa params por orden (p.ej. {id})
        $args = array_values($params);
        $ctrl->$action(...$args);
        return;
      }
    }

    // 404 si no encontró
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found', 'method' => $method, 'path' => $path]);
  }
}
