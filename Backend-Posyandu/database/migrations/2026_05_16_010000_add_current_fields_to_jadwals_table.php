<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jadwals', function (Blueprint $table) {
            if (!Schema::hasColumn('jadwals', 'nama_kegiatan')) {
                $table->string('nama_kegiatan')->nullable()->after('id');
            }

            if (!Schema::hasColumn('jadwals', 'keterangan')) {
                $table->text('keterangan')->nullable()->after('lokasi');
            }

            if (!Schema::hasColumn('jadwals', 'status')) {
                $table->string('status')->default('akan_datang')->after('keterangan');
            }
        });

        if (Schema::hasColumn('jadwals', 'jenis')) {
            DB::table('jadwals')
                ->whereNull('nama_kegiatan')
                ->update(['nama_kegiatan' => DB::raw('jenis')]);
        }

        if (Schema::hasColumn('jadwals', 'deskripsi')) {
            DB::table('jadwals')
                ->whereNull('keterangan')
                ->update(['keterangan' => DB::raw('deskripsi')]);
        }

        DB::table('jadwals')
            ->whereNull('status')
            ->update(['status' => 'akan_datang']);
    }

    public function down(): void
    {
        Schema::table('jadwals', function (Blueprint $table) {
            if (Schema::hasColumn('jadwals', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('jadwals', 'keterangan')) {
                $table->dropColumn('keterangan');
            }

            if (Schema::hasColumn('jadwals', 'nama_kegiatan')) {
                $table->dropColumn('nama_kegiatan');
            }
        });
    }
};
