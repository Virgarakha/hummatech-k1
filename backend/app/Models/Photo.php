<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['photo', 'album_id', 'user_id', 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function isFavorited()
    {
        return $this->belongsToMany(User::class, 'favorites', 'photo_id', 'user_id');
    }

    public function isTrashed()
    {
        return $this->hasOne(Trash::class);
    }
}