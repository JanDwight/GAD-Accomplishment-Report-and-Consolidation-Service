<?php

namespace App\Http\Controllers;

use App\Http\Requests\MandatesRequest;
use App\Models\Mandates;
use Illuminate\Http\Request;

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
            $mandates = $request->validated('form_data');
    
            Mandates::create([
                'gender_issue' => $mandates['gender_issue'],
                'cause_of_gender_issue' => $mandates['cause_of_gender_issue'],
                'gad_result_statement' => $mandates['gad_result_statement'],
                'gad_activity' => $mandates['gad_activity'],
                'performance_indicators' => $mandates['performance_indicators'],
                'target_result' => $mandates['target_result'],
                'focus' => $mandates['focus'],
            ]);
    
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
            $mandate = $request->validated();

            $mandateData = Mandates::find($id);
    
            $mandateData->update($mandate['form_data']);
            
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
    public function showact_mandates(){
        $accomplishmentReport = Mandates::with('accReport.actualExpenditure')->get();

        // Group the data by the 'focus' column value
        $groupedData = $accomplishmentReport->groupBy('focus');

        // Convert the grouped data to an array for easier manipulation
        $splitData = $groupedData->toArray();

        return response($splitData);
    }
}
