<?php

namespace App\Http\Controllers;

use App\Http\Requests\MandatesRequest;
use App\Models\Mandates;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MandatesController extends Controller
{
    public function index(){
        $mandates = Mandates::all();

        return response()->json($mandates);
    }

    public function archivedindex(){
        $mandates = Mandates::onlyTrashed()->get();

        return response()->json($mandates);
    }
    

    public function createmandates(MandatesRequest $request){
        try {
            $mandatesData = $request->validated('form_data');
    
            $mandates = Mandates::create([
                'gender_issue' => $mandatesData['gender_issue'],
                'cause_of_gender_issue' => $mandatesData['cause_of_gender_issue'],
                'gad_result_statement' => $mandatesData['gad_result_statement'],
                'gad_activity' => $mandatesData['gad_activity'],
                'performance_indicators' => $mandatesData['performance_indicators'],
                'target_result' => $mandatesData['target_result'],
                'focus' => $mandatesData['focus'],
            ]);
    
        // Log user creation activity
        activity()->performedOn($mandates)->withProperties(['created' => ['GAD Mandate' => $mandates['gender_issue']]])->log('Mandate Created');

            return response([
                'message' => 'Mandate created successfully',
                'success' => true
            ]);
    
        } catch (\Exception $e) {
            return response([
                'message' => 'Error creating mandates: ' . $e->getMessage(),
                'success' => false
            ]);
        }
    }

public function updatemandates(MandatesRequest $request, $id){
    try {
        // Validate the request data
        $validatedData = $request->validated();

        // Find the Mandates record by its ID
        $mandateData = Mandates::findOrFail($id);

        // Get the original attributes of the Mandate before the update
        $originalAttributes = $mandateData->getAttributes();

        // Update the Mandate with the validated data
        $mandateData->update($validatedData['form_data']);

        // Compare the original attributes with the updated attributes
        $changedFields = [];
        foreach ($originalAttributes as $key => $value) {
            if ($key !== 'updated_at' && $mandateData->{$key} != $value) {
                $changedFields[$key] = [
                    'field' => $key,
                    'old' => $value,
                    'new' => $mandateData->{$key}
                ];
            }
        }

        // Log the update activity with only the changed fields
        activity()
            ->performedOn($mandateData)
            ->withProperties(['changed' => $changedFields])
            ->log('Mandate Updated');

        return response([
            'message' => 'Mandate updated successfully',
            'success' => true
        ]);
    } catch (\Exception $e) {
        return response([
            'message' => 'Error updating mandates: ' . $e->getMessage(),
            'success' => false
        ]);
    }
}
    
    public function archivemandates($id){
        try {
            $mandate = Mandates::find($id);

            $mandate->delete();

            // Log user creation activity
            activity()->performedOn($mandate)->withProperties(['archived' => ['gender_issue' => $mandate['gender_issue']]])->log('Mandate Archive');

            return response([
            'message' => 'Mandate archived successfully',
            'success' => true
        ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error: ' . $e->getMessage(),
                'success' => false
            ]);
        }
    }

    public function restoremandates($id){
        try {
            $mandate = Mandates::withTrashed()
            ->find($id);

            $mandate->restore();

            // Log user creation activity
            activity()->performedOn($mandate)->withProperties(['restored' => ['gender_issue' => $mandate['gender_issue']]])->log('Mandate Restored');

            return response([
                'message' => 'Mandate Restored',
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error: ' . $e->getMessage(),
                'success' => false
            ]);
        }
    }

    public function deletemandates($id){
        $mandate = Mandates::withTrashed()
        ->find($id);

        try {
            $mandate->forceDelete();
            
            // Log user creation activity
            activity()->performedOn($mandate)->withProperties(['deleted' => ['gender_issue' => $mandate['gender_issue']]])->log('Mandate Deleted');

            return response([
                'message' => 'Mandate permanently deleted',
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Error: ' . $e->getMessage(),
                'success' => false
            ]);
        }
    }
    public function showact_mandates(Request $request){
        //$accomplishmentReport = Mandates::with('accReport.actualExpenditure')->get();

        $currentYear = $request->input('content');

        $accomplishmentReport = Mandates::with(['accReport' => function ($query) use ($currentYear) {
            $query->whereYear('created_at', $currentYear);
        }, 'accReport.actualExpenditure'])
        ->get();
        // Fetch mandates but if an acc report wasn't created at the currrent year it will not be fetched

        // Group the data by the 'focus' column value
        $groupedData = $accomplishmentReport->groupBy('focus');

        // Convert the grouped data to an array for easier manipulation
        $splitData = $groupedData->toArray();

        return response($splitData);
    }
}
