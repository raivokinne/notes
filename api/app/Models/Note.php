<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Note extends Model
{
    /** @use HasFactory<\Database\Factories\NoteFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'content', 
        'user_id',
        'is_archived',
    ];

    /**
     * @return BelongsTo<User,Note>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Tag>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'note_tags', 'note_id', 'tag_id')
                    ->withTimestamps();
    }

    /**
     * @return BelongsToMany<User>
     */
    public function sharedWith(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'shared_notes', 'note_id', 'shared_with_user_id')
                    ->withTimestamps();
    }

    /**
     * @return HasMany<NoteAttachment>
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(NoteAttachment::class);
    }
}