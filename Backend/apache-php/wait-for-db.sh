#!/bin/bash
set -e

echo "Esperando a que MySQL esté listo..."

until mysql -h db -uroot -proot --ssl=0 -e "SELECT 1"; do
  echo "Esperando a MySQL..."
  sleep 2
done

echo "MySQL listo, arrancando Apache..."
exec apache2-foreground
