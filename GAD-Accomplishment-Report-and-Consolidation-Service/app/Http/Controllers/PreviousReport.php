<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Dompdf\Dompdf;

class PreviousReport extends Controller
{
    public function index() {
        $backupPath = 'public/pdfs'; // Path relative to the storage disk
    
        try {
            // Get an array of all JPEG files in the directory
            $pdfFiles = Storage::files($backupPath);
    
            // Extract only the filenames from the paths
            $filenames = array_map('basename', $pdfFiles);
    
            return response()->json([
                'message' => $filenames,
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false
            ]);
        }
    }
    
    public function storepdf(Request $request) {
        // Validate the request
        $request->validate([
            'pdfs' => 'required|array',
            'pdfs.*' => 'required|mimes:pdf|max:10240', // Maximum file size is 10MB (10240 KB)
        ]);
    
        $pdfModels = [];
        foreach ($request->file('pdfs') as $pdf) {
            // Get the original filename
            $originalFilename = $pdf->getClientOriginalName();
    
            // Store each PDF in the storage directory with the original filename
            $storedPdfPath = $pdf->storeAs('public/pdfs', $originalFilename);
            $fullPdfPath = Storage::url($storedPdfPath);
    
            // Create an array of attributes for each PDF
            $pdfModels[] = [
                'original_path' => $fullPdfPath
            ];
        }
    
        return response()->json([
            'message' => 'Upload success',
            'success' => true
        ]);
    }
    
}
