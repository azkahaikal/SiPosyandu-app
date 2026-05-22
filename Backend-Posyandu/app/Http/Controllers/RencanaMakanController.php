<?php

namespace App\Http\Controllers;

use App\Models\RencanaMakan;
use Illuminate\Http\Request;

class RencanaMakanController extends Controller
{
    public function index()
    {
        return RencanaMakan::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|in:ibu_hamil,ibu_menyusui,balita',
            'bahan' => 'required|array|min:1',
            'bahan.*' => 'required|string|max:255',
            'kalori' => 'required|integer|min:0',
            'protein' => 'required|integer|min:0',
            'karbohidrat' => 'required|integer|min:0',
            'lemak' => 'required|integer|min:0',
            'alergi' => 'nullable|array',
            'alergi.*' => 'nullable|string|max:255',
            'cara_membuat' => 'required|string',
        ]);

        $rencanaMakan = RencanaMakan::create($validated);
        return response()->json($rencanaMakan, 201);
    }

    public function show(RencanaMakan $rencanaMakan)
    {
        return $rencanaMakan;
    }

    public function update(Request $request, RencanaMakan $rencanaMakan)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kategori' => 'sometimes|in:ibu_hamil,ibu_menyusui,balita',
            'bahan' => 'sometimes|array|min:1',
            'bahan.*' => 'required|string|max:255',
            'kalori' => 'sometimes|integer|min:0',
            'protein' => 'sometimes|integer|min:0',
            'karbohidrat' => 'sometimes|integer|min:0',
            'lemak' => 'sometimes|integer|min:0',
            'alergi' => 'nullable|array',
            'alergi.*' => 'nullable|string|max:255',
            'cara_membuat' => 'sometimes|string',
        ]);

        $rencanaMakan->update($validated);
        return response()->json($rencanaMakan);
    }

    public function destroy(RencanaMakan $rencanaMakan)
    {
        $rencanaMakan->delete();
        return response()->json(null, 204);
    }
}
