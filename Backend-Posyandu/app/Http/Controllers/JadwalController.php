<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    public function index()
    {
        return Jadwal::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu' => 'required|string',
            'lokasi' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:akan_datang,selesai,dibatalkan',
        ]);

        $jadwal = Jadwal::create($validated);
        return response()->json($jadwal, 201);
    }

    public function show(Jadwal $jadwal)
    {
        return $jadwal;
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'sometimes|string|max:255',
            'tanggal' => 'sometimes|date',
            'waktu' => 'sometimes|string',
            'lokasi' => 'sometimes|string|max:255',
            'keterangan' => 'nullable|string',
            'status' => 'sometimes|in:akan_datang,selesai,dibatalkan',
        ]);

        $jadwal->update($validated);
        return response()->json($jadwal);
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return response()->json(null, 204);
    }
}
