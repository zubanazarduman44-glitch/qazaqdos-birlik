// Saiys — «Бәйге алаңы»: тұғыр, бәйге жолы, рейтинг, жүлде, кері санақ (тек көрініс; дерек page.js-те).
import Avatar from "./Avatar";
import Icon from "./Icon";
import Qyran from "./Qyran";
import { Horse } from "./games/Frame";
import { SaiysArena, SaiysMedal, SaiysPlume, SaiysOrn, SaiysPrizeArt } from "./SaiysArt";

// Жаңа шағын мәтіндер — барлық 11 тілде
const S = {
  kk: { lead: "Бәйгенің алдында келесің!", podium: "Тұғырдасың! Орныңды сақта.", places: (n) => `Тұғырға дейін ${n} орын қалды`, next: "Келесі орынға", gap: "Алшақтық", notIn: "Әлі тізімде жоқсың: бір тапсырма орында да, бәйгеге қосыл!", race: "Бәйге жолы", up: (n) => `+${n} орынға көтерілдің!`, units: ["күн", "сағ", "мин"], open: "Бос орын", start: "Сөре" },
  ru: { lead: "Вы впереди всех!", podium: "Вы на пьедестале! Удержите место.", places: (n) => `До пьедестала ${n} ${n % 10 === 1 && n % 100 !== 11 ? "место" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "места" : "мест"}`, next: "До следующего места", gap: "Отрыв", notIn: "Вас пока нет в списке: выполните задание и вступайте в забег!", race: "Ваш забег", up: (n) => `Вы поднялись на ${n}!`, units: ["дн", "ч", "мин"], open: "Свободно", start: "Старт" },
  en: { lead: "You're leading the race!", podium: "You're on the podium. Hold your place!", places: (n) => `${n} place${n === 1 ? "" : "s"} from the podium`, next: "To the next place", gap: "Your lead", notIn: "You're not on the board yet: finish a task to join the race!", race: "Your race", up: (n) => `You climbed ${n}!`, units: ["d", "h", "m"], open: "Open seat", start: "Start" },
  zh: { lead: "你在比赛中领先！", podium: "你登上领奖台了！保住名次。", places: (n) => `距领奖台还差 ${n} 名`, next: "距下一名", gap: "领先", notIn: "你还不在榜上：完成一个任务就能加入比赛！", race: "你的赛道", up: (n) => `你上升了 ${n} 名！`, units: ["天", "时", "分"], open: "空位", start: "起点" },
  es: { lead: "¡Vas a la cabeza de la carrera!", podium: "¡Estás en el podio! Mantén tu puesto.", places: (n) => `Te ${n === 1 ? "falta 1 puesto" : `faltan ${n} puestos`} para el podio`, next: "Para el siguiente puesto", gap: "Ventaja", notIn: "Aún no estás en la tabla: ¡completa una tarea y únete a la carrera!", race: "Tu carrera", up: (n) => `¡Subiste ${n} ${n === 1 ? "puesto" : "puestos"}!`, units: ["d", "h", "min"], open: "Plaza libre", start: "Salida" },
  de: { lead: "Du führst das Rennen an!", podium: "Du stehst auf dem Podest! Halte deinen Platz.", places: (n) => `Noch ${n} ${n === 1 ? "Platz" : "Plätze"} bis zum Podest`, next: "Bis zum nächsten Platz", gap: "Vorsprung", notIn: "Du bist noch nicht in der Liste: Erledige eine Aufgabe und mach mit!", race: "Dein Rennen", up: (n) => `Du bist ${n} ${n === 1 ? "Platz" : "Plätze"} aufgestiegen!`, units: ["T", "Std", "Min"], open: "Freier Platz", start: "Start" },
  fr: { lead: "Tu mènes la course !", podium: "Tu es sur le podium ! Garde ta place.", places: (n) => `Encore ${n} ${n === 1 ? "place" : "places"} avant le podium`, next: "Pour la place suivante", gap: "Avance", notIn: "Tu n’es pas encore au classement : termine une tâche pour rejoindre la course !", race: "Ta course", up: (n) => `Tu as gagné ${n} ${n === 1 ? "place" : "places"} !`, units: ["j", "h", "min"], open: "Place libre", start: "Départ" },
  tr: { lead: "Yarışta öndesin!", podium: "Kürsüdesin! Yerini koru.", places: (n) => `Kürsüye ${n} sıra kaldı`, next: "Bir sonraki sıraya", gap: "Fark", notIn: "Henüz listede değilsin: bir görev tamamla ve yarışa katıl!", race: "Senin yarışın", up: (n) => `${n} sıra yükseldin!`, units: ["g", "sa", "dk"], open: "Boş yer", start: "Başlangıç" },
  ar: { lead: "أنت في مقدمة السباق!", podium: "أنت على منصة التتويج! حافظ على مركزك.", places: (n) => `يفصلك ${n} من المراكز عن منصة التتويج`, next: "إلى المركز التالي", gap: "الفارق", notIn: "لست في القائمة بعد: أكمل مهمة وانضم إلى السباق!", race: "سباقك", up: (n) => `تقدّمت ${n} من المراكز!`, units: ["يوم", "ساعة", "دقيقة"], open: "مقعد شاغر", start: "البداية" },
  ko: { lead: "경주에서 선두예요!", podium: "시상대에 올랐어요! 자리를 지키세요.", places: (n) => `시상대까지 ${n}계단 남았어요`, next: "다음 순위까지", gap: "격차", notIn: "아직 순위표에 없어요. 과제를 하나 끝내고 경주에 참여하세요!", race: "나의 경주", up: (n) => `${n}계단 올랐어요!`, units: ["일", "시간", "분"], open: "빈자리", start: "출발" },
  ja: { lead: "レースでトップです！", podium: "表彰台に入りました！順位をキープしよう。", places: (n) => `表彰台まであと${n}位`, next: "次の順位まで", gap: "リード", notIn: "まだランキングに入っていません。課題を1つ終えてレースに参加しよう！", race: "あなたのレース", up: (n) => `${n}位アップしました！`, units: ["日", "時間", "分"], open: "空き席", start: "スタート" },
};
export function sy(lang) {
  return S[lang] || S.en;
}

