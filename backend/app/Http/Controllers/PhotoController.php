<?php
namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Favorite;
use App\Models\Trash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function store(Request $request)
    {
        $userId = auth()->user()->id;

        $validated = $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'album_id' => 'required|exists:albums,id',
            'date' => 'required|date',
        ]);

        $path = $request->file('photo')->store('photos', 'public');
        
        $photo = Photo::create([
            'photo' => $path,
            'album_id' => $validated['album_id'],
            'user_id' => $userId,
            'date' => $validated['date'],
        ]);

        return response()->json($photo, 201);
    }

    public function favorite(Request $request, $photoId)
    {
        $photo = Photo::findOrFail($photoId);
        
        if ($photo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $favorite = Favorite::firstOrCreate([
            'user_id' => Auth::id(),
            'photo_id' => $photoId,
        ]);

        return response()->json($favorite, 201);
    }

    public function moveToTrash(Request $request, $photoId)
    {
        $photo = Photo::findOrFail($photoId);
        
        if ($photo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $trash = Trash::create(['photo_id' => $photoId]);
        return response()->json($trash, 201);
    }

    public function deleteFromTrash($photoId)
    {
        $trash = Trash::where('photo_id', $photoId)->firstOrFail();
        $photo = Photo::findOrFail($photoId);

        if ($photo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($photo->photo);
        $photo->delete();
        $trash->delete();

        return response()->json(['message' => 'Photo deleted permanently']);
    }

    public function getTrashed(Request $request)
{
    $trashedPhotos = Photo::whereHas('isTrashed')
        ->where('user_id', Auth::id())
        ->with(['isFavorited' => function ($query) {
            $query->where('user_id', Auth::id());
        }])
        ->get()
        ->map(function ($photo) {
            $photo->is_favorited = $photo->isFavorited->isNotEmpty();
            return $photo;
        });

    return response()->json($trashedPhotos);
}
}