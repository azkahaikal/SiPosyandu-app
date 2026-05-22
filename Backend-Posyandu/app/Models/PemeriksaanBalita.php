<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemeriksaanBalita extends Model
{
    use HasFactory;

    protected $fillable = [
        'balita_id',
        'tanggal_periksa',
        'berat_badan',
        'tinggi_badan',
        'lingkar_kepala',
        'status_gizi',
        'catatan'
    ];

    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }
}
