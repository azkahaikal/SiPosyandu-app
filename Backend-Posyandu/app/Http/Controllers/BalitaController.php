<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BalitaController extends Controller
{
    public function index()
    {
        return Balita::with(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nama_ibu' => 'required_without:user_id|string|max:255',
            'alamat' => 'nullable|string',
            'nama' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'berat_lahir' => 'nullable|numeric',
            'tinggi_lahir' => 'nullable|numeric',
        ]);

        if (empty($validated['user_id'])) {
            $user = User::create([
                'name' => $validated['nama_ibu'],
                'email' => 'ibu-' . Str::uuid() . '@manual.local',
                'password' => Str::random(32),
                'role' => 'user',
            ]);

            $validated['user_id'] = $user->id;
        }

        $balita = Balita::create($validated);
        return response()->json($balita->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']), 201);
    }

    public function show(Balita $balita)
    {
        return $balita->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']);
    }

    public function update(Request $request, Balita $balita)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nama_ibu' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'nama' => 'sometimes|string|max:255',
            'nik' => 'nullable|string|max:20',
            'tanggal_lahir' => 'sometimes|date',
            'jenis_kelamin' => 'sometimes|in:L,P',
            'berat_lahir' => 'nullable|numeric',
            'tinggi_lahir' => 'nullable|numeric',
        ]);

        $balita->update($validated);
        return response()->json($balita->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']));
    }

    public function destroy(Balita $balita)
    {
        $balita->delete();
        return response()->json(null, 204);
    }
}
