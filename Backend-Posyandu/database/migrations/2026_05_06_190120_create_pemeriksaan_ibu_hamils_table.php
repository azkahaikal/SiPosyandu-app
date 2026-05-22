<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemeriksaan_ibu_hamils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ibu_hamil_id')->constrained('ibu_hamils')->onDelete('cascade');
            $table->date('tanggal_periksa');
            $table->integer('usia_kandungan')->comment('Dalam minggu');
            $table->float('berat_badan');
            $table->string('tekanan_darah')->nullable();
            $table->integer('denyut_jantung_janin')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemeriksaan_ibu_hamils');
    }
};
