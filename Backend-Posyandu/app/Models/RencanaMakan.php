<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RencanaMakan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'kategori',
        'bahan',
        'kalori',
        'protein',
        'karbohidrat',
        'lemak',
        'alergi',
        'cara_membuat',
    ];

    protected $casts = [
        'bahan' => 'array',
        'alergi' => 'array',
    ];
}
