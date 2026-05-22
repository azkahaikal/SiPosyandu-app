<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pemeriksaan_ibu_hamils', function (Blueprint $table) {
            $table->float('tinggi_badan')->nullable()->after('berat_badan');
        });
    }

    public function down(): void
    {
        Schema::table('pemeriksaan_ibu_hamils', function (Blueprint $table) {
            $table->dropColumn('tinggi_badan');
        });
    }
};
