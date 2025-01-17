<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class BackupAndRestore extends Controller
{
    public function index() {
        $backupPath = storage_path('app/backup');
    
        // Get an array of all SQL files in the directory
        $sqlFiles = glob($backupPath . '/*.sql');
    
        // Extract only the filenames from the paths
        $filenames = array_map('basename', $sqlFiles);
    
        return response()->json([
            'message' => $filenames,
            'success' => true
        ]);
    }
    

    public function backup() {
        // Call the Artisan command
        Artisan::call('db:backup');

        // Optionally, you can get the output of the command
        $output = Artisan::output();
        
        // Optionally, you can check if the command was successful
        $exitCode = Artisan::call('db:backup');
        if ($exitCode === 0) {
            // Command executed successfully
        } else {
            // Command failed
        }

        return response()->json([
            'message' => 'Backup success',
            'success' => true
        ]);
        // Optionally, you can provide additional parameters to the command
        // Artisan::call('db:backup', ['--option' => 'value']);
    }

    public function restore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fileTitle' => 'required|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'success' => false
            ]);
        }
    
        $fileTitle = $request->input('fileTitle');
        $backupPath = storage_path('app/backup');
        $filePath = $backupPath . '/' . $fileTitle;
    
        if (!file_exists($filePath)) {
            return response()->json([
                'message' => 'Backup file not found',
                'success' => false
            ]);
        }
    
        $fileContent = file_get_contents($filePath);
    
        if ($fileContent === false) {
            return response()->json([
                'message' => 'Failed to read file contents',
                'success' => false
            ]);
        }
    
        DB::unprepared($fileContent);
    
        return response()->json([
            'message' => 'Database Restored',
            'success' => true
        ]);
    }
}
