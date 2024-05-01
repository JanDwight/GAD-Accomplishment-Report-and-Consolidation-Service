<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
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
            'token' => $token
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
