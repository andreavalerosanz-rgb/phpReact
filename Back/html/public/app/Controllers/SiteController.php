<?php
namespace App\Controllers;

use App\Core\Controller;

class SiteControlers extends Controller {

    public function home() {
        $this->view('site/home');
    }

    public function features() {
        $this->view('site/how');
    }
}
