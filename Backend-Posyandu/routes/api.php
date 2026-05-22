<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users', [AuthController::class, 'users'])->middleware('admin');
    Route::post('/logout', [AuthController::class, 'logout']);
});

use App\Http\Controllers\BalitaController;
use App\Http\Controllers\IbuHamilController;
use App\Http\Controllers\PemeriksaanBalitaController;
use App\Http\Controllers\PemeriksaanIbuHamilController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\RencanaMakanController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('balitas', BalitaController::class)->only(['index', 'show']);
    Route::apiResource('ibu-hamils', IbuHamilController::class)->only(['index', 'show']);
    Route::apiResource('pemeriksaan-balitas', PemeriksaanBalitaController::class)->only(['index', 'show']);
    Route::apiResource('pemeriksaan-ibu-hamils', PemeriksaanIbuHamilController::class)->only(['index', 'show']);
    Route::apiResource('jadwals', JadwalController::class)->only(['index', 'show']);
    Route::apiResource('rencana-makans', RencanaMakanController::class)->only(['index', 'show']);

    Route::middleware('admin')->group(function () {
        Route::apiResource('balitas', BalitaController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('ibu-hamils', IbuHamilController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('pemeriksaan-balitas', PemeriksaanBalitaController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('pemeriksaan-ibu-hamils', PemeriksaanIbuHamilController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('jadwals', JadwalController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('rencana-makans', RencanaMakanController::class)->only(['store', 'update', 'destroy']);
    });
});
