<?php

namespace App\Filament\Resources\ResumeAnalyses;

use App\Filament\Resources\ResumeAnalyses\Pages\CreateResumeAnalysis;
use App\Filament\Resources\ResumeAnalyses\Pages\EditResumeAnalysis;
use App\Filament\Resources\ResumeAnalyses\Pages\ListResumeAnalyses;
use App\Filament\Resources\ResumeAnalyses\Schemas\ResumeAnalysisForm;
use App\Filament\Resources\ResumeAnalyses\Tables\ResumeAnalysesTable;
use App\Models\ResumeAnalysis;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Forms\Components;
use Filament\Tables\Columns;
use Filament\Tables\Actions;

class ResumeAnalysisResource extends Resource
{
    protected static ?string $model = ResumeAnalysis::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Components\Select::make('user_id')
                    ->relationship('user', 'name'),
                Components\Select::make('field_of_work_id')
                    ->relationship('fieldOfWork', 'name')
                    ->required(),
                Components\TextInput::make('status')
                    ->required(),
                Components\TextInput::make('tokens_used')
                    ->numeric(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Columns\TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
                Columns\TextColumn::make('fieldOfWork.name')
                    ->numeric()
                    ->sortable(),
                Columns\TextColumn::make('status')
                    ->searchable(),
                Columns\TextColumn::make('tokens_used')
                    ->numeric()
                    ->sortable()
                    ->badge()
                    ->color('success'),
                Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([])
            ->actions([
                Actions\ViewAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
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
            'index' => ListResumeAnalyses::route('/'),
            'create' => CreateResumeAnalysis::route('/create'),
            'edit' => EditResumeAnalysis::route('/{record}/edit'),
        ];
    }
}
