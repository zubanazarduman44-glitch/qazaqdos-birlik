// Aqyl чатының режимдері (11 тіл): сөйлесу, жазуды түзету, айтылымды тексеру.
// Қолданылуы: /app/qyran (режим қойындылары), басты беттегі «Түзету» тақтайшасы.
const L = {
  kk: { group: "Aqyl-мен жұмыс түрі", chat: "Сөйлесу", write: "Жазуымды түзет", speak: "Айтылымды тексер" },
  ru: { group: "Режим работы с Aqyl", chat: "Разговор", write: "Исправь мой текст", speak: "Проверь произношение" },
  en: { group: "Aqyl mode", chat: "Chat", write: "Fix my writing", speak: "Check my pronunciation" },
  zh: { group: "Aqyl 模式", chat: "聊天", write: "修改我的写作", speak: "检查我的发音" },
  es: { group: "Modo de Aqyl", chat: "Conversar", write: "Corrige mi texto", speak: "Revisa mi pronunciación" },
  de: { group: "Aqyl-Modus", chat: "Gespräch", write: "Text korrigieren", speak: "Aussprache prüfen" },
  fr: { group: "Mode Aqyl", chat: "Discuter", write: "Corrige mon texte", speak: "Vérifie ma prononciation" },
  tr: { group: "Aqyl modu", chat: "Sohbet", write: "Yazımı düzelt", speak: "Telaffuzumu kontrol et" },
  ar: { group: "وضع Aqyl", chat: "محادثة", write: "صحّح كتابتي", speak: "افحص نطقي" },
  ko: { group: "Aqyl 모드", chat: "대화", write: "글 고치기", speak: "발음 확인" },
  ja: { group: "Aqylのモード", chat: "会話", write: "作文を添削", speak: "発音をチェック" },
};

export const modeL = (lang) => L[lang] || L.en;
export const MODES = ["chat", "write", "speak"];

