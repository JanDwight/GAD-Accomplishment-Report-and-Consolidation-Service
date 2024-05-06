<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
        $credentials = $request->validated();
    
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);
    
        // Get the user's IP address
        $ipAddress = $request->ip();
        
        if (!Auth::attempt($credentials, $remember)) {
            if (RateLimiter::tooManyAttempts('login-attempt:'.$ipAddress, $perMinute = 3)) {
                $seconds = RateLimiter::availableIn('login-attempt:'.$ipAddress);

                return response([
                    'message' => 'You may try again in '.$seconds.' seconds.',
                    'success' => false
                ], 422);
            }
            RateLimiter::increment('login-attempt:'.$ipAddress);
            
            return response([
                'message' => 'The provided credentials are not correct',
                'success' => false
            ], 422);
        }
    
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
    
        return response([
            'success' => true,
            'user' => $user,
            'token' => $token,
        ]);
    }
    
    public function logout(){
        /** @var User $user */

        $user = Auth::user();
        //Revoke the token that was used to authenticate the current request
        $user -> currentAccessToken()->delete();

        return response([
            'Success' => true
        ]);
    }
}
