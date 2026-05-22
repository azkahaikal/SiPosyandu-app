<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ibu_hamils', function (Blueprint $table) {
            $table->string('nama')->nullable()->after('user_id');
            $table->integer('umur')->nullable()->after('nama');
            $table->text('alamat')->nullable()->after('riwayat_penyakit');
        });
    }

    public function down(): void
    {
        Schema::table('ibu_hamils', function (Blueprint $table) {
            $table->dropColumn(['nama', 'umur', 'alamat']);
        });
    }
};
