'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';

type ModelContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: unknown) => unknown;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

type Birthday = {
  id: number;
  name: string;
  telegram: string;
  currentAge: number;
  day: number | null;
  month: number | null;
  photo: string;
  wishlists: string[];
  comment?: string;
};

const birthdays: Birthday[] = [
  { id: 1, name: 'Настюшка', telegram: '@ansedits', currentAge: 20, day: 12, month: 1, photo: 'girls/nastyushka.jpg', wishlists: [] },
  { id: 2, name: 'Ксюша', telegram: '@ksenka_online', currentAge: 21, day: 27, month: 1, photo: 'girls/ksyusha.jpg', wishlists: ['https://podarkus.ru/list/1787489'] },
  { id: 3, name: 'Даша (Шашенька)', telegram: '@tima_darya', currentAge: 25, day: 25, month: 6, photo: 'girls/dasha.jpg', wishlists: ['https://ohmywishes.com/users/tima_darya', 'https://followish.io/app/users/1ojqpsdexlmcqj'] },
  { id: 4, name: 'Ира Леви', telegram: '@x_leyme', currentAge: 22, day: 19, month: 10, photo: 'girls/ira-levi.jpg', wishlists: ['https://ohmywishes.com/users/236606cc26c71cf962505330'] },
  { id: 5, name: 'Катя', telegram: '@G_sh2403', currentAge: 25, day: 4, month: 2, photo: 'girls/katya.jpg', wishlists: [] },
  { id: 6, name: 'Даша', telegram: '@ask_a', currentAge: 24, day: 27, month: 7, photo: 'girls/dasha-aska.jpg', wishlists: [], comment: 'у меня поменяется вишлист к др, поэтому такое лучше уточнять' },
  { id: 7, name: 'Лизочка', telegram: '@liiizzzzzzzz', currentAge: 23, day: 7, month: 8, photo: 'girls/lizochka.jpg', wishlists: ['https://followish.io/mywishlist/tq3eeq71yykbd0'] },
  { id: 8, name: 'Алёна', telegram: '@aalllennnaa', currentAge: 22, day: 12, month: 5, photo: 'girls/alyona.jpg', wishlists: [] },
  { id: 9, name: 'Ася', telegram: '@Saaveliy', currentAge: 26, day: 19, month: 4, photo: 'girls/asya.jpg', wishlists: [] },
  { id: 10, name: 'Лизааа', telegram: '@little_sun_lion', currentAge: 25, day: 12, month: 7, photo: 'girls/lizaaa.jpg', wishlists: [], comment: 'Обычно делаю отдельно к каждому празднику' },
  { id: 11, name: 'Карина', telegram: '@voiddess', currentAge: 24, day: 7, month: 9, photo: 'girls/karina.jpg', wishlists: ['https://followish.io/app/wishlists/ksgrae1luosqsw'] },
  { id: 12, name: 'Яна', telegram: '@janekolt', currentAge: 26, day: 7, month: 3, photo: 'girls/yana.jpg', wishlists: [] },
];

const monthNames = [
  'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
  'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ',
];
const monthGenitive = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];
const weekdayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const total = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, index) => index + 1),
  ];
}

function PersonPhoto({ person }: { person: Birthday }) {
  return (
    <span className="avatar-face">
      <Image src={person.photo} alt={`Фото ${person.name}`} width={192} height={192} unoptimized />
    </span>
  );
}

