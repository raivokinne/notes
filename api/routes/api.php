<?php

use App\Http\Controllers\NoteAttachmentController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\SharedNoteController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/v1')->group(function () {
    Route::prefix('/guest')->group(function () {
        Route::post('/login', [UserController::class, 'login'])->name('login');
        Route::post('/register', [UserController::class, 'register'])->name('register');
    });
    Route::prefix('/auth')->middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [UserController::class, 'logout'])->name('logout');

        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::apiResource('notes', NoteController::class);
        Route::apiResource('tags', TagController::class);
        Route::apiResource('shared-notes', SharedNoteController::class);
        Route::apiResource('note-attachments', NoteAttachmentController::class);
    });
});

