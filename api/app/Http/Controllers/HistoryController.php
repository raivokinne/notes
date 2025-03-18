<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\JsonResponse;

class HistoryController extends Controller
{
    public function index(): JsonResponse
    {
        $notes = History::query()->with(['user', 'note', 'note.tags'])->get();

        return response()->json([
            'success' => true,
            'message' => 'List of history notes',
            'notes' => $notes
        ], 200);
    }
}
