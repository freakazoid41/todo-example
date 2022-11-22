<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\System;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

//Route::any('request/{model}/{id?}',[System::class, 'index'])->middleware('auth:sanctum');
Route::any('request/{model}/{id?}',[System::class, 'index'])->middleware('auth:sanctum');
Route::post('query/{model}',[System::class, 'query']);

Route::post('auth/register',[AuthController::class,'createUser']);
Route::post('auth/login',[AuthController::class,'loginUser']);