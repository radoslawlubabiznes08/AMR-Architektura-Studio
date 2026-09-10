import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Quote,
  X,
} from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  id: string;
  title: string;
  category: 'Domy' | 'Wnętrza' | 'Przebudowy';
  place: string;
  year: string;
  description: string;
  className: string;
  facts: string[];
};

const projects: Project[] = [
  {
    id: 'mlynarska',
    title: 'Dom przy Młynarskiej',
    category: 'Domy',
    place: 'Wieluń',
    year: '2024',
    description: 'Dom, który porządkuje relację między prywatnością a ogrodem. Prosta bryła, miękkie światło i materiały, które dojrzewają razem z mieszkańcami.',
    className: 'project-art--mlyn',
    facts: ['184 m²', 'projekt kompleksowy', 'realizacja 2025'],
  },
  {
    id: 'tarninowa',
    title: 'Tarninowa / wnętrze',
    category: 'Wnętrza',
    place: 'Sieradz',
    year: '2023',
    description: 'Wnętrze apartamentu zbudowane wokół ciszy: wapienne powierzchnie, naturalny dąb i detal bez zbędnego gestu.',
    className: 'project-art--tarnin',
    facts: ['92 m²', 'projekt wnętrz', 'nadzór autorski'],
  },
  {
    id: 'pod-lasem',
    title: 'Pod lasem',
    category: 'Domy',
    place: 'okolice Wielunia',
    year: '2022',
    description: 'Kameralny dom jednorodzinny wpisany w pochyłą działkę. Najważniejszym widokiem pozostaje ten, który zmienia się przez cały dzień.',
    className: 'project-art--podlas',
    facts: ['146 m²', 'projekt budowlany', 'koncepcja 2022'],
  },
  {
    id: 'ruda',
    title: 'Ruda / nowe światło',
    category: 'Przebudowy',
    place: 'Ruda',
    year: '2024',
    description: 'Przebudowa domu z lat 80. bez udawania nowego początku. Odzyskana wysokość, otwarte parterowe wnętrze i kolor terakoty.',
    className: 'project-art--ruda',
    facts: ['128 m²', 'przebudowa', 'konsultacje materiałowe'],
  },
];

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Zakres', href: '#zakres' },
  { label: 'Projekty', href: '#projekty' },
  { label: 'Proces', href: '#proces' },
  { label: 'Kontakt', href: '#kontakt' },
];

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, className: visible ? 'reveal is-visible' : 'reveal' };
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal();
  return <div ref={reveal.ref} className={`${reveal.className} ${className}`}>{children}</div>;
}

function Metadata() {
  useEffect(() => {
    document.title = 'AMR Architektura — architekt Wieluń | Marzena Ratajczyk';
    const description = 'AMR Architektura Marzena Ratajczyk — architekt i projektant wnętrz w Wieluniu. Projekty budowlane, domy i wnętrza dopracowane od pierwszej kreski.';
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
    const keywords = document.createElement('meta');
    keywords.setAttribute('name', 'keywords');
    keywords.setAttribute('content', 'architekt Wieluń, projektant wnętrz Wieluń, projekty budowlane Wieluń, AMR Architektura');
    document.head.appendChild(keywords);
    return () => keywords.remove();
  }, []);
  return null;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b border-transparent header-transition ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="section-wrap flex h-[76px] items-center justify-between">
        <a href="#top" className="focus-ring flex items-center gap-3 text-[#f4efe6]" aria-label="AMR Architektura — strona główna" data-testid="link-logo">
          <span className="flex h-9 w-9 items-center justify-center border border-[#b66f4d] text-[12px] font-bold tracking-[-.08em]">AMR</span>
          <span className="hidden text-[11px] font-bold uppercase tracking-[.18em] sm:block">Architektura<br /><span className="font-normal tracking-[.08em] opacity-70">Marzena Ratajczyk</span></span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Główna nawigacja">
          {navItems.map((item) => <a key={item.href} href={item.href} className="focus-ring text-[11px] font-semibold uppercase tracking-[.12em] text-[#f4efe6]/75 transition-colors hover:text-[#f4efe6]" data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</a>)}
        </nav>
        <a href="tel:+48533836666" className="focus-ring hidden items-center gap-2 text-xs font-semibold text-[#f4efe6] lg:flex" data-testid="link-header-phone"><Phone size={14} strokeWidth={1.5} /> 533 836 666</a>
        <button type="button" className="focus-ring flex h-11 w-11 items-center justify-center text-[#f4efe6] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {menuOpen && <nav className="mobile-menu border-t border-[#f4efe6]/15 bg-[#1f2d2b] px-6 py-5 md:hidden" aria-label="Nawigacja mobilna">
        <div className="flex flex-col gap-4">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="focus-ring text-sm font-semibold uppercase tracking-[.13em] text-[#f4efe6]" data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}>{item.label}</a>)}
          <a href="tel:+48533836666" className="flex items-center gap-2 border-t border-[#f4efe6]/15 pt-4 text-sm text-[#f4efe6]/75" data-testid="link-mobile-phone"><Phone size={15} /> 533 836 666</a>
        </div>
      </nav>}
    </header>
  );
}

