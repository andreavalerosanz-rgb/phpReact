<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\Reservation;

class CalendarControllers extends Controller {

    public function show() {
        // Devolver reservas en JSON para calendario
        $reservation = new Reservation($this->db);
        $data = $reservation->all();
        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
