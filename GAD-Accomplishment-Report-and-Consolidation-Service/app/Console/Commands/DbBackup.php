<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DbBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Database Backup';

    /**
     * Execute the console command.
     */
public function handle()
{
    $backupPath = storage_path('app/backup');
    // Check if the backup folder exists, if not, create it
    if (!file_exists($backupPath)) {
        mkdir($backupPath, 0755, true); // Create backup directory recursively
    }

    $filename = "backup_" . date('Y-m-d_H-i-s') . ".sql";
    $filePath = $backupPath . '/' . $filename;
    $command = "mysqldump --user=" . env('DB_USERNAME') . " --password=" . env('DB_PASSWORD') . " --host=" . env('DB_HOST') . " " . env('DB_DATABASE') . " > " . $filePath;
    exec($command);
}

}
