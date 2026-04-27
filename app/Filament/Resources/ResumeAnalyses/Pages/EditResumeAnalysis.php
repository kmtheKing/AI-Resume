<?php

namespace App\Filament\Resources\ResumeAnalyses\Pages;

use App\Filament\Resources\ResumeAnalyses\ResumeAnalysisResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditResumeAnalysis extends EditRecord
{
    protected static string $resource = ResumeAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
