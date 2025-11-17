<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\DB;

class TestController extends Controller {
  public function db(){
    try { DB::pdo()->query('SELECT 1'); $this->json(['db'=>true]); }
    catch(\Throwable $e){ $this->json(['db'=>false,'msg'=>$e->getMessage()],500); }
  }
}
