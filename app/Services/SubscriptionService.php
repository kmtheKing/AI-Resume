<?php

namespace App\Services;

use App\Models\Package;
use App\Models\User;
use App\Models\UserPackage;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    /**
     * Assign a package to a user (e.g., after successful payment).
     */
    public function subscribe(User $user, Package $package, array $paymentData = []): UserPackage
    {
        return DB::transaction(function () use ($user, $package, $paymentData) {
            // Optional: Mark previous active packages as cancelled/replaced
            $user->userPackages()->where('status', 'active')->update(['status' => 'cancelled']);

            $startedAt = now();
            $expiresAt = $package->duration_days > 0 
                ? $startedAt->copy()->addDays($package->duration_days) 
                : null;

            return UserPackage::create([
                'user_id'           => $user->id,
                'package_id'        => $package->id,
                'payment_reference' => $paymentData['reference'] ?? null,
                'payment_method'    => $paymentData['method'] ?? 'internal',
                'amount_paid'       => $paymentData['amount'] ?? $package->price,
                'currency'          => $paymentData['currency'] ?? 'USD',
                'status'            => 'active',
                'started_at'        => $startedAt,
                'expires_at'        => $expiresAt,
            ]);
        });
    }
}
