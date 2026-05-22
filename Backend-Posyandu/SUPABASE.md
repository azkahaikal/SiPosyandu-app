# Menggunakan Supabase sebagai Database

Backend ini tetap memakai Laravel API dan Eloquent. Supabase dipakai sebagai PostgreSQL database, jadi frontend React tetap memanggil endpoint Laravel seperti sebelumnya.

## 1. Buat project Supabase

1. Buka dashboard Supabase.
2. Buat project baru.
3. Simpan password database yang dibuat saat project dibuat.
4. Buka menu **Project Settings > Database > Connection string** atau **Connection parameters**.

## 2. Isi file `.env`

Copy `.env.example` menjadi `.env`, lalu ganti bagian database:

```env
DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-database-password
DB_SCHEMA=public
DB_SSLMODE=require
```

Jika Supabase memberikan host/port pooler, nilai itu juga bisa dipakai. Pastikan username, password, host, dan port sama dengan yang ada di dashboard Supabase.

## 3. Jalankan migrasi

Pastikan dependency backend sudah terpasang, lalu jalankan:

```bash
composer install
php artisan key:generate
php artisan migrate
```

Untuk mengisi ulang database dari awal saat pengembangan:

```bash
php artisan migrate:fresh
```

## 4. Jalankan backend

```bash
php artisan serve
```

Frontend saat ini memanggil API di `http://localhost:8000/api`, jadi backend perlu berjalan di port 8000.

