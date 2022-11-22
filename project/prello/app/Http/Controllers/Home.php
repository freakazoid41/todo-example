<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Home extends Controller
{
    public function index()
    {
        //list all cards on here
        return view('pages.front.home', [
            'scripts' => [],
            'styles'  => [
                '/system/front/' . __FUNCTION__ . '/page.css'
            ],
            'pageScript' => '/system/front/' . __FUNCTION__ . '/page.js',
        ]);
    }
}
