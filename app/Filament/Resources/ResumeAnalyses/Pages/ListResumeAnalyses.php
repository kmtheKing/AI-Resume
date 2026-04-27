<?php

namespace App\Filament\Resources\ResumeAnalyses\Pages;

use App\Filament\Resources\ResumeAnalyses\ResumeAnalysisResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListResumeAnalyses extends ListRecords
{
    protected static string $resource = ResumeAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
