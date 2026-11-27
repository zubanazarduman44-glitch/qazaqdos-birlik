// Saiys — көрініс бөліктері (Сөздік үлгісі): алтын панель, ақ карталар, ықшам қатарлар.
// Тек сызады; дерек, Supabase шақырулары мен бөлме логикасы app/app/saiys/page.js ішінде.
import Link from "next/link";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Qyran from "./Qyran";
import { SaiysMedal, SaiysPrizeArt } from "./SaiysArt";

// Беттің өз шағын мәтіндері — барлық 11 тілде
const S = {
  kk: { lead: "Бәйгенің алдында келесің!", podium: "Тұғырдасың! Орныңды сақта.", places: (n) => `Тұғырға дейін ${n} орын қалды`, next: "Келесі орынға", gap: "Алшақтық", notIn: "Әлі тізімде жоқсың: бір тапсырма орында да, бәйгеге қосыл!", up: (n) => `+${n} орынға көтерілдің!`, units: ["күн", "сағ", "мин"], place: (n) => `${n}-орын`, coins: (n) => `+${n} тиын`, roomHint: "Бөлме аш та, кодын достарыңа жібер. Он сұраққа кім тез әрі дұрыс жауап берсе, сол озады.", joinHint: "Досың жіберген кодты енгіз." },
  ru: { lead: "Вы впереди всех!", podium: "Вы на пьедестале! Удержите место.", places: (n) => `До пьедестала ${n} ${n % 10 === 1 && n % 100 !== 11 ? "место" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "места" : "мест"}`, next: "До следующего места", gap: "Отрыв", notIn: "Вас пока нет в списке: выполните задание и вступайте в забег!", up: (n) => `Вы поднялись на ${n}!`, units: ["дн", "ч", "мин"], place: (n) => `${n}-е место`, coins: (n) => `+${n} монет`, roomHint: "Создайте комнату и отправьте код друзьям. Кто быстрее и вернее ответит на 10 вопросов, тот и победит.", joinHint: "Введите код, который прислал друг." },
  en: { lead: "You're leading the race!", podium: "You're on the podium. Hold your place!", places: (n) => `${n} place${n === 1 ? "" : "s"} from the podium`, next: "To the next place", gap: "Your lead", notIn: "You're not on the board yet: finish a task to join the race!", up: (n) => `You climbed ${n}!`, units: ["d", "h", "m"], place: (n) => `Place ${n}`, coins: (n) => `+${n} coins`, roomHint: "Open a room and send the code to friends. Whoever answers 10 questions fastest and right wins.", joinHint: "Enter the code a friend sent you." },
  zh: { lead: "你在比赛中领先！", podium: "你登上领奖台了！保住名次。", places: (n) => `距领奖台还差 ${n} 名`, next: "距下一名", gap: "领先", notIn: "你还不在榜上：完成一个任务就能加入比赛！", up: (n) => `你上升了 ${n} 名！`, units: ["天", "时", "分"], place: (n) => `第 ${n} 名`, coins: (n) => `+${n} 金币`, roomHint: "创建房间并把代码发给朋友。10 道题答得又快又准的人获胜。", joinHint: "输入朋友发来的代码。" },
  es: { lead: "¡Vas a la cabeza de la carrera!", podium: "¡Estás en el podio! Mantén tu puesto.", places: (n) => `Te ${n === 1 ? "falta 1 puesto" : `faltan ${n} puestos`} para el podio`, next: "Para el siguiente puesto", gap: "Ventaja", notIn: "Aún no estás en la tabla: ¡completa una tarea y únete a la carrera!", up: (n) => `¡Subiste ${n} ${n === 1 ? "puesto" : "puestos"}!`, units: ["d", "h", "min"], place: (n) => `Puesto ${n}`, coins: (n) => `+${n} monedas`, roomHint: "Abre una sala y envía el código a tus amigos. Gana quien responda 10 preguntas más rápido y mejor.", joinHint: "Escribe el código que te envió tu amigo." },
  de: { lead: "Du führst das Rennen an!", podium: "Du stehst auf dem Podest! Halte deinen Platz.", places: (n) => `Noch ${n} ${n === 1 ? "Platz" : "Plätze"} bis zum Podest`, next: "Bis zum nächsten Platz", gap: "Vorsprung", notIn: "Du bist noch nicht in der Liste: Erledige eine Aufgabe und mach mit!", up: (n) => `Du bist ${n} ${n === 1 ? "Platz" : "Plätze"} aufgestiegen!`, units: ["T", "Std", "Min"], place: (n) => `Platz ${n}`, coins: (n) => `+${n} Münzen`, roomHint: "Öffne einen Raum und schick den Code an Freunde. Wer 10 Fragen am schnellsten richtig beantwortet, gewinnt.", joinHint: "Gib den Code ein, den dir ein Freund geschickt hat." },
  fr: { lead: "Tu mènes la course !", podium: "Tu es sur le podium ! Garde ta place.", places: (n) => `Encore ${n} ${n === 1 ? "place" : "places"} avant le podium`, next: "Pour la place suivante", gap: "Avance", notIn: "Tu n’es pas encore au classement : termine une tâche pour rejoindre la course !", up: (n) => `Tu as gagné ${n} ${n === 1 ? "place" : "places"} !`, units: ["j", "h", "min"], place: (n) => `${n === 1 ? "1re" : `${n}e`} place`, coins: (n) => `+${n} pièces`, roomHint: "Ouvre une salle et envoie le code à tes amis. Celui qui répond le plus vite et le mieux aux 10 questions gagne.", joinHint: "Saisis le code envoyé par ton ami." },
  tr: { lead: "Yarışta öndesin!", podium: "Kürsüdesin! Yerini koru.", places: (n) => `Kürsüye ${n} sıra kaldı`, next: "Bir sonraki sıraya", gap: "Fark", notIn: "Henüz listede değilsin: bir görev tamamla ve yarışa katıl!", up: (n) => `${n} sıra yükseldin!`, units: ["g", "sa", "dk"], place: (n) => `${n}. sıra`, coins: (n) => `+${n} jeton`, roomHint: "Bir oda aç ve kodu arkadaşlarına gönder. 10 soruyu en hızlı ve doğru yanıtlayan kazanır.", joinHint: "Arkadaşının gönderdiği kodu gir." },
  ar: { lead: "أنت في مقدمة السباق!", podium: "أنت على منصة التتويج! حافظ على مركزك.", places: (n) => `يفصلك ${n} من المراكز عن منصة التتويج`, next: "إلى المركز التالي", gap: "الفارق", notIn: "لست في القائمة بعد: أكمل مهمة وانضم إلى السباق!", up: (n) => `تقدّمت ${n} من المراكز!`, units: ["يوم", "ساعة", "دقيقة"], place: (n) => `المركز ${n}`, coins: (n) => `+${n} عملة`, roomHint: "افتح غرفة وأرسل الرمز إلى أصدقائك. يفوز من يجيب عن 10 أسئلة بأسرع وأدق ما يمكن.", joinHint: "أدخل الرمز الذي أرسله صديقك." },
  ko: { lead: "경주에서 선두예요!", podium: "시상대에 올랐어요! 자리를 지키세요.", places: (n) => `시상대까지 ${n}계단 남았어요`, next: "다음 순위까지", gap: "격차", notIn: "아직 순위표에 없어요. 과제를 하나 끝내고 경주에 참여하세요!", up: (n) => `${n}계단 올랐어요!`, units: ["일", "시간", "분"], place: (n) => `${n}위`, coins: (n) => `+${n} 코인`, roomHint: "방을 열고 친구들에게 코드를 보내세요. 10문제를 가장 빠르고 정확하게 푼 사람이 이겨요.", joinHint: "친구가 보낸 코드를 입력하세요." },
  ja: { lead: "レースでトップです！", podium: "表彰台に入りました！順位をキープしよう。", places: (n) => `表彰台まであと${n}位`, next: "次の順位まで", gap: "リード", notIn: "まだランキングに入っていません。課題を1つ終えてレースに参加しよう！", up: (n) => `${n}位アップしました！`, units: ["日", "時間", "分"], place: (n) => `${n}位`, coins: (n) => `+${n} コイン`, roomHint: "ルームを作ってコードを友だちに送ろう。10問をいちばん速く正確に答えた人の勝ち。", joinHint: "友だちから届いたコードを入力しよう。" },
};
export function sy(lang) {
  return S[lang] || S.en;
}

