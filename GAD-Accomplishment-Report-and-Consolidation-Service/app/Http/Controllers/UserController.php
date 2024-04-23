<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddUserRequest;
use App\Models\Forms;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    //for show all users
    public function index()
    {
        $data = User::withCount(['forms', 'accomplishmentReport'])
                    ->get(['id', 'name', 'email']); // Assuming you want to select only specific columns from the User table
            
        return response()->json($data);
    }
    

    public function adduser(AddUserRequest $request){
        try {
            $data = $request->validated();
        
            // Check if the email already exists
            if (User::where('email', $data['email'])->exists()) {
                return response([
                    'success' => false,
                    'message' => 'Email already exists.',
                ], 400); // You can choose an appropriate HTTP status code (e.g., 400 Bad Request)
            }
        
            // Create a new user if the email doesn't exist
            /** @var \App\Models\User $user */
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'role' => $data['role'],
                'password' => bcrypt($data['password'])
            ]);
        
            return response([
                'success' => true,
                'message' => 'User created Successfully',
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                // Log the exception
                \Log::error('Email already exists: ' . $e->getMessage());
        
                return response([
                    'success' => false,
                    'message' => 'Email already exists.',
                ]); // You can choose an appropriate HTTP status code
            }
        
            // For other exceptions
            \Log::error('Error creating user: ' . $e->getMessage());
        
            return response([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage(),
            ]); 
        }        
    }    

    public function updateuser(Request $request, $id){
        try {
            // Validate the incoming data (e.g., username, email)
            $validatedData = $request->validate([
                'username' => 'nullable|string',
                'email' => 'nullable|email'
            ]);
    
            // Retrieve the user based on the provided ID
            $user = User::find($id);
    
            if (!$user) {
                // Handle the case where the user with the provided ID is not found
                return response()->json([
                    'message' => 'User not found',
                    'success' => false
                ]);
            }
    
            // Update the user's information with the validated data
            $user->update($validatedData);
    
            // Return a success response
            return response()->json([
                'message' => 'User updated successfully',
                'success' => true
            ]);
    
        } catch (QueryException $e) {
            // Check for duplicate entry error
            if ($e->errorInfo[1] == 1062) { // MySQL error code for duplicate entry
                // Extract the specific field causing the duplicate entry error
                $matches = [];
                if (preg_match("/'([^']+)'/", $e->getMessage(), $matches)) {
                    $duplicateField = $matches[1];
                    $errorMessage = "The provided '{$duplicateField}' already exists.";
                } else {
                    $errorMessage = 'Duplicate entry error.';
                }
            } else {
                $errorMessage = $e->getMessage();
            }
    
            // Return an error response
            return response()->json([
                'message' => $errorMessage,
                'success' => false
            ], 400); // HTTP status code 400 for Bad Request
            
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'message' => 'An error occurred while updating the user',
                'error' => $e->getMessage(),
                'success' => false
            ], 500); // HTTP status code 500 for Internal Server Error
        }
    }
    


    public function archiveuser($id)
    {
        // Find the user by ID
        $user = User::find($id);
    
        // Check if the user exists
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            'success' => true
            ]);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $user->delete();
    
        return response()->json([
            'message' => 'User archived successfully',
            'success' => true
        ]);
    }

    public function restoreuser($id)
    {
        // Find the user by ID
        $user = User::withTrashed()
        ->find($id);
    
        // Check if the user exists
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'success' => false
            ]);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $user->restore();
    
        return response()->json([
            'message' => 'User Restored successfully',
            'success' => true
        ]);
    }

    public function userarchiveindex()
    {
        $users = User::onlyTrashed()
        ->get();

        return response()->json($users);
    }

    public function deleteuser($id)
    {
        // Find the user by ID
        $user = User::withTrashed()
        ->find($id);

        // Check if the user exists
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'success' => false
            ]);
        }

        // Force delete the user
        $user->forceDelete();

        return response()->json([
            'message' => 'User permanently deleted',
            'success' => true
        ]);
    }
}
