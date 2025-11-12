<?php
namespace App\Controllers;

use App\Core\Controller;

class SiteController extends Controller { // ← CORREGIDO
    public function home() {
        $this->view('site/home');
    }

    public function how() {
    $this->view('site/how'); // carga views/how.php
    }
}
