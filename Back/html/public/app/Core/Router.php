<?php
namespace App\Core;

class Router {
    private $routes = [];

    public function get($path, $callback) {
        $this->routes['GET'][$path] = $callback;
    }

    public function post($path, $callback) {
        $this->routes['POST'][$path] = $callback;
    }

    public function dispatch($db = null, $config = null) {
      $uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
      $method = $_SERVER['REQUEST_METHOD'];

      if ($uri === '') {
          $uri = '/';
      }

      $callback = $this->routes[$method][$uri] ?? null;

      if (!$callback) {
        http_response_code(404);
        echo "404 Página no encontrada";
        return;
      }

      if (is_callable($callback)) {
        call_user_func($callback);
      } elseif (is_array($callback)) {
        [$class, $method] = $callback;
        $obj = new $class($db, $config); // <-- PASAMOS $db y $config
        $obj->$method();
      }
    }
}