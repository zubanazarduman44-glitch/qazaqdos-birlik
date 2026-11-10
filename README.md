# TILIM · Aqyl

Қазақ тілін саяхат, ұлттық ойындар және Aqyl атты виртуалды доспен бірге үйрену сайты.

## Мүмкіндіктер
- Лендинг, тіркелу/кіру (email + құпиясөз, Google), онбординг, демо режимі
- Aqyl — анимациялы SVG кейіпкер (7 эмоция)
- Қазақстанға саяхат: 20 өңір, сөздер, тест, паспорт мөрлері
- Тарих: 10 тарихи орын, уақыт жолы
- 6 ұлттық ойын: Бәйге, Арқан тартыс, Асық ату, Теңге ілу, Бес тас, Тоғызқұмалақ
- Aqyl-мен чат, Aqyl Vision, Жазу көмекшісі (Google Gemini)
- XP, тиын, күндік серия, деңгей; прогресс бұлтта (Supabase) немесе браузерде
- Интерфейс: қазақша / орысша / ағылшынша; түсіндіру тілі — 7 тіл; жарық/қараңғы тақырып

## Vercel айнымалылары
| Аты | Мәні |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio кілті |
| `SUPABASE_URL` | Supabase жобасының мекенжайы |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (жария) кілті |

## Supabase
`supabase/qd_progress.sql` — прогресс кестесі (RLS қосулы). Authentication → URL Configuration → Redirect URLs тізіміне сайт мекенжайын қосу керек.

## Дереккөздер
- Карта: © OpenStreetMap contributors (ODbL), geo-polygons жобасы арқылы (Apache-2.0)
- Фотолар: Unsplash (Unsplash License)
