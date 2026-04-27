<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\UserPackage;
use App\Models\ResumeAnalysis;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('Total registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('success'),
            
            Stat::make('Active Subscriptions', UserPackage::where('status', 'active')->count())
                ->description('Users currently on a paid plan')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('warning'),
            
            Stat::make('Total Tokens Used', ResumeAnalysis::sum('tokens_used'))
                ->description('Estimated Gemini API Tokens')
                ->descriptionIcon('heroicon-m-bolt')
                ->color('primary'),
        ];
    }
}