// Чаттың ықшам құралдары (сурет, микрофон) және адамға түсінікті қате хабарлары (11 тіл).
// Сервердің техникалық мәтіні (мысалы, «GEMINI_API_KEY бапталмаған») пайдаланушыға көрсетілмейді.
const T = {
  kk: { photo: "Сурет", photoAsk: "Суретпен сұрау", mic: "Дауыспен жазу", micStop: "Жазуды тоқтату", camOff: "Камера ашылмады — суретті галереядан таңда.", ai: "Aqyl қазір жауап бере алмай тұр. Сәлден соң қайталап көр.", busy: "Aqyl-ға қазір сұрақ көп түсіп жатыр. Бір минуттан кейін қайталап көр.", net: "Интернет байланысы үзілді. Желіні тексеріп, қайталап көр.", micDenied: "Микрофонға рұқсат жоқ. Браузер баптауларынан рұқсат бер.", noMic: "Бұл браузерде микрофон жұмыс істемейді. Мәтінмен жазып көр.", audio: "Дауыс анық жазылмады. Қайта айтып көр.", image: "Сурет тым үлкен. Кішірек суретті таңда." },
  ru: { photo: "Фото", photoAsk: "Спросить по фото", mic: "Надиктовать", micStop: "Остановить запись", camOff: "Камера не открылась — выберите фото из галереи.", ai: "Aqyl сейчас не может ответить. Попробуйте чуть позже.", busy: "Aqyl сейчас получает слишком много вопросов. Повторите через минуту.", net: "Нет соединения с интернетом. Проверьте сеть и попробуйте снова.", micDenied: "Нет доступа к микрофону. Разрешите его в настройках браузера.", noMic: "В этом браузере микрофон не работает. Напишите текстом.", audio: "Голос записался неразборчиво. Скажите ещё раз.", image: "Фото слишком большое. Выберите фото поменьше." },
  en: { photo: "Photo", photoAsk: "Ask with a photo", mic: "Dictate", micStop: "Stop recording", camOff: "The camera didn't open — pick a photo from your gallery.", ai: "Aqyl can't answer right now. Please try again in a moment.", busy: "Aqyl is getting a lot of questions right now. Try again in a minute.", net: "You seem to be offline. Check your connection and try again.", micDenied: "No microphone access. Allow it in your browser settings.", noMic: "The microphone doesn't work in this browser. Try typing instead.", audio: "The recording wasn't clear. Please say it again.", image: "That photo is too large. Pick a smaller one." },
  zh: { photo: "照片", photoAsk: "用照片提问", mic: "语音输入", micStop: "停止录音", camOff: "相机无法打开——请从相册选择照片。", ai: "Aqyl 暂时无法回答，请稍后再试。", busy: "Aqyl 现在收到的问题太多，请一分钟后再试。", net: "网络已断开，请检查网络后重试。", micDenied: "无法使用麦克风，请在浏览器设置中允许访问。", noMic: "此浏览器不支持麦克风，请改用文字输入。", audio: "录音不够清楚，请再说一遍。", image: "照片太大，请选择小一点的照片。" },
  es: { photo: "Foto", photoAsk: "Preguntar con una foto", mic: "Dictar", micStop: "Detener grabación", camOff: "La cámara no se abrió: elige una foto de la galería.", ai: "Aqyl no puede responder ahora. Inténtalo de nuevo en un momento.", busy: "Aqyl está recibiendo muchas preguntas. Vuelve a intentarlo en un minuto.", net: "No hay conexión a internet. Revisa la red e inténtalo de nuevo.", micDenied: "No hay acceso al micrófono. Permítelo en los ajustes del navegador.", noMic: "El micrófono no funciona en este navegador. Prueba a escribir.", audio: "La grabación no se entendió bien. Dilo otra vez.", image: "La foto es demasiado grande. Elige una más pequeña." },
  de: { photo: "Foto", photoAsk: "Mit Foto fragen", mic: "Diktieren", micStop: "Aufnahme beenden", camOff: "Die Kamera ließ sich nicht öffnen – wähle ein Foto aus der Galerie.", ai: "Aqyl kann gerade nicht antworten. Versuch es gleich noch einmal.", busy: "Aqyl bekommt gerade sehr viele Fragen. Versuch es in einer Minute erneut.", net: "Keine Internetverbindung. Prüfe das Netz und versuch es erneut.", micDenied: "Kein Zugriff aufs Mikrofon. Erlaube ihn in den Browser-Einstellungen.", noMic: "Das Mikrofon funktioniert in diesem Browser nicht. Schreib stattdessen.", audio: "Die Aufnahme war undeutlich. Sag es bitte noch einmal.", image: "Das Foto ist zu groß. Wähle ein kleineres." },
  fr: { photo: "Photo", photoAsk: "Demander avec une photo", mic: "Dicter", micStop: "Arrêter l’enregistrement", camOff: "La caméra ne s’est pas ouverte : choisis une photo dans la galerie.", ai: "Aqyl ne peut pas répondre pour le moment. Réessaie dans un instant.", busy: "Aqyl reçoit beaucoup de questions en ce moment. Réessaie dans une minute.", net: "Pas de connexion internet. Vérifie le réseau et réessaie.", micDenied: "Pas d’accès au micro. Autorise-le dans les réglages du navigateur.", noMic: "Le micro ne fonctionne pas dans ce navigateur. Écris plutôt ton message.", audio: "L’enregistrement n’était pas clair. Redis-le, s’il te plaît.", image: "La photo est trop lourde. Choisis-en une plus petite." },
  tr: { photo: "Fotoğraf", photoAsk: "Fotoğrafla sor", mic: "Sesle yaz", micStop: "Kaydı durdur", camOff: "Kamera açılmadı — galeriden bir fotoğraf seç.", ai: "Aqyl şu an cevap veremiyor. Biraz sonra tekrar dene.", busy: "Aqyl'a şu an çok fazla soru geliyor. Bir dakika sonra tekrar dene.", net: "İnternet bağlantısı yok. Ağı kontrol edip tekrar dene.", micDenied: "Mikrofon izni yok. Tarayıcı ayarlarından izin ver.", noMic: "Bu tarayıcıda mikrofon çalışmıyor. Yazarak dene.", audio: "Kayıt anlaşılmadı. Lütfen tekrar söyle.", image: "Fotoğraf çok büyük. Daha küçük bir tane seç." },
  ar: { photo: "صورة", photoAsk: "اسأل بصورة", mic: "إملاء صوتي", micStop: "إيقاف التسجيل", camOff: "تعذّر فتح الكاميرا — اختر صورة من المعرض.", ai: "لا يستطيع Aqyl الرد الآن. حاول مرة أخرى بعد قليل.", busy: "يتلقى Aqyl أسئلة كثيرة الآن. حاول مجددًا بعد دقيقة.", net: "لا يوجد اتصال بالإنترنت. تحقّق من الشبكة وحاول مجددًا.", micDenied: "لا يوجد إذن للميكروفون. اسمح به من إعدادات المتصفح.", noMic: "الميكروفون لا يعمل في هذا المتصفح. جرّب الكتابة.", audio: "التسجيل غير واضح. قلها مرة أخرى.", image: "الصورة كبيرة جدًا. اختر صورة أصغر." },
  ko: { photo: "사진", photoAsk: "사진으로 묻기", mic: "음성 입력", micStop: "녹음 중지", camOff: "카메라를 열 수 없어요. 갤러리에서 사진을 골라 주세요.", ai: "Aqyl이 지금은 답할 수 없어요. 잠시 후 다시 시도해 주세요.", busy: "지금 Aqyl에게 질문이 너무 많아요. 1분 뒤에 다시 시도해 주세요.", net: "인터넷 연결이 끊겼어요. 네트워크를 확인하고 다시 시도해 주세요.", micDenied: "마이크 권한이 없어요. 브라우저 설정에서 허용해 주세요.", noMic: "이 브라우저에서는 마이크가 작동하지 않아요. 글로 입력해 보세요.", audio: "녹음이 잘 들리지 않았어요. 다시 말해 주세요.", image: "사진이 너무 커요. 더 작은 사진을 골라 주세요." },
  ja: { photo: "写真", photoAsk: "写真で質問", mic: "音声入力", micStop: "録音を止める", camOff: "カメラを開けませんでした。ギャラリーから写真を選んでください。", ai: "Aqylは今は答えられません。少ししてからもう一度お試しください。", busy: "Aqylに質問が集中しています。1分後にもう一度お試しください。", net: "インターネットに接続できません。回線を確認して再度お試しください。", micDenied: "マイクの使用が許可されていません。ブラウザの設定で許可してください。", noMic: "このブラウザではマイクが使えません。文字で入力してみてください。", audio: "録音がはっきりしませんでした。もう一度話してください。", image: "写真が大きすぎます。小さめの写真を選んでください。" },
};
export const chatToolL = (lang) => T[lang] || T.en;

