<h2>Mis Reservas</h2>

<?php if (empty($reservations)): ?>
    <p>No tienes reservas registradas.</p>
<?php else: ?>
    <table border="1" cellpadding="6">
        <tr>
            <th>ID</th>
            <th>Localizador</th>
            <th>Fecha de llegada</th>
            <th>Hotel</th>
            <th>Pasajeros</th>
            <th>Estado</th>
        </tr>
        <?php foreach ($reservations as $r): ?>
            <tr>
                <td><?= htmlspecialchars($r['id_reserva'] ?? $r['id'] ?? '-') ?></td>
                <td><?= htmlspecialchars($r['localizador'] ?? '-') ?></td>
                <td><?= htmlspecialchars($r['fecha_entrada'] ?? '-') ?></td>
                <td><?= htmlspecialchars($r['id_hotel'] ?? '-') ?></td>
                <td><?= htmlspecialchars($r['num_viajeros'] ?? '-') ?></td>
                <td><?= htmlspecialchars($r['status'] ?? 'Pendiente') ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
<?php endif; ?>
