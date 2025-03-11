<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteAttachment extends Model
{
    protected $fillable = [
        'note_id',
        'image',
    ];

    public $timestamps = false;

    /**
     * @return BelongsTo<Note,NoteAttachment>
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
