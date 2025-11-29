# HIDIM - Shaxsiy Parfum Brendi

Zamonaviy landing page va admin panel bilan to'liq funksional parfum brendi veb-sayti.

## Texnologiyalar

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Ma'lumotlar bazasi**: JSON fayl (backend/data.json)

## O'rnatish

### 1. Frontend paketlarini o'rnatish:
```bash
npm install
```

### 2. Ishga tushirish:

Frontend serverni ishga tushirish:
```bash
npm run dev
```

**Eslatma**: Backend allaqachon production da ishlayapti (`https://atir.onrender.com`). Local backend kerak emas.

## Struktura

```
├── src/                    # Frontend kodlar
│   ├── components/         # React komponentlar
│   ├── pages/             # Sahifalar
│   │   └── admin/          # Admin panel sahifalari
│   └── services/           # API servislar (https://atir.onrender.com/api ga ulangan)
└── package.json            # Frontend dependencies
```

## API Endpoints

- `GET /api/orders` - Barcha buyurtmalar
- `POST /api/orders` - Yangi buyurtma yaratish
- `PUT /api/orders/:id` - Buyurtmani yangilash
- `GET /api/customers` - Barcha mijozlar
- `GET /api/profiles` - Barcha hid profillari
- `GET /api/discounts` - Barcha promo kodlar
- `GET /api/feedback` - Barcha feedbacklar
- `GET /api/surveys` - Barcha surovnomalar
- `GET /api/settings` - Sozlamalar
- `GET /api/dashboard/stats` - Dashboard statistikasi

## Funksiyalar

### Landing Page
- Hero bo'limi
- "Qanday ishlaydi?" bo'limi
- Probnik bloki
- Hid yo'nalishlari
- Narxlar
- Mijoz fikrlari
- FAQ
- Kontakt formasi
- Gmail orqali ro'yxatdan o'tish

### Survey Page
- To'liq surovnoma formasi
- Barcha maydonlar validatsiyasi
- API ga yuborish

### Admin Panel
- Dashboard (statistika)
- Buyurtmalar boshqaruvi
- Mijozlar ro'yxati
- Hid profillari boshqaruvi
- Chegirmalar boshqaruvi
- Feedback ko'rish
- Sozlamalar

## Ishlatish

1. **Backend server** production da ishlaydi: `https://atir.onrender.com`
2. **Frontend** `http://localhost:5173` da ishlaydi (development)
3. **Admin panelga kirish** (maxfiy usullar):
   - **Variant 1**: URL parametr orqali - `http://localhost:5173?admin=true` yoki `?admin=1`
   - **Variant 2**: Hash orqali - `http://localhost:5173#admin`
   - **Variant 3**: HIDIM logotipiga 5 marta ketma-ket bosish (header da)

## Eslatma

- Backend production serverni Render.com da deploy qilingan
- Barcha API so'rovlar `https://atir.onrender.com/api` ga yuboriladi
- Ma'lumotlar production serverni ma'lumotlar bazasida saqlanadi

## Qo'shimcha ma'lumot

- Backend production da: `https://atir.onrender.com`
- API URL: `https://atir.onrender.com/api`
- Frontend va backend mustaqil ishlaydi

## Google OAuth 2.0 Sozlash

Gmail orqali ro'yxatdan o'tish uchun Google OAuth Client ID kerak:

### Client ID va Secret:
- **Client ID**: `.env` faylida `VITE_GOOGLE_CLIENT_ID` sifatida saqlanadi
- **Client Secret**: Backend uchun kerak emas (frontend faqat Client ID ishlatadi)

### Frontend sozlash:

1. **`.env` fayl yarating** (loyiha ildizida):
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

2. **Google Cloud Console sozlash**:
   - https://console.cloud.google.com/ → APIs & Services > Credentials
   - OAuth 2.0 Client ID ni tekshiring
   - **Authorized JavaScript origins** ga qo'shing:
     - `http://localhost:5173` (development)
     - Production domain (agar mavjud bo'lsa)
   - **Authorized redirect URIs** ga qo'shing:
     - `http://localhost:5173` (development)
     - Production domain (agar mavjud bo'lsa)

3. **Paket o'rnatish** (agar o'rnatilmagan bo'lsa):
   ```bash
   npm install @react-oauth/google
   ```

### Qanday ishlaydi:

1. Foydalanuvchi "Google orqali ro'yxatdan o'tish" tugmasini bosadi
2. Google OAuth popup ochiladi
3. Foydalanuvchi Gmail akkauntini tanlaydi
4. Google user ma'lumotlari olinadi
5. Mijoz avtomatik ro'yxatdan o'tadi

**Eslatma**: 
- Faqat Gmail akkauntlari qabul qilinadi
- Client Secret backend da ishlatilmaydi (faqat frontend OAuth)
- Production uchun haqiqiy domain qo'shing!
