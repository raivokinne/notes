<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * @return BelongsToMany<Note,Tag>
     */
    public function notes(): BelongsToMany
    {
        return $this->belongsToMany(Note::class, 'note_tags', 'tag_id', 'note_id');
    }
}
