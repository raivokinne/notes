<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedNote extends Model
{
    protected $fillable = [
        'note_id',
        'shared_with_user_id',
    ];

    /**
     * @return BelongsTo<Note,SharedNote>
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * @return BelongsTo<User,SharedNote>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