// Ағымдағы орын туралы хабаршы (Aqyl) сөзі
export function saiysStatus(rows, userId, x, t, up = 0) {
  if (!rows || !userId) return null;
  const i = rows.findIndex((r) => r.user_id === userId);
  if (rows.length === 0) return null;
  if (i < 0) return { mood: "think", title: t.notIn, line: "" };
  const me = rows[i];
  const ahead = rows[i - 1];
  const next = ahead ? `${t.next}: +${Math.max(1, ahead.tasks - me.tasks + 1)} ${x.sTasks}` : "";
  const mood = up > 0 ? "wow" : i === 0 ? "cheer" : i < 3 ? "happy" : "support";
  if (i === 0) return { mood, title: t.lead, line: rows[1] ? `${t.gap}: ${me.tasks - rows[1].tasks} ${x.sTasks}` : "", rank: 1 };
  if (i < 3) return { mood, title: t.podium, line: next, rank: i + 1 };
  return { mood, title: t.places(i - 2), line: next, rank: i + 1 };
}

/* Тақырып: мәтін + бәйге алаңы + мәре бағанындағы хабаршы Aqyl */
export function SaiysHero({ x, mood = "idle", status, up = 0, t }) {
  return (
    <header className="sy-hero">
      <div className="sy-hero-text">
        <span className="kicker">{x.sKicker}</span>
        <h1>{x.sTitle}</h1>
        <p>{x.sSub}</p>
      </div>
      <div className="sy-arena">
        <SaiysArena />
        <div className="sy-herald">
          <Qyran mood={status?.mood || mood} size={120} />
        </div>
        {status && (
          <div className={`sy-bubble ${up > 0 ? "up" : ""}`} role="status">
            {up > 0 && <span className="sy-up"><Icon name="sparkle" size={14} /> {t.up(up)}</span>}
            <b>{status.title}</b>
            {status.line && <span>{status.line}</span>}
          </div>
        )}
      </div>
    </header>
  );
}

