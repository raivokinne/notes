<?php
namespace App\Http\Controllers;

use App\Models\NoteAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NoteAttachmentController extends Controller
{
    public function index(): JsonResponse
    {
        $note_attachments = NoteAttachment::all();
        return response()->json([
            'success'         => true,
            'message'         => 'List of Note attachments',
            'noteAttachments' => $note_attachments,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'note_id' => 'required|exists:notes,id',
            'file'    => 'required|file|max:10240',
        ]);

        if ($validate->fails()) {
            return $this->incorrectRequest($validate->errors());
        }

        $file     = $request->file('file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path     = $file->store('attachments', 'public');

        $note_attachment = NoteAttachment::query()->create([
            'note_id'   => $request->note_id,
            'filename'  => $filename,
            'path'      => str_replace(public_path(), '', $path),
            'mime_type' => $file->getClientMimeType(),
            'size'      => $file->getSize(),
        ]);

        return response()->json([
            'success'        => true,
            'message'        => 'Note attachment created successfully',
            'noteAttachment' => $note_attachment,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $note_attachment = NoteAttachment::query()->find($id);

        if (! $note_attachment) {
            return response()->json([
                'success' => false,
                'message' => 'Note attachment not found',
            ], 404);
        }

        return response()->json([
            'success'        => true,
            'message'        => 'Your note attachment',
            'noteAttachment' => $note_attachment,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $note_attachment = NoteAttachment::query()->find($id);

        if (! $note_attachment) {
            return response()->json([
                'success' => false,
                'message' => 'Note attachment not found',
            ], 404);
        }

        $validate = Validator::make($request->all(), [
            'note_id' => 'sometimes|exists:notes,id',
            'image'   => 'sometimes|image|mimes:jpg,png,jpeg,gif,svg|max:2048|dimensions:min_width=100,min_height=100,max_width=1000,max_height=1000',
        ]);

        if ($validate->fails()) {
            return $this->incorrectRequest($validate->errors());
        }

        if ($request->hasFile('image')) {
            $image    = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $path     = $image->move(public_path('images'), $filename)->getPathname();

            if (file_exists(public_path($note_attachment->path))) {
                unlink(public_path($note_attachment->path));
            }

            $note_attachment->filename  = $filename;
            $note_attachment->path      = str_replace(public_path(), '', $path);
            $note_attachment->mime_type = $image->getClientMimeType();
            $note_attachment->size      = $image->getSize();
        }

        if ($request->has('note_id')) {
            $note_attachment->note_id = $request->note_id;
        }

        $note_attachment->save();

        return response()->json([
            'success'        => true,
            'message'        => 'Note attachment updated successfully',
            'noteAttachment' => $note_attachment,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $note_attachment = NoteAttachment::query()->find($id);

        if (! $note_attachment) {
            return response()->json([
                'success' => false,
                'message' => 'Note attachment not found',
            ], 404);
        }

        if (file_exists(public_path($note_attachment->path))) {
            unlink(public_path($note_attachment->path));
        }

        $note_attachment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note attachment deleted successfully',
        ], 200);
    }
}
