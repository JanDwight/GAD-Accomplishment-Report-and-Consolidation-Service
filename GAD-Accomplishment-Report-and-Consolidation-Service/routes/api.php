<?php

use App\Http\Controllers\AccomplishmentReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BackupAndRestore;
use App\Http\Controllers\MandatesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FormController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    //For Users================================================
    Route::controller(UserController::class)->group(function() {
        Route::post('/adduser', 'adduser');
        Route::post('/updateuser/{id}', 'updateuser');
        Route::put('/archiveuser/{id}', 'archiveuser');
        Route::put('/restoreuser/{id}', 'restoreuser');
        Route::put('/deleteuser/{id}', 'deleteuser');
        Route::get('/profile', 'profile');
        Route::get('/showusers', 'index');
        Route::get('/showarchivedusers', 'userarchiveindex');
        Route::get('/counter', 'counter');
    });

    //For Mandates================================================
    Route::controller(MandatesController::class)->group(function() {
        Route::post('/createmandates', 'createmandates');
        Route::get('/showmandates', 'index');
        Route::get('/showarchivedmandates', 'archivedindex');
        Route::put('/updatemandate/{id}', 'updatemandates');
        Route::put('/archivemandate/{id}', 'archivemandates');
        Route::put('/restoremandate/{id}', 'restoremandates');
        Route::put('/deletemandate/{id}', 'deletemandates');
        Route::get('/showact_mandates','showact_mandates');
        
    });
    
    //For Activity Design================================================
    Route::controller(FormController::class)->group(function() {
        //Activity Forms Employee
        Route::post('/form_employee', 'form_employee_store');
        Route::get('/show_form_employee', 'index_employee_forms');
        Route::put('/update_form_employee/{id}', 'form_employee_update');

        //Activity Forms Inset
        Route::post('/form_inset', 'form_inset_store');
        Route::put('/update_form_inset/{id}', 'form_inset_update');
        Route::get('/show_form_inset', 'indexInsetForms');

        //Activity Forms EAD
        Route::post('/form_ead', 'form_ead_store');
        Route::get('/show_form_ead', 'index_ead_form');
        Route::put('/update_form_ead/{id}', 'form_ead_update');

        //Form Crud Functions
        Route::get('/show_archived_forms_all', 'index_all_archived_forms');
        Route::put('/archive_form/{id}', 'form_archive');
        Route::put('/restore_form/{id}', 'form_restore');
        Route::put('/delete_form/{id}', 'form_delete');
    });

    //For accomplishment Report================================================
    Route::controller(AccomplishmentReportController::class)->group(function() {
        //Accomplishment Report
        Route::post('/accomplishment_report', 'accomplishment_report_store');
        Route::get('/show_accomplishment_report', 'index_accomplishment_report');
        Route::get('/update_accomplishment_report', 'accomplishment_report_update');
        Route::put('/addmandates', 'addmandates');
        Route::get('/getimages/{id}', 'getimages'); 
        Route::put('/setmandates', 'setmandates');//setmandates

        //Accomplishment Report Crud Functions
        Route::get('/show_archived_accomplishment_report_all', 'index_all_archived_accomplishment_report');
        Route::put('/archive_accomplishment_report/{id}', 'accomplishment_report_archive');
        Route::put('/restore_accomplishment_report/{id}', 'accomplishment_report_restore');
        Route::put('/delete_accomplishment_report/{id}', 'accomplishment_report_delete');

    });

    Route::controller(BackupAndRestore::class)->group(function() {
        Route::post('/backup', 'backup');
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::post('/login', [AuthController::class, 'login']);



