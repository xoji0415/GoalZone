# ⚽ GoalZone — Futbol Dunyosi

Futbol mavzusidagi interaktiv veb-sayt. Flask bilan yozilgan.

## 🎮 O'yinlar va xususiyatlar

- 🧠 **Futbol Viktorinasi** — 15+ savol, 3 qiyinlik darajasi, timer, ball tizimi
- 🥅 **Penalti O'yini** — Darvozabonga qarshi, 5 urinish
- 🃏 **Xotira O'yini** — Futbol klublari logolarini toping
- 🔢 **Taxmin O'yini** — Futbolchi raqamini toping
- 🏆 **Rekordlar Taxtasi** — Eng yaxshi o'yinchilar
- 💡 **Kun Fakti** — Har safar yangi futbol fakti

## 🚀 Lokal ishga tushirish

```bash
pip install -r requirements.txt
python app.py
```

Brauzerda `http://localhost:5000` ni oching.

## 📦 GitHub Pages uchun sozlash

Bu sayt Flask (Python backend) ishlatadi. GitHub Pages faqat statik saytlarni qo'llab-quvvatlaydi. 
**Ikki variant:**

### Variant 1: Render.com (bepul, oson)
1. [render.com](https://render.com) da ro'yxatdan o'ting
2. "New Web Service" → GitHub reponi ulang
3. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
4. Deploy!

### Variant 2: Railway.app (bepul)
1. [railway.app](https://railway.app) da ro'yxatdan o'ting
2. "New Project" → "Deploy from GitHub repo"
3. Avtomatik deploy bo'ladi!

## 🔧 GitHub ga push qilish

```bash
git init
git add .
git commit -m "⚽ GoalZone futbol sayti"
git branch -M main
git remote add origin https://github.com/USERNAME/goalzone.git
git push -u origin main
```

## 📁 Fayl tuzilmasi

```
football-site/
├── app.py              # Flask backend
├── requirements.txt    # Python kutubxonalari
├── templates/
│   └── index.html     # Asosiy HTML
└── static/
    ├── css/
    │   └── style.css  # Barcha stilllar
    └── js/
        └── main.js    # O'yin mantiqiy qismi
```
# GoalZone
