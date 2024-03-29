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
        Schema::create('expenditures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('forms_id')->constrained('forms')->onDelete('cascade'); //form_employee_id
            $table->string('type', 1000)->default('OTHERS');
            $table->string('items', 1000);
            $table->string('per_item')->nullable();
            $table->string('no_item')->nullable();
            $table->string('times')->nullable();
            $table->string('per_head_per_day')->nullable();
            $table->string('estimated_cost')->nullable();
            $table->string('remarks', 1000)->nullable();
            $table->string('source_of_funds', 1000)->nullable();
            $table->string('actual_cost')->nullable();
            $table->string('total')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenditures');
    }
};
