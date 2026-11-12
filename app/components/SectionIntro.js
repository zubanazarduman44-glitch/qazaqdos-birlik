import Icon from "./Icon";

// Бөлімнің басындағы қысқа түсіндірме: не істейді және қалай жұмыс істейді
export default function SectionIntro({ icon = "sparkle", title, text, points = [] }) {
  return (
    <section className="sec-intro" aria-label={title}>
      <span className="sec-intro-ic" aria-hidden="true"><Icon name={icon} size={22} /></span>
      <div className="sec-intro-body">
        <b>{title}</b>
        <p>{text}</p>
        {points.length > 0 && (
          <ul>
            {points.map((p) => (
              <li key={p}><Icon name="check" size={14} /> {p}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
