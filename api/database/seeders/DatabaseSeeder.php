<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\NoteTag;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(2)->create();

        $tags = [
            'Work',
            'Personal',
            'Urgent',
            'Ideas',
            'Meeting',
            'Project',
            'Follow-up',
            'Research',
            'Learning',
            'Finance'
        ];

        foreach ($tags as $tagName) {
            Tag::query()->create(['name' => $tagName]);
        }

        $notes = [
            [
                'title' => 'Project Requirements',
                'content' => 'List of requirements for the new project...',
                'tags' => ['Work', 'Project']
            ],
            [
                'title' => 'Meeting Notes',
                'content' => 'Points discussed in today\'s meeting...',
                'tags' => ['Work', 'Meeting']
            ],
            [
                'title' => 'Ideas for Birthday Gift',
                'content' => 'Gift ideas for upcoming birthday...',
                'tags' => ['Personal']
            ],
            [
                'title' => 'Research on Laravel',
                'content' => 'Notes from research on Laravel framework...',
                'tags' => ['Learning', 'Research']
            ],
            [
                'title' => 'Monthly Budget',
                'content' => 'Budget planning for next month...',
                'tags' => ['Finance', 'Personal']
            ]
        ];

        foreach ($notes as $noteData) {
            $note = Note::query()->create([
                'title' => $noteData['title'],
                'content' => $noteData['content'],
                'user_id' => 1,
                'in_history' => false
            ]);

            foreach ($noteData['tags'] as $tagName) {
                $tag = Tag::query()->where('name', $tagName)->first();
                if ($tag) {
                    NoteTag::query()->create([
                        'note_id' => $note->id,
                        'tag_id' => $tag->id
                    ]);
                }
            }
        }
    }
}
