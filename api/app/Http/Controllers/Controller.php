<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function incorrectRequest(mixed $errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Incorrect request',
            'errors' => $errors
        ], 400);
    }
}
