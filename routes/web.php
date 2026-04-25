<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FieldOfWorkController;
use App\Http\Controllers\ResumeAnalysisController;
use App\Http\Controllers\LinkedInAuthController;
use App\Models\FieldOfWork;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $fields = FieldOfWork::orderBy('category')->orderBy('name')->get();
    return view('upload', compact('fields'));
})->name('home');

Route::post('/analyze', [ResumeAnalysisController::class, 'analyze'])->name('resume.analyze');
Route::post('/api/resume/improve', [ResumeAnalysisController::class, 'improveSection']);

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/api/user/tier', function (\Illuminate\Http\Request $request) {
        $request->validate(['tier' => 'required|string|in:none,starter,pro,elite']);
        $request->user()->update(['tier' => $request->tier]);
        return response()->json(['status' => 'success', 'tier' => $request->tier]);
    })->name('user.tier');

    Route::resource('admin/fields', FieldOfWorkController::class);
});

// LinkedIn OAuth routes (no auth required — open to all users for resume generation)
Route::get('/auth/linkedin', [LinkedInAuthController::class, 'redirectToLinkedIn'])->name('linkedin.redirect');
Route::get('/auth/linkedin/callback', [LinkedInAuthController::class, 'handleLinkedInCallback'])->name('linkedin.callback');
Route::get('/api/linkedin/result', [LinkedInAuthController::class, 'getLinkedInResult'])->name('linkedin.result');

require __DIR__.'/auth.php';