// Ортақ мәтіндерде қалған эмодзи-тиынды алып тастаймыз (белгі — SVG)
export const noEmoji = (s) => String(s || "").replace(/\s*\u{1FA99}/gu, "").trim();

// Ағымдағы орын туралы Aqyl сөзі
export function saiysStatus(rows, userId, x, t, up = 0) {
  if (!rows || !userId) return null;
  if (rows.length === 0) return { mood: "support", title: t.notIn, line: "" };
  const i = rows.findIndex((r) => r.user_id === userId);
  if (i < 0) return { mood: "think", title: t.notIn, line: "" };
  const me = rows[i];
  const ahead = rows[i - 1];
  const next = ahead ? `${t.next}: +${Math.max(1, ahead.tasks - me.tasks + 1)} ${x.sTasks}` : "";
  const mood = up > 0 ? "wow" : i === 0 ? "cheer" : i < 3 ? "happy" : "support";
  if (i === 0) return { mood, title: t.lead, line: rows[1] ? `${t.gap}: ${me.tasks - rows[1].tasks} ${x.sTasks}` : "", rank: 1 };
  if (i < 3) return { mood, title: t.podium, line: next, rank: i + 1 };
  return { mood, title: t.places(i - 2), line: next, rank: i + 1 };
}

/* Aqyl орны: биіктігі шектеулі есік-арка (тік кейіпкерге де сыяды) */
function AqylSlot({ mood, size = "md" }) {
  return (
    <span className={`sy-aqyl is-${size}`} aria-hidden="true">
      <Qyran mood={mood} size={size === "md" ? 84 : size === "sm" ? 60 : 40} />
    </span>
  );
}

