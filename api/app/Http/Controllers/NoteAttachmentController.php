<?php

namespace App\Http\Controllers;

use App\Models\NoteAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteAttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $note_attachments = NoteAttachment::all();

        return response()->json([
            'succes' => true,
            'message' => 'List of Note attachments',
            'noteAttachments' => $note_attachments,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $imageName = time().'.'.$request->image->extension();  
         
        $request->image->move(public_path('images'), $imageName);

        $note_attachment = NoteAttachment::query()->create([
            'image' => $imageName,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note attachment created successfully',
            'noteAttachment' => $note_attachment
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $note_attachment = NoteAttachment::query()->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Your note attachment',
            'noteAttachment' => $note_attachment
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $imageName = time().'.'.$request->image->extension();  
         
        $request->image->move(public_path('images'), $imageName);

        $note_attachment = NoteAttachment::query()->where('id', $id)->update([
            'image' => $imageName,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note attachment updated successfully',
            'noteAttachment' => $note_attachment
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $note_attachment = NoteAttachment::query()->find($id);

        $note_attachment->delete();

        return response()->json([ 
            'success' => true,
            'message' => 'Note attachment deleted successfully',
        ], 200);
    }
}
