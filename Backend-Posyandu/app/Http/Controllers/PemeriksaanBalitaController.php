<?php

namespace App\Http\Controllers;

use App\Models\PemeriksaanBalita;
use Illuminate\Http\Request;

class PemeriksaanBalitaController extends Controller
{
    public function index()
    {
        return PemeriksaanBalita::with('balita')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'tanggal_periksa' => 'required|date',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_kepala' => 'nullable|numeric',
            'status_gizi' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ]);

        $pemeriksaan = PemeriksaanBalita::create($validated);
        return response()->json($pemeriksaan, 201);
    }

    public function show(PemeriksaanBalita $pemeriksaanBalita)
    {
        return $pemeriksaanBalita->load('balita');
    }

    public function update(Request $request, PemeriksaanBalita $pemeriksaanBalita)
    {
        $validated = $request->validate([
            'tanggal_periksa' => 'sometimes|date',
            'berat_badan' => 'sometimes|numeric',
            'tinggi_badan' => 'sometimes|numeric',
            'lingkar_kepala' => 'nullable|numeric',
            'status_gizi' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ]);

        $pemeriksaanBalita->update($validated);
        return response()->json($pemeriksaanBalita);
    }

    public function destroy(PemeriksaanBalita $pemeriksaanBalita)
    {
        $pemeriksaanBalita->delete();
        return response()->json(null, 204);
    }
}
