<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeAnalysis extends Model
{
    protected $fillable = ['user_id', 'file_path', 'field_of_work_id', 'status', 'result', 'tokens_used'];

    protected $casts = [
        'result' => 'array',
        'tokens_used' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fieldOfWork()
    {
        return $this->belongsTo(FieldOfWork::class);
    }
}
