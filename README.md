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

1. **Google Cloud Console ga kiring**: https://console.cloud.google.com/
2. **Yangi loyiha yarating** yoki mavjud loyihani tanlang
3. **APIs & Services > Credentials** ga o'ting
4. **Create Credentials > OAuth client ID** ni tanlang
5. **Application type**: Web application
6. **Authorized JavaScript origins**: `http://localhost:5173`
7. **Authorized redirect URIs**: `http://localhost:5173`
8. **Client ID ni oling** va `.env` fayliga qo'ying:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

**Eslatma**: Production uchun haqiqiy domain qo'shing!