/* Бөлім тақырыбы: белгі тақтайша + атау + сан */
export function SaiysHead({ id, icon, title, count }) {
  return (
    <div className="sy-h">
      {icon && <span className="sy-h-ic" aria-hidden="true">{icon}</span>}
      <h2 id={id}>{title}</h2>
      {count != null && <em>{count}</em>}
    </div>
  );
}

/* Апта панелі: менің орным + келесі орынға қанша қалды + кері санақ + Aqyl */
export function SaiysHero({ x, t, status, up = 0, loading = false, ms = 0 }) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60)];
  return (
    <section className="sy-hero" aria-busy={loading || undefined}>
      <div className="sy-hero-txt">
        <div className="sy-say" role="status">
          {up > 0 ? (
            <span className="sy-up"><Icon name="sparkle" size={14} /> {t.up(up)}</span>
          ) : (
            <span className="sy-eyebrow">{status?.rank ? t.place(status.rank) : x.sWeekly}</span>
          )}
          {loading ? <span className="sy-ph" aria-hidden="true"><i /><i /></span> : <b className="sy-count">{status?.title}</b>}
          {!loading && status?.line && <span className="sy-line">{status.line}</span>}
        </div>
        <div className="sy-clock">
          <small>{x.sEnds}</small>
          <span className="sy-tiles">
            {parts.map((n, i) => (
              <span key={i} className="sy-tile"><b>{String(n).padStart(i ? 2 : 1, "0")}</b><i>{t.units[i]}</i></span>
            ))}
          </span>
        </div>
      </div>
      <AqylSlot mood={status?.mood || (loading ? "think" : "idle")} />
    </section>
  );
}

/* Апта жүлдесі: белгі + ереже; ішінде «жүлдені алу» түймесі не құттықтау */
export function SaiysPrize({ x, kind, children }) {
  return (
    <section className={`sy-card sy-prize is-${kind}`}>
      <span className="sy-prize-art"><SaiysPrizeArt kind={kind} size={50} /></span>
      <div className="sy-prize-b">
        <span className="sy-tag">{x.sPrize}</span>
        <p>{kind === "gift" ? x.sPrizeGift : noEmoji(x.sPrizeCoins)}</p>
      </div>
      {children}
    </section>
  );
}

