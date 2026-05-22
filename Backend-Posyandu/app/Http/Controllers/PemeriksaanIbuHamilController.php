<?php

namespace App\Http\Controllers;

use App\Models\PemeriksaanIbuHamil;
use Illuminate\Http\Request;

class PemeriksaanIbuHamilController extends Controller
{
    public function index()
    {
        return PemeriksaanIbuHamil::with('ibuHamil')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ibu_hamil_id' => 'required|exists:ibu_hamils,id',
            'tanggal_periksa' => 'required|date',
            'usia_kandungan' => 'required|integer',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'nullable|numeric',
            'tekanan_darah' => 'required|string',
            'denyut_jantung_janin' => 'nullable|integer',
            'catatan' => 'nullable|string',
        ]);

        $pemeriksaan = PemeriksaanIbuHamil::create($validated);
        return response()->json($pemeriksaan, 201);
    }

    public function show(PemeriksaanIbuHamil $pemeriksaanIbuHamil)
    {
        return $pemeriksaanIbuHamil->load('ibuHamil');
    }

    public function update(Request $request, PemeriksaanIbuHamil $pemeriksaanIbuHamil)
    {
        $validated = $request->validate([
            'tanggal_periksa' => 'sometimes|date',
            'usia_kandungan' => 'sometimes|integer',
            'berat_badan' => 'sometimes|numeric',
            'tinggi_badan' => 'nullable|numeric',
            'tekanan_darah' => 'sometimes|string',
            'denyut_jantung_janin' => 'nullable|integer',
            'catatan' => 'nullable|string',
        ]);

        $pemeriksaanIbuHamil->update($validated);
        return response()->json($pemeriksaanIbuHamil);
    }

    public function destroy(PemeriksaanIbuHamil $pemeriksaanIbuHamil)
    {
        $pemeriksaanIbuHamil->delete();
        return response()->json(null, 204);
    }
}
