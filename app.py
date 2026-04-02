from flask import Flask, render_template, jsonify, request
import random
import json

app = Flask(__name__)

QUESTIONS = [
    {"id": 1, "question": "Qaysi davlat FIFA Jahon Chempionatini eng ko'p marta yutgan?", "options": ["Argentina", "Braziliya", "Germaniya", "Italiya"], "answer": 1, "fact": "Braziliya 5 marta (1958, 1962, 1970, 1994, 2002) jahon chempioni bo'lgan!"},
    {"id": 2, "question": "Lionel Messi qaysi klub bilan o'z karerasini boshlagan?", "options": ["Real Madrid", "Barcelona", "Paris SG", "Newell's Old Boys"], "answer": 1, "fact": "Messi 13 yoshida Barcelona akademiyasiga qo'shilgan va La Masia'da voyaga yetgan."},
    {"id": 3, "question": "Cristiano Ronaldo necha marta Ballon d'Or mukofotini olgan?", "options": ["3 marta", "4 marta", "5 marta", "6 marta"], "answer": 2, "fact": "CR7 2008, 2013, 2014, 2016, 2017 yillarda Ballon d'Or sovrini qo'lga kiritgan."},
    {"id": 4, "question": "UEFA Champions League kimlar o'rtasida o'tkaziladi?", "options": ["Milliy terma jamoalar", "Yevropa klublar", "Jahon klublari", "A va B javob"], "answer": 1, "fact": "UCL — Yevropaning eng nufuzli klub turniri, har yili o'tkaziladi."},
    {"id": 5, "question": "Pelé qaysi mamlakatning futbolchisi?", "options": ["Argentina", "Urugvay", "Braziliya", "Kolumbiya"], "answer": 2, "fact": "Pelé (Edson Arantes do Nascimento) — 3 marta jahon chempioni bo'lgan braziliyalik afsonaviy futbolchi."},
    {"id": 6, "question": "Qaysi klub eng ko'p Champions League yutgan?", "options": ["Barcelona", "Bayern Munich", "Real Madrid", "Liverpool"], "answer": 2, "fact": "Real Madrid 14 marta Champions League kubogini ko'tardi — bu rekord!"},
    {"id": 7, "question": "Premier League necha jamoadan iborat?", "options": ["16", "18", "20", "22"], "answer": 2, "fact": "Premier League 1992 yildan boshlab 20 jamoa bilan o'tkaziladi."},
    {"id": 8, "question": "Jahon Chempionati qancha yilda bir marta bo'ladi?", "options": ["2 yilda bir", "4 yilda bir", "3 yilda bir", "6 yilda bir"], "answer": 1, "fact": "FIFA Jahon Chempionati 1930 yildan boshlab har 4 yilda bir o'tkaziladi."},
    {"id": 9, "question": "O'zbekiston futbol terma jamoasi qaysi konfederatsiyaga kiradi?", "options": ["UEFA", "AFC", "CONMEBOL", "CAF"], "answer": 1, "fact": "O'zbekiston Osiyo futbol konfederatsiyasi (AFC) a'zosi va Osiyo Kubogida ishtirok etadi."},
    {"id": 10, "question": "Offside qoidasi futbolda nimani anglatadi?", "options": ["Darvoza orqasida turish", "Raqib yarim maydonida hujumchi himoyachilardan oldin turishi", "Topardan chiqib ketish", "Himoyachini itarish"], "answer": 1, "fact": "Offside — eng murakkab futbol qoidalaridan biri, u raqib darvozasiga yaqin noto'g'ri pozitsiyani taqiqlaydi."},
    {"id": 11, "question": "2022 FIFA Jahon Chempionati qayerda o'tkazildi?", "options": ["Rossiya", "Qatar", "BAA", "Saudiya Arabistoni"], "answer": 1, "fact": "Qatar 2022 yil Jahon Chempionatiga mezbon bo'lgan birinchi Arab davlati."},
    {"id": 12, "question": "Futbol o'yinida standart vaqt necha daqiqa?", "options": ["80 daqiqa", "90 daqiqa", "100 daqiqa", "120 daqiqa"], "answer": 1, "fact": "Futbol o'yini 2 ta 45 daqiqalik qismdan iborat, jami 90 daqiqa."},
    {"id": 13, "question": "Goldan keyin futbolchi nima qilishi taqiqlanadi?", "options": ["Yugurish", "Bayroqqa chiqish", "Kiyimni yechib tashlash", "C va D javob"], "answer": 2, "fact": "FIFA qoidasiga ko'ra, futbolchi gol urganidan keyin kiyimini echsa, sariq karta oladi."},
    {"id": 14, "question": "Ronaldo qaysi raqamli futbolka kiyib mashhur bo'ldi?", "options": ["9", "7", "10", "11"], "answer": 1, "fact": "Cristiano Ronaldo 7-raqam bilan ajralib turadi — Manchester United, Real Madrid va Miliy jamoada."},
    {"id": 15, "question": "Maradona eng mashhur goli 'Xudoning qo'li' qaysi o'yinda bo'ldi?", "options": ["Braziliyaga qarshi", "Italiyaga qarshi", "Angliyaga qarshi", "Germaniyaga qarshi"], "answer": 2, "fact": "1986 Jahon Chempionatida chorak finalda Maradona Angliyaga qarshi ikkala noyob gol urdi."},
]

FOOTBALL_FACTS = [
    "⚽ Birinchi rasmiy futbol o'yini 1872 yilda Shotlandiya va Angliya o'rtasida bo'lgan.",
    "🏆 Braziliya — yagona 5 marta jahon chempioni bo'lgan davlat.",
    "👟 Futbol to'pi dastlab qo'zining pufagi bilan to'ldirilgan charm to'p bo'lgan.",
    "🎯 Penalti urinishi 11 metrdan amalga oshiriladi.",
    "🌍 Futbol — dunyodagi eng ommabop sport, 250 milliondan ortiq o'yinchi bor.",
    "⭐ Messi 2023 yilda rekord 8-chi Ballon d'Or'ini qo'lga kiritdi.",
    "🏟️ Camp Nou — Yevropaning eng katta futbol stadioni (99,354 o'rin).",
    "🇺🇿 O'zbekiston 2023 Osiyo Kubogida yarim finalga chiqdi!",
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    count = int(request.args.get('count', 10))
    shuffled = random.sample(QUESTIONS, min(count, len(QUESTIONS)))
    return jsonify(shuffled)

@app.route('/api/fact')
def get_fact():
    return jsonify({"fact": random.choice(FOOTBALL_FACTS)})

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def leaderboard():
    # In-memory leaderboard (resets on restart — for production use a DB)
    if not hasattr(app, 'scores'):
        app.scores = []
    
    if request.method == 'POST':
        data = request.json
        app.scores.append({"name": data.get("name", "Noma'lum"), "score": data.get("score", 0)})
        app.scores.sort(key=lambda x: x["score"], reverse=True)
        app.scores = app.scores[:10]
        return jsonify({"success": True})
    
    return jsonify(app.scores)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
