<?php

namespace App\Http\Controllers;


use App\Http\Requests\ACReportRequest_E_I;
use App\Http\Requests\AddMandate;
use App\Http\Requests\SetMandate;
use App\Models\accReport;
use App\Models\User;
use App\Models\Forms;
use App\Models\ActualExpendature;
use App\Models\Expenditures;
use App\Models\Mandates;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class AccomplishmentReportController extends Controller
{
    
    public function index_accomplishment_report() {
        $user = auth()->user();

        if ($user->role === 'college') {
            // Retrieve only the authenticated user's accomplishment reports along with actual expenditures
            $accomplishmentReports = $user->accomplishmentReport()->with('actualExpenditure')->get();
        } else {
            // If the user's role is not 'college', retrieve all accomplishment reports along with actual expenditures
            $accomplishmentReports = accReport::with('actualExpenditure')->get();
            //also get the users's names to show the owner



            
            //$accomplishmentReports = accReport::find(7);
            //$parent = $accomplishmentReports->forms;
            //$grandparent = Forms::find($parent['id']);
            /*foreach ($accomplishmentReports as $report) {
                $report->owner = 'user_1'; // Assuming the user's name field is 'name'
            }*/

            foreach ($accomplishmentReports as $report) {
                $parent = $report->forms;
                $magulang = User::find($parent['user_id']);
                
                $report->owner = $magulang->username;
            }
        }

        return response()->json($accomplishmentReports);
    }

    public function index_expenditures($id)
    {
        $forms_id = $id;
        //$form = Expenditures::find($forms_id);
        $xps = Expenditures::where('forms_id', $forms_id)->get();

        return response($forms_id);
    }

    public function getimages($id)
    {
        try {
            $report = accReport::with('images')->find($id);
            return response()->json($report->images->pluck('original_path')->toArray());
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false
            ]);
        }
    }
    

    public function accomplishment_report_store(ACReportRequest_E_I $request) {
        $accReport = $request->validated();
        $expenditures = $request->validated('expenditures');
        $images = $request->validated('images');
        $formsId = $request->input('forms_id');

        $parentForm = Forms::where('id', $formsId)->first();
        if ($parentForm) {
            $parentForm->comp_status = 'Completed';
            $parentForm->save();
        }
 
        // Create Accomplishment Report
        $createdAccReport = accReport::create([
            'forms_id' => $accReport['forms_id'],
            'title' => $accReport['title'],
            'date_of_activity' => $accReport['date_of_activity'],
            'venue' => $accReport['venue'],
            'proponents_implementors' => $accReport['proponents_implementors'],
            'no_of_participants' => $accReport['no_of_participants'],
            'male_participants' => $accReport['male_participants'],
            'female_participants' => $accReport['female_participants'],
            'focus' => '0',
        ]);
    
        // Find the first item with the given title
        $firstItem = accReport::where('title', $accReport['title'])->first();
      
        // Save Actual Expenditures
        foreach ($expenditures as $expenditure) {
            ActualExpendature::create([
                'acc_report_id' => $firstItem->id,
                'type' => $expenditure['type'],
                'items' => $expenditure['item'],
                'approved_budget' => $expenditure['approved_budget'],
                'actual_expenditure' => $expenditure['actual_expenditure'],
            ]);
        }
    
        // Store images
        $imageModels = [];
        foreach ($images as $image) {
            $manager = new ImageManager(new Driver());

            // Store each image in the storage directory
            $storedImagePath = $image->store('public/images');
            $fullImagePath = Storage::url($storedImagePath);

            $thumbnailPath = 'public/thumbnails/images' . $image->hashName();
            $thumbnail = $manager->read($image)->resize(100, 100);
            Storage::put($thumbnailPath, $thumbnail->encode());
            
            // Create an array of attributes for each image
            $imageModels[] = [
                'original_path' => $fullImagePath,
                'thumbnail_path' => $thumbnailPath
            ];
        }

        // Save the image paths to the database
        $createdAccReport->images()->createMany($imageModels);

        

        // Return the response with the stored image paths
        return response([
            'success' => true,
            'message' => 'Accomplishment Report Successfully Created',
            'images' => $imageModels  // Return the stored image paths in the response
        ]);

    }

    public function accomplishment_report_update() {
        //Update on the parent (Forms)
    }

    public function index_all_archived_accomplishment_report() {
        
        $allForms = accReport::with('forms')->onlyTrashed()->get();

        return response()->json($allForms);
    }

    public function accomplishment_report_archive($id) {
        // Find the form by ID
        $form = accReport::find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found']);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Form archived successfully'
        ]);
    }

    public function accomplishment_report_restore($id)
    {
        // Find the form by ID
        $form = accReport::withTrashed()
        ->find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ]);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->restore();
    
        return response()->json([
            'success' => true,
            'message' => 'Report Restored successfully'
        ]);
    }

    public function accomplishment_report_delete($id) {
        // Find the accomplishment report by ID
        $report = accReport::withTrashed()->find($id);
    
        // Check if the report exists
        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Accomplishment report not found'
            ]);
        }
    
        // Retrieve the image paths associated with the report
        $imagePaths = $report->images->pluck('original_path')->toArray();
    
        // Force delete the report
        $report->forceDelete();
    
        // Delete the associated images from storage
        foreach ($imagePaths as $path) {
            try {
                // Delete the original image
                if (Storage::exists($path)) {
                    Storage::delete($path);
                }
            
                // Delete the thumbnail image (assuming it's stored in the same directory)
                $thumbnailPath = str_replace('public/images/', 'public/thumbnails/images/', $path);
                if (Storage::exists($thumbnailPath)) {
                    Storage::delete($thumbnailPath);
                }
            } catch (\Exception $e) {
                // Log or handle the exception as needed
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }
        }

    
        return response()->json([
            'success' => true,
            'message' => 'Accomplishment report permanently deleted'
        ]);
    }

    public function setmandates(Setmandate $request){
        $requestData = $request->validated();
        $acc_list = $request->input('reportList');
        $mandate_id = $request->input('mandate_id');

        $mandate = Mandates::where('id', $mandate_id)->first();

        try {

            foreach ($acc_list as $report) {
                accReport::where('title', $report['title'])->update(['mandates_id' => $mandate_id]);
            }

            return response()->json([
                'message' => 'Succesfully set mandates.',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to set mandates.',
                'success' => false,
            ]);
        }
    }
}
