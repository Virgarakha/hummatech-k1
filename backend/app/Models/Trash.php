<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trash extends Model
{
    protected $fillable = ['photo_id'];
    protected $table = 'trashes';
}