function Hero() {
  const [videoError, setVideoError] = useState(false);
  return (
    <section id="top" className="hero-fallback relative flex min-h-[680px] items-end overflow-hidden bg-[#1f2d2b] text-[#f4efe6] md:min-h-[790px]">
      {!videoError && <video className="hero-video" autoPlay muted loop playsInline onError={() => setVideoError(true)} aria-label="Fragment filmu przedstawiającego architekturę i światło we wnętrzu"><source src="/amr-hero.mp4" type="video/mp4" /></video>}
      <div className="hero-overlay" />
      <div className="hero-grid absolute inset-0 opacity-50" />
      <Header />
      <div className="section-wrap relative z-10 w-full pb-16 pt-40 md:pb-24">
        <div className="hero-content max-w-4xl">
          <p className="eyebrow mb-6 text-[#d59b7e]">Architektura · wnętrza · Wieluń</p>
          <h1 className="display-title max-w-4xl text-balance text-[clamp(3.6rem,9vw,8.2rem)] leading-[.83]">Przestrzeń,<br /><em className="font-normal text-[#d59b7e]">która zostaje.</em></h1>
          <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-7 text-[#f4efe6]/73 md:text-base">Projektujemy domy i wnętrza z uważnością na światło, materiał i codzienność. Od pierwszej rozmowy do ostatniego detalu.</p>
            <a href="#kontakt" className="focus-ring line-link w-fit text-sm font-semibold text-[#f4efe6]" data-testid="link-hero-contact">Porozmawiajmy <ArrowDown size={16} strokeWidth={1.5} /></a>
          </div>
        </div>
        <div className="mt-20 flex items-end justify-between border-t border-[#f4efe6]/20 pt-4 text-[10px] uppercase tracking-[.14em] text-[#f4efe6]/55">
          <span>AMR / 2026</span><span className="hidden sm:block">Koncepcja — projekt — nadzór</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d59b7e]" /> Wieluń i okolice</span>
        </div>
      </div>
    </section>
  );
}