/* Орын белгісі: 1–3 — медаль, қалғаны — сан */
function Rank({ i }) {
  return i < 3
    ? <span className="sy-rk is-medal"><SaiysMedal place={i} size={24} /><span className="sr-only">{i + 1}</span></span>
    : <span className="sy-rk">{i + 1}</span>;
}

/* Рейтинг: бүкіл тізім, үздік үштік — медальмен, менің қатарым — бөлім реңімен */
export function SaiysRankList({ rows, userId, x }) {
  const top = Math.max(1, rows[0]?.tasks || 1);
  return (
    <ol className="sy-rank">
      {rows.map((r, i) => {
        const me = r.user_id === userId;
        return (
          <li key={r.user_id} className={`sy-row ${me ? "me" : ""} ${i < 3 ? "is-top" : ""}`} style={{ "--p": Math.min(1, r.tasks / top), "--d": `${Math.min(i, 12) * 30}ms` }}>
            <Rank i={i} />
            <Avatar value={r.avatar} size={36} />
            <span className="sy-rk-main">
              <span className="sy-rk-name"><span dir="auto">{r.name}</span>{me && <span className="sy-you">{x.sYou}</span>}</span>
              <span className="sy-bar" aria-hidden="true"><i /></span>
            </span>
            <span className="sy-score"><b>{r.tasks}</b><small>{x.sTasks}</small></span>
          </li>
        );
      })}
    </ol>
  );
}

