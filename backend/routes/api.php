<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\PhotoController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('albums', AlbumController::class)->only(['index', 'store', 'show']);
    Route::get('albums/favorites', [AlbumController::class, 'favorites']); // New route for favorite album
    Route::post('photos', [PhotoController::class, 'store']);
    Route::post('photos/{photoId}/favorite', [PhotoController::class, 'favorite']);
    Route::post('photos/{photoId}/trash', [PhotoController::class, 'moveToTrash']);
    Route::delete('photos/{photoId}/trash', [PhotoController::class, 'deleteFromTrash']);
    Route::get('photos', [PhotoController::class, 'getTrashed']);
});