function PersonCard({ person, mobile = false, onClose }: { person: Birthday; mobile?: boolean; onClose: () => void }) {
  return (
    <section className={`${mobile ? 'person-card person-card-mobile' : 'person-card'}${person.comment ? ' has-comment' : ''}`} aria-label={`День рождения: ${person.name}`}>
      <button className="close-button" onClick={onClose} aria-label="Закрыть карточку">
        <X size={20} strokeWidth={1.8} />
      </button>
      {mobile && <div className="sheet-handle" aria-hidden="true" />}
      <div className="person-topline">
        <PersonPhoto person={person} />
        <div className="identity-group">
          <h2 className={person.name.length > 12 ? 'long-name' : undefined}>{person.name}</h2>
          <a href={`https://t.me/${person.telegram.slice(1)}`} target="_blank" rel="noreferrer">{person.telegram}</a>
        </div>
      </div>
      <span className="card-sparkle" aria-hidden="true">✦</span>
      <div className="card-bottom-content">
        <div className="card-copy">
          <div className="age-date-group">
            <div className="age-line">
              <span>Исполняется</span>
              <strong>{person.currentAge + 1}</strong>
            </div>
            <p>{person.day !== null && person.month !== null ? `${person.day} ${monthGenitive[person.month]}` : 'Дата не указана'}</p>
          </div>
          {person.comment && <p className="person-comment">«{person.comment}»</p>}
        </div>
        <div className={`wishlist-area wishlist-count-${person.wishlists.length}`}>
          {person.wishlists.length === 0 ? (
            <p className="wishlist-empty">Вищлиста пока нет</p>
          ) : person.wishlists.map((wishlist, index) => (
            <a className="wishlist-button" href={wishlist} target="_blank" rel="noreferrer" key={wishlist}>
              {person.wishlists.length === 1 ? 'Открыть вишлист' : `Вишлист ${index + 1}`}
              <ExternalLink size={18} strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState<Birthday | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const days = useMemo(() => getCalendarDays(year, month), [month, year]);

  useEffect(() => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'open_birthday',
      title: 'Открыть день рождения',
      description: 'Открывает в календаре карточку подруги по имени.',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Имя подруги' } },
        required: ['name'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const name = typeof input === 'object' && input && 'name' in input ? String(input.name).trim().toLowerCase() : '';
        const person = birthdays.find((item) => item.name.toLowerCase() === name);
        if (!person) throw new Error('Подруга с таким именем не найдена');
        if (person.month !== null) setMonth(person.month);
        setSelected(person);
        setSheetOpen(true);
        return { name: person.name, day: person.day, month: person.month === null ? null : monthNames[person.month] };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  const selectPerson = (person: Birthday) => {
    setSelected(person);
    setSheetOpen(true);
  };

  const goToMonth = (delta: number) => {
    const nextDate = new Date(year, month + delta, 1);
    setMonth(nextDate.getMonth());
    setYear(nextDate.getFullYear());
    setSelected(null);
    setSheetOpen(false);
  };

  return (
    <main className={`site-shell ${selected ? 'card-open' : 'card-closed'}`}>
      <div className="calendar-column">
        <header className="month-header">
          <button onClick={() => goToMonth(-1)} aria-label="Предыдущий месяц"><ArrowLeft /></button>
          <h1>{monthNames[month]}</h1>
          <button onClick={() => goToMonth(1)} aria-label="Следующий месяц"><ArrowRight /></button>
        </header>

        <div className="calendar" aria-label={`${monthNames[month].toLowerCase()} ${year}`}>
          {weekdayNames.map((day) => <div className="weekday" key={day}>{day}</div>)}
          {days.map((day, index) => {
            const people = day ? birthdays.filter((person) => person.month === month && person.day === day) : [];
            return (
              <div className={`day-cell ${day ? '' : 'day-cell-empty'}`} key={`${day}-${index}`}>
                {day && <span className="date-number">{day}</span>}
                {people.length > 0 && (
                  <div className="birthday-stack">
                    {people.map((person) => {
                      const isSelected = selected?.id === person.id;
                      return (
                        <button
                          className={`birthday-marker ${isSelected ? 'is-selected' : ''}`}
                          key={person.id}
                          onClick={() => selectPerson(person)}
                          aria-label={`${person.name}, день рождения ${person.day} ${monthNames[month].toLowerCase()}`}
                          aria-pressed={isSelected}
                        >
                          <Image src={person.photo} alt="" width={40} height={40} unoptimized />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <aside className="desktop-details">
        {selected && <PersonCard person={selected} onClose={() => setSelected(null)} />}
      </aside>

      {sheetOpen && selected && (
        <div className="mobile-sheet-layer">
          <button className="sheet-backdrop" onClick={() => setSheetOpen(false)} aria-label="Закрыть карточку" />
          <PersonCard person={selected} mobile onClose={() => setSheetOpen(false)} />
        </div>
      )}
    </main>
  );
}
