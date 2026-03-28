<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeAnalysis extends Model
{
    protected $fillable = ['file_path', 'field_of_work_id', 'status', 'result'];

    protected $casts = [
        'result' => 'array',
    ];

    public function fieldOfWork()
    {
        return $this->belongsTo(FieldOfWork::class);
    }
}
