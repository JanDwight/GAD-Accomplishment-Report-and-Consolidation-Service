<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            //employee
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('form_type')->default('FORM');
            $table->string('title', 1000)->unique();
            $table->string('purpose', 1000)->nullable();
            $table->string('legal_bases', 1000)->nullable();
            $table->string('date_of_activity', 1000);
            $table->string('venue', 1000);
            $table->string('participants', 1000)->nullable();
            $table->string('participants_male')->nullable();
            $table->string('participants_female')->nullable();
            $table->string('no_of_target_participants')->nullable();
            $table->string('learning_service_providers', 1000)->nullable();
            $table->string('expected_outputs', 1000);
            $table->string('fund_source', 1000);
            
            //inset ---> has no unique columns
           
            //research/EAD
            $table->string('clientele_type_and_number', 1000)->nullable();
            $table->string('estimated_cost')->nullable();
            $table->string('cooperating_agencies_units', 1000)->nullable();
            $table->string('proponents_implementors', 1000)->default('IMPLEMENTOR');
            $table->string('date_and_venue', 1000)->nullable();
            $table->string('program_title', 1000)->nullable();
            $table->string('project_title', 500)->nullable();
            $table->string('comp_status')->default('Pending'); 
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
