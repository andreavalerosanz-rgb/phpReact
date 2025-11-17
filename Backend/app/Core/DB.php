<?php
namespace App\Core;

class DB {
  private static ?\PDO $pdo = null;

  public static function pdo(): \PDO {
    if (!self::$pdo) {
      $c = require __DIR__.'/../../config/config.php';
      $dsn = "mysql:host={$c['db']['host']};port={$c['db']['port']};dbname={$c['db']['name']};charset={$c['db']['charset']}";
      self::$pdo = new \PDO($dsn, $c['db']['user'], $c['db']['pass'], [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
      ]);
    }
    return self::$pdo;
  }
}
