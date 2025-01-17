<?php

namespace App\Http\Controllers;

use App\Http\Requests\FormRequest_E;
use App\Http\Requests\FormRequest_I;
use App\Http\Requests\FormRequest_R;
use App\Models\User;
use App\Models\Forms;
use App\Models\Expenditures;
use Illuminate\Support\Facades\Auth;

class FormController extends Controller
{
    //for show all EMPLOYEE forms
    public function index_employee_forms()
    {
        $user = auth()->user();
        $userID = $user->id;
        
        if ($user->role === 'college') {
           
            $forms = User::where('id', $userID)->with(['forms' => function ($query) {
                $query->where('form_type', 'EMPLOYEE')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])->get();

            return response()->json($forms);

        } else {
            $forms = User::whereHas('forms', function ($query) {
                $query->where('form_type', 'EMPLOYEE')
                      ->where('comp_status', 'Pending')
                      ->whereNull('deleted_at'); // Exclude soft deleted forms
            })
            ->with(['forms' => function ($query) {
                $query->where('form_type', 'EMPLOYEE')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])
            ->get();
            
            return response()->json($forms);

        }
    }
  
    //for show all INSET forms
    public function indexInsetForms()
    {

        $user = auth()->user();
        $userID = $user->id;
        
        if ($user->role === 'college') {
            $forms = User::where('id', $userID)->with(['forms' => function ($query) {
                $query->where('form_type', 'INSET')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])->get();
            return response()->json($forms);

        } else {
        
            /*$forms = User::with(['forms' => function ($query) {
                $query->where('form_type', 'INSET')
                        ->where('comp_status', 'Pending')
                        ->with('expenditures');
            }])->get();*/

            $forms = User::whereHas('forms', function ($query) {
                $query->where('form_type', 'INSET')
                      ->where('comp_status', 'Pending')
                      ->whereNull('deleted_at'); // Exclude soft deleted forms
            })
            ->with(['forms' => function ($query) {
                $query->where('form_type', 'INSET')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])
            ->get();

            return response()->json($forms);

        }
    }

    //for show all EAD forms
    public function index_ead_form()
    {

        $user = auth()->user();
        $userID = $user->id;
        
        if ($user->role === 'college') {
            $forms = User::where('id', $userID)->with(['forms' => function ($query) {
                $query->where('form_type', 'EAD')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])->get();

            return response()->json($forms);

        } else {
        
            /*$forms = User::with(['forms' => function ($query) {
                $query->where('form_type', 'EAD')
                        ->where('comp_status', 'Pending')
                        ->with('expenditures');
            }])->get();*/

            $forms = User::whereHas('forms', function ($query) {
                $query->where('form_type', 'EAD')
                      ->where('comp_status', 'Pending')
                      ->whereNull('deleted_at'); // Exclude soft deleted forms
            })
            ->with(['forms' => function ($query) {
                $query->where('form_type', 'EAD')
                    ->where('comp_status', 'Pending')
                    ->with('expenditures');
            }])
            ->get();

            return response()->json($forms);

        }
    }

    public function index_all_archived_forms()
    {
        //$allForms = Forms::onlyTrashed()->get(); //soft deleted only

        // Retrieve completed forms
        $completedForms = Forms::where('comp_status', 'Completed')->get();

        // Retrieve trashed forms
        $trashedForms = Forms::onlyTrashed()->get();

        // Join both data sets
        $allForms = $completedForms->concat($trashedForms);

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
                'success' => false,
                'message' => 'Title must be unique',
            ]);
        }

        $employeeform = Forms::create([
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

        // Log user creation activity
        activity()->performedOn($employeeform)->withProperties(['created' => ['Employee Activity Design' => ['title' => $employeeform['title']]]])->log('Activity Design Created');

        return response([
              'success' => true,
              'message' => 'Form Added',
              'message 2' => $inputFields
        ]);
    }

    public function form_employee_update(FormRequest_E $request, $id)
    {
        try {
            $validatedData = $request->validated();
            $xpArray = $request->input('xp_data');
            $form = Forms::find($id);
            $xp_forms = Expenditures::where('forms_id', $id)->get();
            $formArray = $validatedData['form_data'];
    
            // Capture the original form data
            $originalFormData = $form->toArray();
    
            // Update the form
            $form->update($formArray);
    
            // Compare the original form data with the updated form data
            $changedFields = [];
    
            foreach ($formArray as $key => $value) {
                if ($originalFormData[$key] != $value) {
                    $changedFields[$key] = ['old' => $originalFormData[$key], 'new' => $value];
                }
            }
    
            // Log the changes in the main form
            if (!empty($changedFields)) {
                activity()
                    ->performedOn($form)
                    ->withProperties(['Updated' => ['Employee Activity Design', $changedFields]])
                    ->log('Form updated');
            }
    
            // Update expenditures and log changes
            foreach ($xp_forms as $index => $xp_form) {
                if (isset($xpArray[$index])) {
                    $changedFieldsXp = [];
    
                    foreach ($xpArray[$index] as $key => $value) {
                        if ($xp_form->$key != $value) {
                            $changedFieldsXp[$key] = ['old' => $xp_form->$key, 'new' => $value];
                        }
                    }
    
                    if (!empty($changedFieldsXp)) {
                        activity()
                            ->performedOn($xp_form)
                            ->withProperties(['Updated' => ['Employee Activity Design', $changedFields]])
                            ->log('Expenditure updated');
                    }
    
                    // Update expenditure fields
                    $xp_form->type = $xpArray[$index]['type'];
                    $xp_form->items = $xpArray[$index]['item'];
                    $xp_form->per_item = $xpArray[$index]['per_item'];
                    $xp_form->no_item = $xpArray[$index]['no_item'];
                    $xp_form->times = $xpArray[$index]['times'];
                    $xp_form->total = $xpArray[$index]['total'];
    
                    // Save the changes to the database
                    $xp_form->save();
                }
            }
    
            // Remove fields that were marked for deletion
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
                'success' => true,
                'message' => 'Update Successful',
            ]);
    
        } catch (\Exception $e) {
            return response([
                'success' => false,
                'message' => 'Error updating form: ' . $e->getMessage(),
            ]);
        }
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
                'success' => false,
                'message' => 'Title must be unique',
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
        
        // Log user creation activity
        activity()->performedOn($form)->withProperties(['created' => ['Inset Activity Design' => ['title' => $form['title']]]])->log('Activity Design Created');

        return response([
                'success' => true,
                'message' => 'Form Added'
        ]);
    }

    public function form_inset_update(FormRequest_I $request, $id)
    {
        $validatedData = $request->validated();
        $xpArray = $request->input('xp_data');
        $form = Forms::find($id);
        $xp_forms = Expenditures::where('forms_id', $id)->get();
        $formArray = $validatedData['form_data'];

        // Capture the original form data
        $originalFormData = $form->toArray();

        $form->update($formArray);

        // Compare the original form data with the updated form data
        $changedFields = [];

        foreach ($formArray as $key => $value) {
            if ($originalFormData[$key] != $value) {
                $changedFields[$key] = ['old' => $originalFormData[$key], 'new' => $value];
            }
        }

        // Log the changes in the main form
        if (!empty($changedFields)) {
            activity()
                ->performedOn($form)
                ->withProperties(['Updated' => ['Inset Activity Design', $changedFields]])
                ->log('Form updated');
        }

        foreach ($xp_forms as $index => $xp_form) {
            if (isset($xpArray[$index])) {
                $changedFieldsXp = [];

                foreach ($xpArray[$index] as $key => $value) {
                    if ($xp_form->$key != $value) {
                        $changedFieldsXp[$key] = ['old' => $xp_form->$key, 'new' => $value];
                    }
                }

                if (!empty($changedFieldsXp)) {
                    activity()
                        ->performedOn($xp_form)
                        ->withProperties(['Updated' => ['Inset Activity Design', $changedFields]])
                        ->log('Expenditure updated');
                }
            

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
             'success' => true,
             'message' => 'Form Updated'
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
                'success' => false,
                'message' => 'Title must be unique',
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
        
        // Log user creation activity
        activity()->performedOn($form)->withProperties(['Created' => ['Extention Activity Design' => ['title' => $form['title']]]])->log('Extention Design Created');

        return response([
               'success' => true,
               'message' => 'Form Added'
        ]);
 
    }
    
    public function form_ead_update(FormRequest_R $request, $id)
    {
        $validatedData = $request->validated();
        $xpArray = $request->input('xp_data');
        $form = Forms::find($id);
        $xp_forms = Expenditures::where('forms_id', $id)->get();
        $formArray = $validatedData['form_data'];

        // Capture the original form data
        $originalFormData = $form->toArray();

        $form->update($formArray);

        // Compare the original form data with the updated form data
        $changedFields = [];

        foreach ($formArray as $key => $value) {
            if ($originalFormData[$key] != $value) {
                $changedFields[$key] = ['old' => $originalFormData[$key], 'new' => $value];
            }
        }

        // Log the changes in the main form
        if (!empty($changedFields)) {
            activity()
                ->performedOn($form)
                ->withProperties(['Updated' => ['Extention Activity Design', $changedFields]])
                ->log('Form updated');
        }

        foreach ($xp_forms as $index => $xp_form) {
                            if (isset($xpArray[$index])) {
                    $changedFieldsXp = [];
    
                    foreach ($xpArray[$index] as $key => $value) {
                        if ($xp_form->$key != $value) {
                            $changedFieldsXp[$key] = ['old' => $xp_form->$key, 'new' => $value];
                        }
                    }
    
                    if (!empty($changedFieldsXp)) {
                        activity()
                            ->performedOn($xp_form)
                            ->withProperties(['Updated' => ['Extention Activity Design', $changedFields]])
                            ->log('Expenditure updated');
                    }
                }
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
             'success' => true,
             'message' => 'Form Updated'
       ]);
    }
    
    //For Form CRUD====================================================================================================================================
    public function form_archive($id){
        // Find the form by ID
        $form = Forms::find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ]);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->delete();
    
        // Log user creation activity
        activity()->performedOn($form)->withProperties(['Archived' => ['Form' => $form['title']]])->log('Form archived');

        return response([
            'success' => true,
            'message' => 'Form archived successfully']);

    }

    public function form_restore($id)
    {
        // Find the form by ID
        $form = Forms::withTrashed()->find($id);
    
        // Check if the form exists
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ]);
        }
    
        // Eloquent automatically handles soft deletes if the model uses the SoftDeletes trait, if SoftDeletes is used
        $form->restore();
        $form->comp_status = 'Pending';
        $form->save();
    
        // Log user creation activity
        activity()->performedOn($form)->withProperties(['Restored' => ['Form' => $form['title']]])->log('Form restored');

        return response([
            'success' => true,
            'message' => 'Form Restored successfully'
        ]);
    }

    public function form_delete($id)
    {
        // Find the form by ID
        $form = Forms::withTrashed()
        ->find($id);

        // Check if the form exists
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ]);
        }

        // Force delete the form
        $form->forceDelete();

        // Log user creation activity
        activity()->performedOn($form)->withProperties(['Deleted' => ['Form' => $form['title']]])->log('Form deleted');

        return response()->json([
            'success' => true,
            'message' => 'Form permanently deleted'
        ]);
    }
}