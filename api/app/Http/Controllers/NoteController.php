<?php
namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Note;
use App\Models\NoteTag;
use App\Models\Tag;
use Carbon\Carbon;
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
        $notes = Note::query()->where('user_id', Auth::id())->with(['tags', 'user', 'sharedWith', 'attachments'])->get();

        return response()->json([
            'success' => true,
            'message' => 'List of notes',
            'notes'   => $notes,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validate->fails()) {
            $this->incorrectRequest($validate->errors());
        }

        $note = Note::query()->create([
            'title'       => request('title'),
            'content'     => "",
            'user_id'     => Auth::id(),
            'has_history' => false,
            'expires' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note created successfully',
            'note'    => $note,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $note = Note::query()->where('id', $id)->with(['tags', 'user', 'sharedWith', 'attachments'])->first();

        return response()->json([
            'success' => true,
            'message' => 'Your note',
            'note'    => $note,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'tags'    => 'array',
        ]);

        if ($validate->fails()) {
            return $this->incorrectRequest($validate->errors());
        }

        $note = Note::query()->where('id', $id)->first();

        if (! $note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found',
            ], 404);
        }

        $note->update([
            'title'       => $request->input('title'),
            'content'     => $request->input('content'),
            'is_archived' => $request->input('is_archived', false),
            'user_id'     => Auth::id(),
        ]);

        NoteTag::query()->where('note_id', $note->id)->delete();

        $requestTags = $request->input('tags', []);

        if (! empty($requestTags)) {
            foreach ($requestTags as $requestTag) {
                $tagId   = isset($requestTag['id']) ? $requestTag['id'] : null;
                $tagName = isset($requestTag['name']) ? $requestTag['name'] : $requestTag;

                if ($tagId) {
                    $tag = Tag::query()->find($tagId);
                } else {
                    $tag = Tag::query()->where('name', $tagName)->first();
                }

                if (! $tag) {
                    $tag = Tag::query()->create([
                        'name' => $tagName,
                    ]);
                }

                NoteTag::query()->create([
                    'note_id' => $note->id,
                    'tag_id'  => $tag->id,
                ]);
            }
        }

        $note = Note::with(['tags', 'user', 'sharedWith', 'attachments'])->find($note->id);

        return response()->json([
            'success' => true,
            'message' => 'Note updated successfully',
            'note'    => $note,
        ], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $note = Note::query()->find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found',
            ], 404);
        }

        $note->update([
            'title'       => $note->title,
            'content'     => $note->content,
            'user_id'     => $note->user()->id,
            'has_history' => true,
            'expires' => Carbon::now()->addDays(30),
        ]);

        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note deleted successfully',
        ], 200);
    }

}
