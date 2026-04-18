<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FieldOfWork extends Model
{
    protected $fillable = ['name', 'category', 'description'];

    public function analyses()
    {
        return $this->hasMany(ResumeAnalysis::class);
    }
}
