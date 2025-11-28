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

### 2. Backend paketlarini o'rnatish:
```bash
cd backend
npm install
cd ..
```

### 3. Ishga tushirish:

**Variant 1: Alohida terminalda**

Backend serverni ishga tushirish:
```bash
cd backend
npm start
```

Yangi terminalda frontend serverni ishga tushirish:
```bash
npm run dev
```

**Variant 2: Bir vaqtda (ikkalasini birga)**
```bash
npm run dev:all
```

## Struktura

```
├── src/                    # Frontend kodlar
│   ├── components/         # React komponentlar
│   ├── pages/             # Sahifalar
│   │   └── admin/          # Admin panel sahifalari
│   └── services/           # API servislar
├── backend/                # Backend kodlar
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── data.json           # Ma'lumotlar bazasi (avtomatik yaratiladi)
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

1. Backend server `http://localhost:3001` da ishlaydi
2. Frontend `http://localhost:5173` da ishlaydi
3. Admin panelga kirish (maxfiy usullar):
   - **Variant 1**: URL parametr orqali - `http://localhost:5173?admin=true` yoki `?admin=1`
   - **Variant 2**: Hash orqali - `http://localhost:5173#admin`
   - **Variant 3**: HIDIM logotipiga 5 marta ketma-ket bosish (header da)

## Eslatma

Barcha ma'lumotlar `backend/data.json` faylida saqlanadi. Bu fayl avtomatik yaratiladi va yangilanadi.

## Qo'shimcha ma'lumot

- Backend alohida `backend/` papkasida joylashgan
- Backend o'z `package.json` va `node_modules` ga ega
- Frontend va backend mustaqil ishlaydi
- API URL: `http://localhost:3001/api`

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
