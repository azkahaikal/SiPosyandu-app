<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balita extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama',
        'nik',
        'nama_ibu',
        'alamat',
        'tanggal_lahir',
        'jenis_kelamin',
        'berat_lahir',
        'tinggi_lahir'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pemeriksaans()
    {
        return $this->hasMany(PemeriksaanBalita::class);
    }
}
