<?php

namespace App\Filament\Resources\FieldOfWorks\Pages;

use App\Filament\Resources\FieldOfWorks\FieldOfWorkResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFieldOfWorks extends ListRecords
{
    protected static string $resource = FieldOfWorkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
