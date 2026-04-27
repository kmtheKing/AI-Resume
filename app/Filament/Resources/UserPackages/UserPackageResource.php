<?php

namespace App\Filament\Resources\UserPackages;

use App\Filament\Resources\UserPackages\Pages\CreateUserPackage;
use App\Filament\Resources\UserPackages\Pages\EditUserPackage;
use App\Filament\Resources\UserPackages\Pages\ListUserPackages;
use App\Models\UserPackage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Forms\Components;
use Filament\Tables\Columns;
use Filament\Actions\EditAction;

class UserPackageResource extends Resource
{
    protected static ?string $model = UserPackage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Components\Select::make('package_id')
                    ->relationship('package', 'name')
                    ->required(),
                Components\TextInput::make('amount_paid')
                    ->required()
                    ->numeric(),
                Components\Select::make('status')
                    ->options([
                        'active' => 'Active',
                        'expired' => 'Expired',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Columns\TextColumn::make('user.name')
                    ->sortable(),
                Columns\TextColumn::make('package.name')
                    ->sortable(),
                Columns\TextColumn::make('amount_paid')
                    ->money()
                    ->sortable(),
                Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'expired' => 'danger',
                        'cancelled' => 'warning',
                        default => 'gray',
                    }),
                Columns\TextColumn::make('started_at')
                    ->dateTime()
                    ->sortable(),
                Columns\TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable(),
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
            'index' => ListUserPackages::route('/'),
            'create' => CreateUserPackage::route('/create'),
            'edit' => EditUserPackage::route('/{record}/edit'),
        ];
    }
}
