<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tags = Tag::query()->with('notes')->get();

        return response()->json([
            'success' => true,
            'message' => 'List of tags',
            'tags' => $tags
        ], 200);
    }
}
