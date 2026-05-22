<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('balitas', function (Blueprint $table) {
            $table->string('nama_ibu')->nullable()->after('nik');
            $table->text('alamat')->nullable()->after('nama_ibu');
        });
    }

    public function down(): void
    {
        Schema::table('balitas', function (Blueprint $table) {
            $table->dropColumn(['nama_ibu', 'alamat']);
        });
    }
};