function StudioSection() {
  return (
    <section id="studio" className="section-pad bg-[#f4efe6]">
      <div className="section-wrap grid gap-14 md:grid-cols-[.75fr_1.25fr] md:gap-24">
        <Reveal className="relative">
          <p className="eyebrow">01 / Studio</p>
          <p className="number-outline absolute -left-1 top-20 md:top-28">01</p>
          <div className="relative mt-24 border-l border-[#b66f4d] pl-5 md:mt-44">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#596760]">Marzena Ratajczyk</p>
            <p className="mt-2 font-display text-3xl italic text-[#1f2d2b]">architekt prowadzący</p>
          </div>
        </Reveal>
        <Reveal className="reveal-delay-1">
          <h2 className="display-title max-w-3xl text-balance text-[clamp(2.7rem,5.5vw,5.3rem)] leading-[.91] text-[#1f2d2b]">Dobra architektura nie krzyczy. <em className="font-normal text-[#b66f4d]">Dobrze się w niej żyje.</em></h2>
          <div className="mt-10 grid gap-7 border-t border-[#d4cbbd] pt-7 text-sm leading-7 text-[#596760] md:grid-cols-2 md:gap-12">
            <p>AMR to kameralna pracownia architektoniczna z Wielunia. Łączymy kompetencje projektowe z bliską, partnerską współpracą — tak, by decyzje dotyczące domu były spokojne i zrozumiałe.</p>
            <p>Wierzymy w rozwiązania ponad sezonem: dobrze ustawione względem słońca, osadzone w miejscu i dopracowane w skali dłoni. Każdy projekt zaczyna się od słuchania.</p>
          </div>
          <a href="#zakres" className="line-link mt-10 text-sm font-semibold text-[#1f2d2b]" data-testid="link-studio-services">Poznaj nasz zakres <ArrowRight size={16} strokeWidth={1.5} /></a>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    ['01', 'Domy jednorodzinne', 'Od analizy działki po projekt wykonawczy. Dom, który ma sens w swoim miejscu i budżecie.'],
    ['02', 'Wnętrza prywatne', 'Spójne wnętrza z planem na codzienność, przechowywanie i ten jeden dobry fotel.'],
    ['03', 'Przebudowy i adaptacje', 'Nowe życie dla istniejącej substancji. Odkrywamy potencjał zamiast zaczynać od zera.'],
    ['04', 'Konsultacje i nadzór', 'Konkretne decyzje na etapie, na którym doświadczenie oszczędza czas, pieniądze i nerwy.'],
  ];
  return (
    <section id="zakres" className="section-pad bg-[#e5dfd4]">
      <div className="section-wrap">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow">02 / Zakres</p><h2 className="display-title mt-5 max-w-2xl text-[clamp(2.7rem,5vw,5rem)] leading-[.9] text-[#1f2d2b]">Od kreski do <em className="font-normal text-[#b66f4d]">klucza.</em></h2></div>
          <p className="max-w-xs text-sm leading-6 text-[#596760]">Wspieramy inwestycje prywatne i komercyjne w Wieluniu oraz okolicznych miejscowościach.</p>
        </Reveal>
        <div className="mt-16 border-t border-[#c6bdaf]">
          {services.map(([number, title, copy], index) => <Reveal key={number} className={`reveal-delay-${Math.min(index + 1, 3)}`}>
            <div className="service-item grid gap-4 border-b border-[#c6bdaf] py-7 md:grid-cols-[5rem_1fr_1fr_auto] md:items-center md:gap-8">
              <span className="font-display text-2xl italic text-[#b66f4d]">{number}</span>
              <h3 className="font-display text-3xl text-[#1f2d2b]">{title}</h3>
              <p className="max-w-sm text-sm leading-6 text-[#596760]">{copy}</p>
              <ArrowUpRight className="hidden text-[#b66f4d] md:block" size={20} strokeWidth={1.4} />
            </div>
          </Reveal>)}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<'Wszystkie' | Project['category']>('Wszystkie');
  const filters: Array<'Wszystkie' | Project['category']> = ['Wszystkie', 'Domy', 'Wnętrza', 'Przebudowy'];
  const filtered = filter === 'Wszystkie' ? projects : projects.filter((project) => project.category === filter);
  return (
    <section id="projekty" className="section-pad bg-[#f4efe6]">
      <div className="section-wrap">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><p className="eyebrow">03 / Wybrane realizacje</p><h2 className="display-title mt-5 max-w-2xl text-[clamp(2.7rem,5.5vw,5.3rem)] leading-[.88] text-[#1f2d2b]">Miejsca z <em className="font-normal text-[#b66f4d]">charakterem.</em></h2></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtruj projekty">
            {filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`focus-ring border px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] transition-colors ${filter === item ? 'border-[#1f2d2b] bg-[#1f2d2b] text-[#f4efe6]' : 'border-[#cfc6b8] text-[#596760] hover:border-[#1f2d2b] hover:text-[#1f2d2b]'}`} aria-pressed={filter === item} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>)}
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2">
          {filtered.map((project, index) => <Reveal key={project.id} className={index % 2 ? 'reveal-delay-1 md:mt-20' : ''}>
            <button type="button" onClick={() => onOpen(project)} className="project-card focus-ring group block w-full text-left" data-testid={`button-project-${project.id}`}>
              <div className={`project-art ${project.className} aspect-[1.12]`}>
                <span className="absolute left-5 top-5 z-10 text-[10px] font-bold uppercase tracking-[.14em] text-[#f4efe6]">{project.category}</span>
                <span className="absolute bottom-5 right-5 z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#f4efe6] opacity-0 transition-opacity group-hover:opacity-100">Otwórz projekt <Plus size={14} /></span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div><h3 className="font-display text-3xl text-[#1f2d2b]">{project.title}</h3><p className="mt-1 text-xs uppercase tracking-[.13em] text-[#7a7e72]">{project.place} · {project.year}</p></div>
                <ArrowUpRight size={19} strokeWidth={1.4} className="mt-2 text-[#b66f4d] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </button>
          </Reveal>)}
        </div>
        <p className="mt-12 text-center text-xs text-[#7a7e72]">Pełny wybór realizacji przedstawiamy podczas pierwszego spotkania.</p>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ['01', 'Rozmowa', 'Poznajemy miejsce, potrzeby i ramy inwestycji. Bez gotowych formularzy — z uważnością.'],
    ['02', 'Kierunek', 'Budujemy koncepcję: układ, światło, materiał. Widzisz, dokąd zmierzamy, zanim powstanie dokumentacja.'],
    ['03', 'Dopracowanie', 'Przekładamy pomysł na dokładne rysunki, uzgodnienia i realny kosztorys.'],
    ['04', 'Realizacja', 'Jesteśmy przy budowie i decyzjach. Pilnujemy, by projekt nie zgubił się po drodze.'],
  ];
  return (
    <section id="proces" className="section-pad bg-[#1f2d2b] text-[#f4efe6]">
      <div className="section-wrap">
        <Reveal><p className="eyebrow text-[#d59b7e]">04 / Współpraca</p><h2 className="display-title mt-5 max-w-3xl text-[clamp(2.7rem,5.5vw,5.3rem)] leading-[.88]">Dobrze zaprojektowany <em className="font-normal text-[#d59b7e]">proces</em> daje spokój.</h2></Reveal>
        <div className="mt-16 grid border-t border-[#f4efe6]/20 md:grid-cols-4">
          {steps.map(([number, title, copy], index) => <Reveal key={number} className={`reveal-delay-${Math.min(index + 1, 3)}`}>
            <div className="border-b border-[#f4efe6]/20 py-7 md:min-h-[280px] md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <span className="font-display text-2xl italic text-[#d59b7e]">{number}</span>
              <h3 className="mt-16 font-display text-3xl">{title}</h3>
              <p className="mt-4 max-w-[15rem] text-sm leading-6 text-[#f4efe6]/60">{copy}</p>
            </div>
          </Reveal>)}
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-[#f4efe6]/20 pt-5 text-xs text-[#f4efe6]/55 sm:flex-row sm:items-center sm:justify-between"><span>Każdy projekt ma swój rytm.</span><span className="flex items-center gap-2"><Clock3 size={15} /> Odpowiadamy w ciągu 2 dni roboczych</span></div>
      </div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section className="section-pad bg-[#e5dfd4]">
      <div className="section-wrap grid gap-12 md:grid-cols-[.7fr_1.3fr] md:items-center md:gap-24">
        <Reveal><p className="eyebrow">05 / Słowa klientów</p><div className="mt-6 flex items-center gap-4"><span className="font-display text-7xl leading-none text-[#1f2d2b]">5.0</span><span className="text-sm leading-5 text-[#596760]">Google<br />4 opinie</span></div><div className="mt-5 flex gap-1 text-[#b66f4d]" aria-label="Ocena 5 na 5"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" /><span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" /><span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" /><span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" /><span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" /></div></Reveal>
        <Reveal className="reveal-delay-1"><Quote className="quote-mark" size={42} fill="currentColor" strokeWidth={0} /><blockquote className="font-display text-[clamp(2rem,4.2vw,4.1rem)] leading-[.95] text-[#1f2d2b]">„Marzena przeprowadziła nas przez cały proces spokojnie i konkretnie. Nagle decyzje, których baliśmy się najbardziej, stały się po prostu kolejnymi krokami.”</blockquote><p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-[#596760]">— Agnieszka i Piotr, projekt domu w Wieluniu</p></Reveal>
      </div>
    </section>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };
  return (
    <section id="kontakt" className="contact-panel section-pad">
      <div className="section-wrap grid gap-16 md:grid-cols-[.85fr_1.15fr] md:gap-24">
        <Reveal>
          <p className="eyebrow text-[#d59b7e]">06 / Kontakt</p>
          <h2 className="display-title mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.84]">Zacznijmy od <em className="font-normal text-[#d59b7e]">miejsca.</em></h2>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#f4efe6]/65">Opowiedz nam, co planujesz. Pierwsza rozmowa pozwoli nazwać potrzeby i sprawdzić, czy to dobry moment na wspólny projekt.</p>
          <div className="mt-12 space-y-5 text-sm">
            <a href="tel:+48533836666" className="focus-ring flex w-fit items-center gap-3 transition-colors hover:text-[#d59b7e]" data-testid="link-contact-phone"><Phone size={16} strokeWidth={1.5} /> 533 836 666</a>
            <a href="mailto:pracownia@amr-architektura.pl" className="focus-ring flex w-fit items-center gap-3 transition-colors hover:text-[#d59b7e]" data-testid="link-contact-email"><Mail size={16} strokeWidth={1.5} /> pracownia@amr-architektura.pl</a>
            <p className="flex items-start gap-3 text-[#f4efe6]/72"><MapPin size={16} className="mt-0.5 shrink-0" strokeWidth={1.5} /> osiedle Kopernika 6/2<br />98-300 Wieluń</p>
          </div>
          <div className="mt-10 border-t border-[#f4efe6]/20 pt-5 text-xs text-[#f4efe6]/55"><p className="mb-2 font-semibold uppercase tracking-[.12em] text-[#f4efe6]/75">Godziny otwarcia</p><p>Poniedziałek – sobota: 08:00–16:00</p><p>Niedziela: zamknięte</p></div>
        </Reveal>
        <Reveal className="reveal-delay-1">
          {submitted ? <div className="contact-success flex min-h-[360px] flex-col justify-center px-7 py-8 md:px-12" role="status" data-testid="status-form-success"><CircleCheck className="text-[#d59b7e]" size={30} strokeWidth={1.4} /><h3 className="mt-7 font-display text-4xl">Dziękujemy za wiadomość.</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#f4efe6]/65">Wrócimy do Ciebie z odpowiedzią w ciągu dwóch dni roboczych.</p><button type="button" onClick={() => setSubmitted(false)} className="focus-ring line-link mt-10 w-fit text-sm font-semibold" data-testid="button-form-new-message">Wyślij kolejną wiadomość <ArrowRight size={16} /></button></div> :
            <form onSubmit={submit} className="border-t border-[#f4efe6]/22 pt-7" data-testid="form-contact">
              <div className="grid gap-8 sm:grid-cols-2"><label className="form-label">Imię i nazwisko<input className="form-input" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Jak możemy się do Ciebie zwracać?" data-testid="input-contact-name" /></label><label className="form-label">E-mail lub telefon<input className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="adres@email.pl / 000 000 000" data-testid="input-contact-email" /></label></div>
              <label className="form-label mt-10 block">O czym chcesz porozmawiać?<textarea className="form-input min-h-28 resize-y" value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="Działka, dom, wnętrze — napisz kilka słów..." data-testid="input-contact-message" /></label>
              <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xs text-[11px] leading-5 text-[#f4efe6]/45">Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.</p><button type="submit" className="focus-ring inline-flex items-center justify-center gap-3 bg-[#b66f4d] px-5 py-3.5 text-xs font-bold uppercase tracking-[.11em] text-[#f4efe6] transition-colors hover:bg-[#d59b7e]" data-testid="button-submit-contact">Wyślij zapytanie <ArrowUpRight size={16} /></button></div>
            </form>}
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="bg-[#1f2d2b] px-6 pb-8 text-[#f4efe6]"><div className="section-wrap border-t border-[#f4efe6]/20 pt-7"><div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between"><p className="text-[11px] font-bold uppercase tracking-[.16em]">AMR Architektura <span className="font-normal text-[#f4efe6]/45">/ Marzena Ratajczyk</span></p><div className="flex items-center gap-6 text-[11px] uppercase tracking-[.12em] text-[#f4efe6]/55"><a href="#top" className="focus-ring transition-colors hover:text-[#f4efe6]" data-testid="link-footer-top">Na górę ↑</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="focus-ring transition-colors hover:text-[#f4efe6]" data-testid="link-footer-instagram"><Instagram size={16} /></a></div></div><div className="mt-10 flex flex-col gap-2 text-[10px] uppercase tracking-[.13em] text-[#f4efe6]/35 sm:flex-row sm:justify-between"><span>© 2026 AMR Architektura</span><span>Architekt Wieluń · projektant wnętrz Wieluń</span></div></div></footer>;
}

function ProjectLightbox({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKeyDown); };
  }, [project, onClose]);
  if (!project) return null;
  return <div className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="lightbox-card grid max-h-[90vh] w-full max-w-5xl overflow-auto bg-[#f4efe6] md:grid-cols-[1.05fr_.95fr]"><div className={`project-art ${project.className} min-h-64 md:min-h-[520px]`}><span className="absolute left-6 top-6 text-[10px] font-bold uppercase tracking-[.14em] text-[#f4efe6]">{project.category} / {project.year}</span></div><div className="relative flex flex-col p-7 md:p-12"><button type="button" onClick={onClose} className="focus-ring absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-[#1f2d2b]" aria-label="Zamknij szczegóły projektu" data-testid="button-close-lightbox"><X size={21} strokeWidth={1.4} /></button><p className="eyebrow">Wybrany projekt</p><h2 id="project-dialog-title" className="display-title mt-6 pr-7 text-5xl leading-[.9] text-[#1f2d2b]">{project.title}</h2><p className="mt-3 text-xs uppercase tracking-[.13em] text-[#7a7e72]">{project.place} · {project.year}</p><p className="mt-9 text-sm leading-7 text-[#596760]">{project.description}</p><div className="mt-auto grid grid-cols-2 gap-3 border-t border-[#d4cbbd] pt-6">{project.facts.map((fact) => <div key={fact} className="flex items-start gap-2 text-xs leading-5 text-[#596760]"><Check size={14} className="mt-0.5 text-[#b66f4d]" />{fact}</div>)}</div><a href="#kontakt" onClick={onClose} className="focus-ring line-link mt-10 w-fit text-sm font-semibold text-[#1f2d2b]" data-testid="link-lightbox-contact">Zapytaj o podobny projekt <ArrowRight size={16} /></a></div></div></div>;
}

function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return <div className="site-shell grain min-h-[100dvh]"><Metadata /><main><Hero /><StudioSection /><ServicesSection /><ProjectsSection onOpen={setSelectedProject} /><ProcessSection /><ReviewSection /><ContactSection /></main><Footer /><ProjectLightbox project={selectedProject} onClose={() => setSelectedProject(null)} /></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;