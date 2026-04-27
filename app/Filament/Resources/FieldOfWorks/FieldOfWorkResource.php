<?php

namespace App\Filament\Resources\FieldOfWorks;

use App\Filament\Resources\FieldOfWorks\Pages\CreateFieldOfWork;
use App\Filament\Resources\FieldOfWorks\Pages\EditFieldOfWork;
use App\Filament\Resources\FieldOfWorks\Pages\ListFieldOfWorks;
use App\Models\FieldOfWork;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Forms\Components;
use Filament\Tables\Columns;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class FieldOfWorkResource extends Resource
{
    protected static ?string $model = FieldOfWork::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Components\TextInput::make('category')
                    ->maxLength(255),
                Components\Textarea::make('description')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Columns\TextColumn::make('category')
                    ->searchable()
                    ->sortable()
                    ->badge(),
                Columns\TextColumn::make('description')
                    ->limit(50)
                    ->searchable(),
                Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFieldOfWorks::route('/'),
            'create' => CreateFieldOfWork::route('/create'),
            'edit' => EditFieldOfWork::route('/{record}/edit'),
        ];
    }
}