/* Өткен апта жеңімпаздары */
export function SaiysLast({ x, last }) {
  return (
    <section className="sy-card sy-last" aria-labelledby="sy-last-h">
      <SaiysHead id="sy-last-h" icon={<Icon name="trophy" size={18} />} title={x.sLast} />
      <ol className="sy-rank">
        {last.map((r, i) => (
          <li key={r.user_id} className="sy-row is-top">
            <Rank i={i} />
            <Avatar value={r.avatar} size={36} />
            <span className="sy-rk-main"><span className="sy-rk-name"><span dir="auto">{r.name}</span></span></span>
            <span className="sy-score"><b>{r.tasks}</b><small>{x.sTasks}</small></span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* Жүктелу: қатарлардың сұлбасы */
export function SaiysSkeleton() {
  return (
    <div className="sy-skel" aria-busy="true">
      {[0, 1, 2, 3, 4].map((i) => <i key={i} />)}
      <span className="sr-only">…</span>
    </div>
  );
}

/* Бос рейтинг */
export function SaiysEmpty({ text }) {
  return (
    <div className="sy-empty">
      <span className="sy-empty-ic" aria-hidden="true"><SaiysMedal place={0} size={30} /></span>
      <p>{text}</p>
    </div>
  );
}

/* Кірмеген қонақ */
export function SaiysLoginGate({ x }) {
  return (
    <section className="sy-card sy-gate">
      <span className="sy-h-ic is-lg" aria-hidden="true"><Icon name="lock" size={22} /></span>
      <p>{x.sLogin}</p>
      <Link href="/login" className="btn primary big">{x.sLoginBtn}</Link>
    </section>
  );
}

/* Бөлме: ашу не кодпен қосылу */
export function SaiysRoomGate({ x, t, input, setInput, err, onCreate, onJoin }) {
  return (
    <div className="sy-join">
      <section className="sy-card sy-act" aria-labelledby="sy-new-h">
        <SaiysHead id="sy-new-h" icon={<Icon name="plus" size={18} />} title={x.sCreate} />
        <p className="sy-hint">{t.roomHint}</p>
        <button type="button" className="btn primary sy-wide" onClick={onCreate}><Icon name="plus" size={18} /> {x.sCreate}</button>
      </section>
      <section className="sy-card sy-act" aria-labelledby="sy-join-h">
        <SaiysHead id="sy-join-h" icon={<Icon name="target" size={18} />} title={x.sJoin} />
        <p className="sy-hint">{t.joinHint}</p>
        <form className="sy-join-row" onSubmit={(e) => { e.preventDefault(); onJoin(); }}>
          <label className="sr-only" htmlFor="sy-code">{x.sCode}</label>
          <input id="sy-code" className="input sy-code-in" value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder={x.sCodePh}
            maxLength={6} autoComplete="off" autoCapitalize="characters" spellCheck={false} translate="no" />
          <button type="submit" className="btn primary" disabled={!input.trim()}>{x.sJoin}</button>
        </form>
      </section>
      {err && <p className="alert sy-note" role="alert"><Icon name="x" size={18} /> <span>{err}</span></p>}
    </div>
  );
}

/* Бөлме ішінде: код, ойыншылар, сұрақ, нәтиже */
export function SaiysRoomView({ x, code, room, players, userId, isHost, qs, qi, qn, picked, score, done, allDone, rank, onStart, onLeave, onChoose, optLabel }) {
  const lobby = room?.status === "lobby";
  const playing = room?.status === "play" && !done;
  const q = playing ? qs[qi] : null;

  const list = (
    <div className="sy-players">
      <SaiysHead id="sy-pl-h" icon={<Icon name="user" size={18} />} title={x.sPlayers} count={`${players.length}/8`} />
      <ol className="sy-rank" aria-labelledby="sy-pl-h">
        {players.map((p, i) => (
          <li key={p.user_id} className={`sy-row ${p.user_id === userId ? "me" : ""}`}>
            {room?.status === "play" ? <Rank i={i} /> : <span className="sy-rk"><Icon name="user" size={14} /></span>}
            <Avatar value={p.avatar} size={36} />
            <span className="sy-rk-main">
              <span className="sy-rk-name"><span dir="auto">{p.name}</span>{p.done && <Icon name="check" size={16} stroke={3} className="sy-done" />}</span>
            </span>
            <span className="sy-score"><b>{p.score}</b><small>{x.sPoints}</small></span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <section className="sy-card sy-room">
      <div className="sy-room-top">
        <div className="sy-code-box">
          <small>{x.sShare}</small>
          <div className="sy-code" aria-label={`${x.sCode}: ${code}`} translate="no">{code.split("").map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</div>
        </div>
        <button type="button" className="btn ghost small" onClick={onLeave}><Icon name="logout" size={16} className="sy-flip" /> {x.sLeave}</button>
      </div>

      {lobby && list}
      {lobby && (isHost ? (
        <button type="button" className="btn primary big sy-wide" disabled={players.length < 2} onClick={onStart}><Icon name="flame" size={18} /> {x.sStart}</button>
      ) : (
        <p className="sy-wait"><AqylSlot mood="think" size="xs" /><span>{x.sWaitHost}</span></p>
      ))}

      {q && (
        <div className="sy-q">
          <div className="sy-q-top">
            <span className="sy-q-n">{x.sQ(qi + 1, qn)}</span>
            <span className="sy-steps" aria-hidden="true">{qs.map((_, k) => <i key={k} className={k < qi ? "on" : k === qi ? "cur" : ""} />)}</span>
            <span className="sy-q-sc"><b>{score}</b> {x.sPoints}</span>
          </div>
          <p className="sy-q-hint">{x.sTrans}</p>
          <h3 className="sy-q-word" lang="kk" key={qi}>{q.w.kk}</h3>
          <div className="sy-opts">
            {q.options.map((o) => {
              const right = picked && o.kk === q.w.kk;
              const bad = picked === o.kk && o.kk !== q.w.kk;
              return (
                <button key={o.kk} type="button" disabled={Boolean(picked)} className={`sy-opt ${right ? "is-right" : ""} ${bad ? "is-bad" : ""}`} onClick={() => onChoose(o.kk)}>
                  <span>{optLabel(o)}</span>
                  {right && <Icon name="check" size={18} stroke={3} />}
                  {bad && <Icon name="x" size={18} stroke={3} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {done && !allDone && <p className="sy-wait"><AqylSlot mood="think" size="xs" /><span>{x.sWaitOthers}</span></p>}
      {done && allDone && (
        <div className="sy-end">
          <AqylSlot mood={rank === 0 ? "cheer" : "happy"} size="sm" />
          <div className="sy-end-b">
            <h3>{x.sResults}: {rank >= 0 && rank < 3 ? <SaiysMedal place={rank} size={28} /> : `#${rank + 1}`}</h3>
            <button type="button" className="btn primary" onClick={onLeave}><Icon name="refresh" size={18} /> {x.sAgain}</button>
          </div>
        </div>
      )}

      {!lobby && list}
    </section>
  );
}
