<h1>Nueva reserva</h1>
<form id="reservationForm" method="post" action="/admin/reservations">
  <fieldset>
    <legend>Tipo</legend>
    <label><input type="radio" name="tripType" value="A2H" checked> Aeropuerto → Hotel</label>
    <label><input type="radio" name="tripType" value="H2A"> Hotel → Aeropuerto</label>
    <label><input type="radio" name="tripType" value="ROUND"> Ida y vuelta</label>
  </fieldset>

  <div class="block" data-block="A2H">
    <h3>Datos llegada</h3>
    <label>Día llegada <input type="date" name="fecha_entrada"></label>
    <label>Hora llegada <input type="time" name="hora_entrada"></label>
    <label>Nº vuelo <input type="text" name="numero_vuelo_entrada"></label>
    <label>Origen vuelo <input type="text" name="origen_vuelo_entrada"></label>
    <label>Hotel destino <select name="id_destino"><option value="1">Hotel Marina</option></select></label>
  </div>

  <div class="block" data-block="H2A" hidden>
    <h3>Datos salida</h3>
    <label>Fecha vuelo salida <input type="date" name="fecha_vuelo_salida"></label>
    <label>Hora vuelo salida <input type="time" name="hora_vuelo_salida"></label>
    <label>Nº vuelo <input type="text" name="numero_vuelo_salida"></label>
    <label>Hora recogida en hotel <input type="time" name="hora_recogida"></label>
    <label>Hotel recogida <select name="id_destino"><option value="1">Hotel Marina</option></select></label>
  </div>

  <div class="block" data-block="ROUND" hidden>
    <p>Rellena ambos bloques: llegada (A2H) y salida (H2A).</p>
  </div>

  <label>Nº viajeros <input type="number" name="num_viajeros" min="1" value="1"></label>
  <label>Email cliente <input type="email" name="email_cliente"></label>

  <p class="hint">⚠️ Usuarios particulares deben reservar con 48h de antelación.</p>
  <button class="btn" type="submit">Reservar</button>
</form>