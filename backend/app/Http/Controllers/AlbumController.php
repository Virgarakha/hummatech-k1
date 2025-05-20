<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlbumController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->id;
        $albums = Album::where('user_id', $userId)->get();
        return response()->json($albums);
    }
    
    public function store(Request $request)
    {
        $userId = auth()->user()->id;
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $album = Album::create([
            'title' => $validated['title'],
            'user_id' => $userId,
        ]);

        return response()->json($album, 201);
    }

    public function show($id)
    {
        $album = Album::with('photos')->findOrFail($id);
        
        if ($album->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json($album);
    }

    public function favorites()
{
    $user = Auth::user();
    $favoritedPhotos = $user->favorites()
        ->with(['isFavorited' => function ($query) {
            $query->where('user_id', Auth::id());
        }])
        ->get()
        ->map(function ($photo) {
            $photo->is_favorited = true; 
            return $photo;
        });

    return response()->json([
        'id' => 'favorites',
        'title' => 'Favorite Album',
        'user_id' => $user->id,
        'photos' => $favoritedPhotos,
    ]);
}
}