/* Апта жүлдесі + кері санақ */
export function SaiysPrize({ x, t, kind, ms, label }) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60)];
  return (
    <section className={`card sy-prize ${kind}`}>
      <div className="sy-prize-disc"><SaiysPrizeArt kind={kind} size={92} /></div>
      <div className="sy-prize-body">
        <span className="sy-tag">{x.sPrize}</span>
        <p>{kind === "gift" ? x.sPrizeGift : x.sPrizeCoins}</p>
      </div>
      <div className="sy-clock" title={label}>
        <small>{x.sEnds}</small>
        <div className="sy-tiles">
          {parts.map((n, i) => (
            <span key={i} className="sy-tile">
              <b>{String(n).padStart(i ? 2 : 1, "0")}</b>
              <i>{t.units[i]}</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Тұғыр: 2 · 1 · 3. ghost — бос/қонақ күйі */
export function SaiysPodium({ rows = [], userId, x, t, ghost = false }) {
  return (
    <div className={`sy-podium ${ghost ? "ghost" : ""}`} aria-hidden={ghost || undefined}>
      {[1, 0, 2].map((i) => {
        const r = ghost ? null : rows[i];
        const me = r && r.user_id === userId;
        return (
          <div key={i} className={`sy-stand s${i + 1} ${me ? "me" : ""} ${r ? "" : "empty"}`}>
            <div className="sy-who">
              {i === 0 && r && <SaiysPlume className="sy-plume-on" size={24} />}
              <span className="sy-ring">
                {r ? <Avatar value={r.avatar} size={i === 0 ? 76 : 62} /> : <span className="sy-seat"><Icon name="user" size={26} /></span>}
                {r && <SaiysMedal place={i} size={26} className="sy-medal-on" />}
              </span>
              {!ghost && (
                <>
                  <b className="sy-name">{r ? r.name : t.open}</b>
                  {r && <small><b>{r.tasks}</b> {x.sTasks}</small>}
                  {me && <span className="sy-you">{x.sYou}</span>}
                </>
              )}
            </div>
            <div className="sy-ped">
              {i === 0 && <><Icon name="sparkle" size={14} className="sy-tw a" /><Icon name="sparkle" size={10} className="sy-tw b" /></>}
              <span className="sy-num">{i + 1}</span>
              <SaiysOrn size={i === 0 ? 46 : 38} color={i === 0 ? "#FBEBC0" : "rgba(255,253,247,.85)"} />
            </div>
          </div>
        );
      })}
      <div className="sy-carpet" />
    </div>
  );
}

/* Бәйге жолы: менің орным және көршілерім (тапсырма саны бойынша) */
const COATS = [["#7A4A22", "#2B1A10"], ["#E9DDC6", "#7A5A3A"], ["#3A2A20", "#1F140C"], ["#B9773E", "#5E3218"], ["#9C8A72", "#3A2E22"]];
export function SaiysRace({ rows, userId, x, t, meAvatar }) {
  const i = rows.findIndex((r) => r.user_id === userId);
  const top = Math.max(1, rows[0]?.tasks || 1);
  let lanes;
  if (i < 0) lanes = [...rows.slice(0, 3).map((r, k) => ({ r, k })), { r: { user_id: userId, name: x.sYou, avatar: meAvatar, tasks: 0 }, k: -1 }];
  else {
    const from = Math.max(0, Math.min(i - 2, rows.length - 4));
    lanes = rows.slice(from, from + 4).map((r, k) => ({ r, k: from + k }));
  }
  return (
    <section className="card sy-race" aria-label={t.race}>
      <h2 className="sy-h"><Icon name="flame" size={18} /> {t.race}</h2>
      <ol className="sy-lanes">
        {lanes.map(({ r, k }, n) => {
          const me = r.user_id === userId;
          const [coat, mane] = COATS[(k + 5) % COATS.length];
          return (
            <li key={r.user_id + n} className={`sy-lane ${me ? "me" : ""} ${k < 0 ? "out" : ""}`} style={{ "--p": Math.min(1, r.tasks / top), "--d": `${n * 0.12}s` }}>
              <span className="sy-lane-who">
                <span className="sy-lane-rk">{k < 0 ? "–" : k + 1}</span>
                <Avatar value={r.avatar} size={32} />
                <span className="sy-lane-name"><b>{r.name}</b><small>{r.tasks} {x.sTasks}</small></span>
              </span>
              <span className="sy-track">
                <span className="sy-run">
                  <span className="sy-horse">
                    <Horse coat={coat} mane={mane} cloth={me ? "#B8322A" : "#0F5E7A"} rider={me ? "#0F5E7A" : "#8A2018"} />
                  </span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* 4-орыннан бастап: таза рейтинг тізімі */
export function SaiysRankList({ rows, userId, x, from = 3 }) {
  const top = Math.max(1, rows[0]?.tasks || 1);
  if (rows.length <= from) return null;
  return (
    <ol className="sy-rank" start={from + 1}>
      {rows.slice(from).map((r, k) => {
        const me = r.user_id === userId;
        return (
          <li key={r.user_id} className={me ? "me" : ""} style={{ "--p": Math.min(1, r.tasks / top), "--d": `${Math.min(k, 10) * 0.04}s` }}>
            <span className="sy-rk">{from + k + 1}</span>
            <Avatar value={r.avatar} size={40} />
            <span className="sy-rk-main">
              <span className="sy-rk-name">{r.name}{me && <span className="sy-you">{x.sYou}</span>}</span>
              <span className="sy-bar" aria-hidden="true"><i /></span>
            </span>
            <span className="sy-rk-score"><b>{r.tasks}</b> <small>{x.sTasks}</small></span>
          </li>
        );
      })}
    </ol>
  );
}

/* Өткен апта жеңімпаздары */
export function SaiysLast({ x, last, kind }) {
  return (
    <section className="card sy-last">
      <h2 className="sy-h"><SaiysPrizeArt kind={kind} size={30} /> {x.sLast}</h2>
      <ul>
        {last.map((r, i) => (
          <li key={r.user_id} className={`l${i + 1}`}>
            <SaiysMedal place={i} size={24} />
            <Avatar value={r.avatar} size={36} />
            <span><b>{r.name}</b><small>{r.tasks} {x.sTasks}</small></span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Жүктелу күйі: тұғыр мен жолдардың сұлбасы */
export function SaiysSkeleton() {
  return (
    <div className="sy-skel" aria-busy="true">
      <span className="sy-skel-pod"><i /><i /><i /></span>
      <span className="sy-skel-row" />
      <span className="sy-skel-row" />
      <span className="sy-skel-row" />
      <span className="sy-sr">…</span>
    </div>
  );
}
