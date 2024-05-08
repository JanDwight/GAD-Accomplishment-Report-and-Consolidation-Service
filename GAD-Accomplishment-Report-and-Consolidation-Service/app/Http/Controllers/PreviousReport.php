<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

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
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false
            ]);
        }
    }
    
    public function archivedindex() {
        $backupPath = 'public/archivedPDF'; // Path relative to the storage disk
    
        try {
            // Get an array of all JPEG files in the directory
            $pdfFiles = Storage::files($backupPath);
    
            // Extract only the filenames from the paths
            $filenames = array_map('basename', $pdfFiles);
    
            return response()->json([
                'message' => $filenames,
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

    public function downloadPdf($pdfFileName)
    {
        try {
            // Ensure the path is correctly formatted
            $pdfPath = storage_path('app/public/pdfs/' .  $pdfFileName);
    
            if (file_exists($pdfPath)) {
                // Return the PDF file as a download response
                return response()->download($pdfPath, $pdfFileName);
            } else {
                // PDF file not found, return error response
                return response()->json(['message' => 'PDF file not found'], Response::HTTP_NOT_FOUND);
            }
        } catch (\Exception $e) {
            // Handle any exceptions
            return response()->json(['message' => 'Error downloading PDF', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function archivepdf($pdfFileName)
    {
        $sourcePath = storage_path('app/public/pdfs/' . $pdfFileName);
        $destinationPath = storage_path('app/public/archivedPDF/' . $pdfFileName);
    
        // Check if the source file exists
        if (file_exists($sourcePath)) {
            // Check if the destination directory exists, if not, create it
            if (!file_exists(dirname($destinationPath))) {
                mkdir(dirname($destinationPath), 0755, true);
            }
    
            // Attempt to move the file
            if (rename($sourcePath, $destinationPath)) {
                return response()->json([
                    'message' => 'Archive success',
                    'success' => true
                ]);
            } else {
                return response()->json([
                    'message' => 'Archive Failed',
                    'success' => false
                ]);
            }
        } else {
            return response()->json([
                'message' => 'File does not exist',
                'success' => false
            ]);
        }
    }
    
    public function restorepdf($pdfFileName)
    {
        
        $sourcePath = storage_path('app/public/archivedPDF/' . $pdfFileName);
        $destinationPath = storage_path('app/public/pdfs/' . $pdfFileName);
    
        // Check if the source file exists
        if (file_exists($sourcePath)) {
            // Check if the destination directory exists, if not, create it
            if (!file_exists(dirname($destinationPath))) {
                mkdir(dirname($destinationPath), 0755, true);
            }
    
            // Attempt to move the file
            if (rename($sourcePath, $destinationPath)) {
                return response()->json([
                    'message' => 'Archive success',
                    'success' => true
                ]);
            } else {
                return response()->json([
                    'message' => 'Archive Failed',
                    'success' => false
                ]);
            }
        } else {
            return response()->json([
                'message' => 'File does not exist',
                'success' => false
            ]);
        }
    }

    public function deletepdf($pdfFileName) 
    {
        $filePath = storage_path('app/public/archivedPDF/' . $pdfFileName);
    
        // Check if the file exists
        if (file_exists($filePath)) {
            // Attempt to delete the file
            if (unlink($filePath)) {
                return response()->json([
                    'message' => 'Pdf deleted successfully',
                    'success' => true
                ]);
            } else {
                return response()->json([
                    'message' => 'Failed to delete Pdf',
                    'success' => false
                ]);
            }
        } else {
            return response()->json([
                'message' => 'Pdf does not exist',
                'success' => false
            ]);
        }
    }
    
}
