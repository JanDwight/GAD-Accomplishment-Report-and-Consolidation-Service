<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;


class BackupAndRestore extends Controller
{
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

    public function restore() {
        DB::unprepared(
            file_get_contents(__DIR__ . './dump.sql')
        );
    }
}
