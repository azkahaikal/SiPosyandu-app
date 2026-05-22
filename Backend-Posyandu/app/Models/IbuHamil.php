<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IbuHamil extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama',
        'umur',
        'usia_kehamilan_awal',
        'hpl',
        'riwayat_penyakit',
        'alamat'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pemeriksaans()
    {
        return $this->hasMany(PemeriksaanIbuHamil::class);
    }
}
