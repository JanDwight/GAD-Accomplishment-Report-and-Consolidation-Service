<?php

namespace App\Http\Controllers;

use App\Http\Requests\FormRequest_E;
use App\Http\Requests\FormRequest_I;
use App\Http\Requests\FormRequest_R;
use App\Models\User;
use App\Models\Forms;
use App\Models\Expenditures;
use App\Models\accReport;
use Illuminate\Support\Facades\Auth;

class FormController extends Controller
{
    //for show all EMPLOYEE forms
    public function index_employee_forms()
    {
        //using, parent-child relationship
        
        $forms = Forms::where('form_type', 'EMPLOYEE')
                    ->with('expenditures') // load expenditures relationship in Forms model
                    ->get();

        // Extract expenditures data
        $expenditures = [];
        foreach ($forms as $form) {
            $expenditures[$form->id] = $form->expenditures;
        }

        return response()->json($forms);
    }
  
    //for show all INSET forms
    public function indexInsetForms()
    {

        $forms = Forms::where('form_type', 'INSET')
                    ->with('expenditures') // load expenditures relationship in Forms model
                    ->get();
        //$forms = Forms::where('form_type', 'INSET')->get();

        return response()->json($forms);
    }

    //for show all EAD forms
    public function index_ead_form()
    {

        $forms = Forms::where('form_type', 'EAD')
                    ->with('expenditures') // load expenditures relationship in Forms model
                    ->get();
        //$forms = Forms::where('form_type', 'EAD')->get();

        return response()->json($forms);
    }

    public function index_all_archived_forms()
    {

        $allForms = Forms::onlyTrashed()->get();

        return response()->json($allForms);
    }

    //for EMPLOYEE training design==============================================================================================
    public function form_employee_store(FormRequest_E $request)
    {
        $formData = $request->input('form_data');
        $inputFields = $request->input('xp_data');
        $formtitle = $formData['title'];
        $formtype = "EMPLOYEE";
        $user = Auth::user();

        $existingRecord = Forms::where('title', $formtitle )->exists();

        if ($existingRecord) {
            return response([
                'Success' => false,
                'Message' => 'Title must be unique',
            ]);
    
        }

        $form = Forms::create([
            'title' => $formtitle,
            'user_id' => $user->id,
            'form_type' => $formtype,
            'purpose' => $formData['purpose'],
            'legal_bases' => $formData['legal_bases'],
            'date_of_activity' => $formData['date_of_activity'],
            'venue' => $formData['venue'],
            'participants' => $formData['participants'],
            'no_of_target_participants' => $formData['no_of_target_participants'],
            'learning_service_providers' => $formData['learning_service_providers'],
            'expected_outputs' => $formData['expected_outputs'],
            'fund_source' => $formData['fund_source'],
            'proponents_implementors' => $formData['proponents_implementors'],
        ]);

        // Find the first item with the given title
        $firstItem = Forms::where('title', $formData['title'])->first();

        //calculate total later
 
        foreach ($inputFields as $data) {
            Expenditures::create([
                'forms_id' => $firstItem->id,
                'type' => $data['type'],
                'items' => $data['item'],
                'per_item' => $data['per_item'],
                'no_item' => $data['no_item'],
                'times' => $data['times'],
                'total' => $data['total'],
            ]);
        }

        return response([
              'Success' => true,
              'Message' => 'Form Added',
              'Message 2' => $inputFields
        ]);

    }

    public function form_employee_update(FormRequest_E $request, $id)
    {
        $validatedData = $request->validated();
        $xpArray = $request->input('xp_data');
        $form = Forms::find($id);
        $xp_forms = Expenditures::where('forms_id', $id)->get();
        $formArray = $validatedData['form_data'];

        $form->update($formArray);

        foreach ($xp_forms as $index => $xp_form) {
            if (isset($xpArray[$index])) {
                $xp_form->type = $xpArray[$index]['type'];
                $xp_form->items = $xpArray[$index]['item'];
                $xp_form->per_item = $xpArray[$index]['per_item'];
                $xp_form->no_item = $xpArray[$index]['no_item'];
                $xp_form->times = $xpArray[$index]['times'];
                $xp_form->total = $xpArray[$index]['total'];
                // Update other fields as needed
                
                // Save the changes to the database
                $xp_form->save();
            }
        }

        //remove fields ---> remove from DB
        $toRemove = $request->input('to_remove');

        foreach ($toRemove as $id) {
            // Find the item by its ID
            $item = Expenditures::find($id);
            
            // If the item exists, delete it
            if ($item) {
                $item->delete();
            }
        }

            return response([
             'Success' => true,
             'Message' => $toRemove,
       ]);
    }
    
    //for INSET training design==============================================================================================
    public function form_inset_store(FormRequest_I $request)
    {
        
        $formData = $request->input('form_data');
        $inputFields = $request->input('xp_data');
        $formtitle = $formData['title'];
        $formtype = "INSET";
        $user = Auth::user();
        
        $existingRecord = Forms::where('title', $formtitle )->exists();

        if ($existingRecord) {
            return response([
                'Success' => false,
                'Message' => 'Title must be unique',
            ]);
            //return response()->json(['error' => 'Title must be unique'], 422);
        }

        $form = Forms::create([
            'title' => $formtitle,
            'user_id' => $user->id,
            'form_type' => $formtype,
            'purpose' => $formData['purpose'],
            'legal_bases' => $formData['legal_bases'],
            'date_of_activity' => $formData['date_of_activity'],
            'venue' => $formData['venue'],
            'participants' => $formData['participants'],
            'learning_service_providers' => $formData['learning_service_providers'],
            'expected_outputs' => $formData['expected_outputs'],
            'fund_source' => $formData['fund_source'],
            'proponents_implementors' => $formData['proponents_implementors'],
        ]);

        // Find the first item with the given title
        $firstItem = Forms::where('title', $formData['title'])->first();

        //calculate total later

        foreach ($inputFields as $data) {
            Expenditures::create([
                'forms_id' => $firstItem->id,
                'type' => $data['type'],
                'items' => $data['item'],
                'per_item' => $data['per_item'],
                'no_item' => $data['no_item'],
                'times' => $data['times'],
                'total' => $data['total'],
            ]);
        }

        return response([
                'Success' => true,
                'Message' => 'Form Added'
        ]);
    }

