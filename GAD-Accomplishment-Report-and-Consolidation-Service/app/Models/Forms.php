<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Forms extends Model
{
    use HasFactory, softDeletes;

    protected $table = 'forms';

    protected $fillable = [
        'title',
        'user_id',
        'form_type',
        'purpose',
        'legal_bases',
        'date_of_activity',
        'venue',
        'participants',
        'participants_male',
        'participants_female',
        'no_of_target_participants',
        'learning_service_providers',
        'expected_outputs',
        'fund_source',
        'clientele_type',
        'clientele_number',
        'estimated_cost',
        'cooperating_agencies_units',
        'proponents_implementors',

        //For EAD Form
        'program_title',
        'project_title',
        'date_and_venue',
        'clientele_type_and_number',
        'comp_status',
    ];

    // BELONGS TO USER
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    //FOR ACCOMPLISHMENT REPORTS + EXPENDITURE
        public function accReport(): HasOne
        {
            return $this->hasOne(accReport::class);
        }

        public function expenditures(): HasMany
        {
            return $this->hasMany(Expenditures::class);
        }

}
