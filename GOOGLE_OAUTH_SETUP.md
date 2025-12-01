# Google OAuth Sozlash - redirect_uri_mismatch Xatosini Tuzatish

## Muammo
`redirect_uri_mismatch` xatosi chiqyapti. Bu Google Cloud Console'da redirect URI sozlanmaganligini anglatadi.

## Yechim

### 1. Google Cloud Console'ga kiring
1. https://console.cloud.google.com/ ga kiring
2. To'g'ri loyihani tanlang (yoki yangi yarating)
3. **APIs & Services** → **Credentials** ga o'ting

### 2. OAuth 2.0 Client ID ni oching
- OAuth 2.0 Client ID ni toping: `842416852674-j61hmt21t7vlc33h5rlm0h9ln28qpf1s.apps.googleusercontent.com`
- Yoki yangi OAuth 2.0 Client ID yarating

### 3. Authorized JavaScript origins qo'shing
**Authorized JavaScript origins** bo'limiga quyidagilarni qo'shing:
```
http://localhost:5173
http://localhost:3000
```

### 4. Authorized redirect URIs qo'shing (MUHIM!)
**Authorized redirect URIs** bo'limiga quyidagilarni qo'shing:
```
http://localhost:5173
http://localhost:5173/
http://localhost:3000
http://localhost:3000/
```

**Eslatma**: 
- Har ikkala variantni qo'shing (slash bilan va slash siz)
- Agar boshqa port ishlatilsa, uni ham qo'shing

### 5. O'zgarishlarni saqlang
- **SAVE** tugmasini bosing
- 5-10 daqiqa kutib turing (Google sozlamalarni yangilash uchun vaqt kerak)
- Brauzerni yopib, qayta oching
- Web saytni qayta yuklang (`Ctrl + Shift + R` yoki `Cmd + Shift + R`)

### 6. Sinab ko'ring
- Web saytda "Google orqali ro'yxatdan o'tish" tugmasini bosing
- Endi xatolik bo'lmasligi kerak

## Qo'shimcha tekshiruvlar

### Agar hali ham ishlamasa:

1. **Client ID ni tekshiring**:
   - `.env` faylida `VITE_GOOGLE_CLIENT_ID` to'g'ri Client ID ga tengligini tekshiring
   - Console'da `console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)` ni tekshiring

2. **Portni tekshiring**:
   - Vite development server qaysi portda ishlayapti?
   - `http://localhost:5173` yoki boshqa port?
   - Google Cloud Console'da shu portni qo'shing

3. **Brauzer cache ni tozalang**:
   - `Ctrl + Shift + Delete` (Windows) yoki `Cmd + Shift + Delete` (Mac)
   - Cache va cookies ni tozalang

4. **Incognito/Private mode da sinab ko'ring**:
   - Yangi incognito oyna oching
   - Web saytni oching va sinab ko'ring

## Production uchun

Production'ga deploy qilganda:
1. Production domain ni Google Cloud Console'ga qo'shing:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**: `https://yourdomain.com`
2. `.env` faylida `VITE_GOOGLE_CLIENT_ID` ni tekshiring