// Сервер не браузер берген қатені түсінікті хабарға айналдырады (шикі техникалық мәтін ешқашан көрсетілмейді)
export function friendlyErr(lang, raw) {
  const L = chatToolL(lang);
  const s = String((raw && raw.message) || raw || "");
  if (/^mic-denied$|NotAllowedError|Permission/i.test(s)) return L.micDenied;
  if (/^no-mic$/i.test(s)) return L.noMic;
  if (/429|лимит|limit|quota|RESOURCE_EXHAUSTED/i.test(s)) return L.busy;
  if (/Failed to fetch|NetworkError|Load failed|network|offline/i.test(s)) return L.net;
  if (/413|too large/i.test(s)) return L.image;
  if (/Bad audio/i.test(s)) return L.audio;
  return L.ai;
}

// Сабақ соңындағы «Ақылмен жаттығу»: чатқа дайын жаттығу мәтінімен өтеді (пайдаланушы өзі жібереді).
// Кілт — сабақ id-і (алғашқы сабақ — «greet-w1»). Басқа сабаққа қосу үшін осы тізімге жол қосу жеткілікті.
const PRACTICE = {
  "greet-w1": {
    kk: "Сәлемдесіп, өзімді таныстырып көрейін",
    ru: "Давай я поздороваюсь и представлюсь по-казахски",
    en: "Let me greet you and introduce myself in Kazakh",
    zh: "让我用哈萨克语打招呼并做自我介绍",
    es: "Déjame saludarte y presentarme en kazajo",
    de: "Lass mich dich auf Kasachisch begrüßen und mich vorstellen",
    fr: "Laisse-moi te saluer et me présenter en kazakh",
    tr: "Kazakça selam verip kendimi tanıtayım",
    ar: "دعني أحيّيك وأعرّف بنفسي بالكازاخية",
    ko: "카자흐어로 인사하고 제 소개를 해 볼게요",
    ja: "カザフ語であいさつして自己紹介してみます",
  },
};
const PRACTICE_UI = {
  kk: { btn: "Ақылмен жаттығу", hint: "Жаңа сөздерді Aqyl-мен әңгімеде қолданып көр." },
  ru: { btn: "Потренироваться с Aqyl", hint: "Попробуйте новые слова в разговоре с Aqyl." },
  en: { btn: "Practise with Aqyl", hint: "Try the new words in a chat with Aqyl." },
  zh: { btn: "和 Aqyl 练习", hint: "在和 Aqyl 的对话中用一用新单词。" },
  es: { btn: "Practicar con Aqyl", hint: "Usa las palabras nuevas en una charla con Aqyl." },
  de: { btn: "Mit Aqyl üben", hint: "Probier die neuen Wörter im Gespräch mit Aqyl aus." },
  fr: { btn: "S’entraîner avec Aqyl", hint: "Essaie les nouveaux mots dans une conversation avec Aqyl." },
  tr: { btn: "Aqyl ile pratik yap", hint: "Yeni kelimeleri Aqyl ile sohbette dene." },
  ar: { btn: "تدرّب مع Aqyl", hint: "جرّب الكلمات الجديدة في محادثة مع Aqyl." },
  ko: { btn: "Aqyl과 연습하기", hint: "새 단어를 Aqyl과의 대화에서 써 보세요." },
  ja: { btn: "Aqylと練習する", hint: "新しい単語をAqylとの会話で使ってみましょう。" },
};
export function lessonPractice(lessonId, lang) {
  const p = PRACTICE[lessonId];
  if (!p) return null;
  const say = p[lang] || p.en;
  return { ...(PRACTICE_UI[lang] || PRACTICE_UI.en), say, href: `/app/qyran?say=${encodeURIComponent(say)}` };
}
