<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $notes = Note::all();

        return response()->json([
            'success' => true,
            'message' => 'List of notes',
            'notes' => $notes
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $note = Note::query()->create([
            'title' => request('title'),
            'content' => request('content'),
            'is_archived' => false,
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note created successfully',
            'note' => $note
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $note = Note::query()->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Your note',
            'note' => $note
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $note = Note::query()->where('id', $id)->first();

        $note->update([
            'title' => request('title'),
            'content' => request('content'),
            'is_archived' => false,
            'user_id' => Auth::id(),
        ]);

        $note->save();

        return response()->json([
            'success' => true,
            'message' => 'Note updated successfully',
            'note' => $note
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $note = Note::query()->find($id);

        $note->delete();

        return response()->json([ 
            'success' => true,
            'message' => 'Note deleted successfully',
        ], 200);
    }
}
