<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Forms;
use App\Models\User;
use App\Models\accReport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class UserController extends Controller
{
    //for show all users
    public function index()
    {
        $data = User::withCount(['forms', 'accomplishmentReport'])
                    ->get(['id', 'name', 'email']); // Assuming you want to select only specific columns from the User table
            
        return response()->json($data);
    }
    
    public function profile()
    {
        $profile = Auth::user();

        // Fetch the logo associated with the user
        $logo = $profile->logo()->first();

        // Add logo data to the user object
        $profile->logo = $logo ? $logo->toArray() : null;

        return response()->json([
            'message' => $profile,
            'success' => true
        ]);
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
        
        // Log user creation activity
        activity()->performedOn($user)->withProperties(['created' => ['username' => $data['username'], 'email' => $data['email']]])->log('User created');

            return response([
                'success' => true,
                'message' => 'User created Successfully',
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                return response([
                    'success' => false,
                    'message' => 'Email already exists.',
                ]); // You can choose an appropriate HTTP status code
            }
        
            return response([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage(),
            ]); 
        }        
    }    

    public function updateuser(UpdateUserRequest $request, $id)
    {        
        try {
            $data = $request->validated();
            $image = $request->validated('image');

            // Retrieve the user based on the provided ID
            $user = User::find($id);

            if (!$user) {
                // Handle the case where the user with the provided ID is not found
                return response()->json([
                    'message' => 'User not found',
                    'success' => false
                ]);
            }

            // Create an array to store changes
            $changes = [];

            // Compare and log changes for password
            if (isset($data['password']) && $data['password'] !== $user->password) {
                $changes['password'] = 'Password updated';
                $user->password = bcrypt($data['password']);
            }

            // Compare and log changes for username
            if (isset($data['username']) && $data['username'] !== $user->username) {
                $changes['username'] = ['old' => $user->username, 'new' => $data['username']];
                $user->username = $data['username'];
            }

            // Compare and log changes for email
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $changes['email'] = ['old' => $user->email, 'new' => $data['email']];
                $user->email = $data['email'];
            }

            // Check if an image is provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                // Assuming Logo model has a one-to-one relationship with User model
                if ($user->logo) {
                    // Delete the existing logo before adding a new one
                    Storage::delete([$user->logo->original_path, $user->logo->thumbnail_path]);
                    $user->logo->delete();
                }

                $manager = new ImageManager(new Driver());

                // Store the image in the storage directory
                $storedImagePath = $image->store('public/logos/');
                $fullImagePath = Storage::url($storedImagePath);

                $thumbnailPath = 'public/thumbnails/logos/' . $image->hashName();
                $thumbnail = $manager->read($image)->resize(100, 100);
                Storage::put($thumbnailPath, $thumbnail->encode());

                // Create a new Logo instance and save the image paths to it
                $user->logo()->create([
                    'original_path' => $fullImagePath,
                    'thumbnail_path' => $thumbnailPath,
                ]);
            }

            // Save the updated user data
            $user->save();

            // Log changes
            if (!empty($changes)) {
                activity()->performedOn($user)->withProperties(['changed' => $changes])->log('User updated');
            }

            // Return a success response
            return response()->json([
                'message' => 'User Updated Successfully',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            // Log the exception
            activity()->log('Error occurred: ' . $e->getMessage());

            // Return an error response
            return response()->json([
                'message' => 'Error occurred: ' . $e->getMessage(),
                'success' => false
            ], 500);
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
            'success' => false
            ]);
        }
    
            // Check if the user is trying to archive themselves
        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot archive yourself',
                'success' => false // Change to false as it's not a successful operation
            ]);
        }

        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $user->delete();
        
        // Log user creation activity
        activity()->performedOn($user)->withProperties(['archived' => ['username' => $user['username']]])->log('User created');

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
    
        // Log user creation activity
        activity()->performedOn($user)->withProperties(['restored' => ['username' => $user['username']]])->log('User created');

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

        // Log user creation activity
        activity()->performedOn($user)->withProperties(['deleted' => ['username' => $user['username']]])->log('User created');

        return response()->json([
            'message' => 'User permanently deleted',
            'success' => true
        ]);
    }

    public function counter() 
    {
        $userCount = User::count(); // Count the number of users
        $formCount = Forms::count(); // Count the number of users
        $completedCount = accReport::count();
        $pendingCount = $formCount - $completedCount;

        return response()->json([
            'users' => $userCount,
            'design' => $formCount,
            'pending' => $pendingCount,
            'completed' => $completedCount 
        ]);
    }
}
