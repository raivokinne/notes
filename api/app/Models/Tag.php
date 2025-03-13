<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
    ];

    /**
     * @return BelongsToMany<Note>
     */
    public function notes(): BelongsToMany
    {
        return $this->belongsToMany(Note::class, 'note_tags', 'tag_id', 'note_id')
                    ->withTimestamps();
    }
}