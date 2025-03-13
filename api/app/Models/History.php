<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class History extends Model
{
    protected $fillable = [
        'user_id',
        'note_id',
        'expires',
    ];
    /**
     * @return BelongsTo<Note,History>
     */
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
    /**
     * @return BelongsTo<User,History>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
