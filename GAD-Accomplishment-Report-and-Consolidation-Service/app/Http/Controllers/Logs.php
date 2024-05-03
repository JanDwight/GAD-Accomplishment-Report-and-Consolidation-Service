<?php

namespace App\Http\Controllers;

use Spatie\Activitylog\Models\Activity;

class Logs extends Controller
{
    public function index()
    {
        // Retrieve all activity logs with associated causer usernames
        $logs = Activity::with('causer:id,username')->latest()->get();

        // Modify the logs to replace causer_id with causer_username
        $logs->transform(function ($log) {
            $log->causer_username = optional($log->causer)->username;
            unset($log->causer); // Remove the causer object to avoid redundancy
            
            // Format the created_at field
            $log->formated_updated_at = date('n-j-Y', strtotime($log->updated_at));

            return $log;
        });

        // Return the logs as JSON response
        return response()->json($logs);
    }
}
