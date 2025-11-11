<h2>Calendario de Reservas</h2>

<p>Aquí podrás visualizar las fechas de tus reservas.</p>

<table border="1" cellpadding="6">
    <thead>
        <tr>
            <th>Fecha</th>
            <th>Hotel</th>
            <th>Pasajeros</th>
            <th>Tipo</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($reservations)): ?>
            <?php foreach ($reservations as $r): ?>
                <tr>
                    <td><?= htmlspecialchars($r['fecha_entrada'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['id_hotel'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['num_viajeros'] ?? '-') ?></td>
                    <td><?= htmlspecialchars($r['id_tipo_reserva'] ?? '-') ?></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr><td colspan="4">No hay reservas registradas.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