    public function form_inset_update(FormRequest_I $request, $id)
    {
        $validatedData = $request->validated();
        $xpArray = $request->input('xp_data');
        $form = Forms::find($id);
        $xp_forms = Expenditures::where('forms_id', $id)->get();
        $formArray = $validatedData['form_data'];

        $form->update($formArray);

        foreach ($xp_forms as $index => $xp_form) {
            if (isset($xpArray[$index])) {
                $xp_form->type = $xpArray[$index]['type'];
                $xp_form->items = $xpArray[$index]['item'];
                $xp_form->per_item = $xpArray[$index]['per_item'];
                $xp_form->no_item = $xpArray[$index]['no_item'];
                $xp_form->times = $xpArray[$index]['times'];
                $xp_form->total = $xpArray[$index]['total'];
                // Update other fields as needed
                
                // Save the changes to the database
                $xp_form->save();
            }
        }

          //remove fields ---> remove from DB
          $toRemove = $request->input('to_remove');

          foreach ($toRemove as $id) {
              // Find the item by its ID
              $item = Expenditures::find($id);
              
              // If the item exists, delete it
              if ($item) {
                  $item->delete();
              }
          }

            return response([
             'Success' => true,
             'Message' => 'Form Updated'
       ]);
    }

    //for EAD training design==============================================================================================
    public function form_ead_store(FormRequest_R $request)
    {
        $formData = $request->input('form_data');
        $inputFields = $request->input('xp_data');
        $formtitle = $formData['title'];
        $formtype = "EAD";
        $user = Auth::user();
 
        $existingRecord = Forms::where('title', $formtitle )->exists();
 
        if ($existingRecord) {
            return response([
                'Success' => false,
                'Message' => 'Title must be unique',
            ]);
            //return response()->json(['error' => 'Title must be unique'], 422);
        }
 
        $form = Forms::create([
            'program_title' => $formData['program_title'], 
            'project_title' => $formData['project_title'], 
            'title' => $formtitle,
            'user_id' => $user->id,
            'form_type' => $formtype,
            'date_and_venue' => $formData['date_and_venue'],
            'clientele_type_and_number' => $formData['clientele_type_and_number'],
            'estimated_cost' => $formData['estimated_cost'],
            'cooperating_agencies_units' => $formData['cooperating_agencies_units'],
            'expected_outputs' => $formData['expected_outputs'],
            'fund_source' => $formData['fund_source'],
            'proponents_implementors' => $formData['proponents_implementors'],

            'date_of_activity' => 'n/a',
            'venue' => 'n/a'
        ]);
 
        // Find the first item with the given title
        $firstItem = Forms::where('title', $formData['title'])->first();
  
        foreach ($inputFields as $data) {
            Expenditures::create([
                'forms_id' => $firstItem->id,
                'type' => $data['type'],
                'items' => $data['item'],
                'estimated_cost' => $data['estimated'], // 
                'remarks' => $data['remarks'],
                'source_of_funds' => $data['source_of_funds'],
            ]);
        }
 
        return response([
               'Success' => true,
               'Message' => 'Form Added'
        ]);
 
    }
    
    public function form_ead_update(FormRequest_R $request, $id)
    {
        $validatedData = $request->validated();
        $xpArray = $request->input('xp_data');
        $form = Forms::find($id);
        $xp_forms = Expenditures::where('forms_id', $id)->get();
        $formArray = $validatedData['form_data'];

        $form->update($formArray);

        foreach ($xp_forms as $index => $xp_form) {
            if (isset($xpArray[$index])) {
                $xp_form->type = $xpArray[$index]['type'];
                $xp_form->items = $xpArray[$index]['item'];
                $xp_form->estimated_cost = $xpArray[$index]['estimated'];
                $xp_form->remarks = $xpArray[$index]['remarks'];
                $xp_form->source_of_funds = $xpArray[$index]['source_of_funds'];
               
                $xp_form->save();

                //try catch, then delete
            }
        }

        //remove fields ---> remove from DB
        $toRemove = $request->input('to_remove');

        foreach ($toRemove as $id) {
            // Find the item by its ID
            $item = Expenditures::find($id);
             
            // If the item exists, delete it
            if ($item) {
                 $item->delete();
            }
        }

            return response([
             'Success' => true,
             'Message' => 'Form Updated'
       ]);
    }
    
    //For Form CRUD====================================================================================================================================
    public function form_archive($id){
        // Find the form by ID
        $form = Forms::find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->delete();
    
        return response([
            'Success' => true,
            'message' => 'Form archived successfully']);

    }

    public function form_restore($id)
    {
        // Find the form by ID
        $form = Forms::withTrashed()
        ->find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->restore();
    
        return response([
            'Success' => true,
            'message' => 'Form Restored successfully']);
    }

    public function form_delete($id)
    {
        // Find the form by ID
        $form = Forms::withTrashed()
        ->find($id);

        // Check if the form exists
        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        // Force delete the form
        $form->forceDelete();

        return response()->json(['message' => 'Form permanently deleted']);
    }
}