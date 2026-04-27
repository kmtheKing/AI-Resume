<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Forms\Components;
use Filament\Tables\Columns;
use Filament\Actions\EditAction;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Components\TextInput::make('name')->required(),
                Components\TextInput::make('email')->email()->required(),
                Components\Toggle::make('is_admin')->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Columns\TextColumn::make('name')->searchable(),
                Columns\TextColumn::make('email')->searchable(),
                Columns\TextColumn::make('resumeAnalyses_sum_tokens_used')
                    ->sum('resumeAnalyses', 'tokens_used')
                    ->label('Tokens Used')
                    ->sortable()
                    ->badge()
                    ->color('primary'),
                Columns\IconColumn::make('is_admin')->boolean(),
                Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([]);
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
