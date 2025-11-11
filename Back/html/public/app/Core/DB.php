<?php
namespace App\Core;

use PDO;
use PDOException;

//Clase DB: gestiona la conexión a la base de datos mediante PDO (patrón Singleton)
class DB
{
    private static ?DB $instance = null;
    private PDO $pdo;

    //Constructor privado — evita crear múltiples conexiones
   private function __construct(array $config)
{
    try {
        $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['name']};charset={$config['charset']}";

        // Opciones PDO, definidas correctamente
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        $this->pdo = new \PDO($dsn, $config['user'], $config['pass'], $options);

    } catch (\PDOException $e) {
        die("Error al conectar con la base de datos: " . $e->getMessage());
    }
}   

    /**
     * Devuelve la instancia única del objeto DB
     */
    public static function getInstance(array $config): DB
    {
        if (self::$instance === null) {
            self::$instance = new self($config);
        }
        return self::$instance;
    }

    /**
     * Devuelve el objeto PDO
     */
    public function pdo(): PDO
    {
        return $this->pdo;
    }
}