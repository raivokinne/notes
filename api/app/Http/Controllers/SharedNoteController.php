<?php

namespace App\Http\Controllers;

use App\Models\SharedNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SharedNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $shared_notes = SharedNote::all();

        return response()->json([
            'success' => true,
            'message' => 'List of shared notes',
            'sharedNotes' => $shared_notes
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'note_id' => 'required',
            'shared_with_user_id' => 'required',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $shared_note = SharedNote::query()->create([
            'note_id' => request('note_id'),
            'shared_with_user_id' => request('shared_with_user_id'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shared note created successfully',
            'sharedNote' => $shared_note
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $shared_note = SharedNote::query()->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Your shared note',
            'sharedNote' => $shared_note
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'note_id' => 'required',    
            'shared_with_user_id' => 'required',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $shared_note = SharedNote::query()->where('id', $id)->update([
            'note_id' => request('note_id'),
            'shared_with_user_id' => request('shared_with_user_id'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shared note updated successfully',
            'sharedNote' => $shared_note
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $shared_note = SharedNote::query()->find($id);

        $shared_note->delete();

        return response()->json([ 
            'success' => true,
            'message' => 'Shared note deleted successfully',
        ], 200);
    }
}
