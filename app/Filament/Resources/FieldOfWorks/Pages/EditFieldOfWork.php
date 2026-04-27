<?php

namespace App\Filament\Resources\FieldOfWorks\Pages;

use App\Filament\Resources\FieldOfWorks\FieldOfWorkResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFieldOfWork extends EditRecord
{
    protected static string $resource = FieldOfWorkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
