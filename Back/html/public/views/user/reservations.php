<h2>Listado de Reservas</h2>

<?php if (empty($reservations)): ?>
    <p>No se han encontrado reservas.</p>
<?php else: ?>
    <table border="1" cellpadding="6">
        <thead>
            <tr>
                <th>ID</th>
                <th>Localizador</th>
                <th>Usuario</th>
                <th>Hotel</th>
                <th>Fecha entrada</th>
                <th>Pasajeros</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($reservations as $r): ?>
                <tr>
                    <td><?= htmlspecialchars($r['id_reserva'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['localizador'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['id_hotel'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['fecha_entrada'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['num_viajeros'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['status'] ?? 'Pendiente') ?></td>
                    <td>
                        <a href="/reservas/ver?id=<?= urlencode($r['id_reserva'] ?? 0) ?>">Ver</a> |
                        <a href="/reservas/eliminar?id=<?= urlencode($r['id_reserva'] ?? 0) ?>" onclick="return confirm('¿Seguro que deseas eliminar esta reserva?')">Eliminar</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>
