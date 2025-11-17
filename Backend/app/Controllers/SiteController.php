<?php
namespace App\Controllers;
use App\Core\Controller;

class SiteController extends Controller {
  public function home(){ $this->json(['app'=>'Isla Transfers API','status'=>'ok']); }
}
