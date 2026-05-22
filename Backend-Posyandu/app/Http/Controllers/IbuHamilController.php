<?php

namespace App\Http\Controllers;

use App\Models\IbuHamil;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IbuHamilController extends Controller
{
    public function index()
    {
        return IbuHamil::with(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nama' => 'required_without:user_id|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'usia_kehamilan_awal' => 'required|integer',
            'hpl' => 'required|date',
            'riwayat_penyakit' => 'nullable|string',
            'alamat' => 'nullable|string',
        ]);

        if (empty($validated['user_id'])) {
            $user = User::create([
                'name' => $validated['nama'],
                'email' => 'ibu-hamil-' . Str::uuid() . '@manual.local',
                'password' => Str::random(32),
                'role' => 'user',
            ]);

            $validated['user_id'] = $user->id;
        }

        $ibuHamil = IbuHamil::create($validated);
        return response()->json($ibuHamil->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']), 201);
    }

    public function show(IbuHamil $ibuHamil)
    {
        return $ibuHamil->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']);
    }

    public function update(Request $request, IbuHamil $ibuHamil)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nama' => 'nullable|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'usia_kehamilan_awal' => 'sometimes|integer',
            'hpl' => 'sometimes|date',
            'riwayat_penyakit' => 'nullable|string',
            'alamat' => 'nullable|string',
        ]);

        $ibuHamil->update($validated);
        return response()->json($ibuHamil->load(['pemeriksaans' => function($query) {
            $query->latest();
        }, 'user']));
    }

    public function destroy(IbuHamil $ibuHamil)
    {
        $ibuHamil->delete();
        return response()->json(null, 204);
    }
}
