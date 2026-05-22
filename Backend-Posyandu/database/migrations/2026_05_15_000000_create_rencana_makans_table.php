<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rencana_makans', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('kategori', ['ibu_hamil', 'ibu_menyusui', 'balita']);
            $table->json('bahan');
            $table->unsignedInteger('kalori')->default(0);
            $table->unsignedInteger('protein')->default(0);
            $table->unsignedInteger('karbohidrat')->default(0);
            $table->unsignedInteger('lemak')->default(0);
            $table->json('alergi')->nullable();
            $table->text('cara_membuat');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rencana_makans');
    }
};
