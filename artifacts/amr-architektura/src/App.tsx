import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Quote,
  X,
} from 'lucide-react';
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
  image: string;
  position: string;
  facts: string[];
};

const projects: Project[] = [
  {
    id: 'mlynarska',
    title: 'Dom z ogrodem',
    category: 'Domy',
    place: 'Wieluń',
    year: '2024',
    description: 'Dom, który porządkuje relację między prywatnością a ogrodem. Prosta bryła, miękkie światło i materiały, które dojrzewają razem z mieszkańcami.',
    image: '/amr-archive-01.png',
    position: 'center',
    facts: ['184 m²', 'projekt kompleksowy', 'realizacja 2025'],
  },
  {
    id: 'tarninowa',
    title: 'Willa przy lesie',
    category: 'Wnętrza',
    place: 'Sieradz',
    year: '2023',
    description: 'Wnętrze apartamentu zbudowane wokół ciszy: wapienne powierzchnie, naturalny dąb i detal bez zbędnego gestu.',
    image: '/amr-archive-02.png',
    position: 'center',
    facts: ['92 m²', 'projekt wnętrz', 'nadzór autorski'],
  },
  {
    id: 'pod-lasem',
    title: 'Inwestycja mieszkaniowa',
    category: 'Domy',
    place: 'okolice Wielunia',
    year: '2022',
    description: 'Kameralny dom jednorodzinny wpisany w pochyłą działkę. Najważniejszym widokiem pozostaje ten, który zmienia się przez cały dzień.',
    image: '/amr-archive-03.png',
    position: 'center',
    facts: ['146 m²', 'projekt budowlany', 'koncepcja 2022'],
  },
  {
    id: 'ruda',
    title: 'GOKiS w Wieruszowie',
    category: 'Przebudowy',
    place: 'Ruda',
    year: '2024',
    description: 'Przebudowa domu z lat 80. bez udawania nowego początku. Odzyskana wysokość, otwarte parterowe wnętrze i kolor terakoty.',
    image: '/amr-archive-04.png',
    position: 'center',
    facts: ['128 m²', 'przebudowa', 'konsultacje materiałowe'],
  },
  {
    id: 'nad-rzeka',
    title: 'Budynek użyteczności publicznej',
    category: 'Domy',
    place: 'Wieruszów',
    year: '2021',
    description: 'Cichy dom z widokiem na dolinę. Jego plan zaczyna się od porannego światła i kończy na tarasie.',
    image: '/amr-archive-05.png',
    position: 'center',
    facts: ['164 m²', 'koncepcja architektoniczna', 'projekt wnętrz'],
  },
  {
    id: 'nowa-bryla',
    title: 'Kuchnia – dąb i beton',
    category: 'Domy',
    place: 'Wieluń',
    year: '2025',
    description: 'Współczesna bryła zaprojektowana jako spokojne tło dla codzienności.',
    image: '/amr-archive-06.png',
    position: 'center',
    facts: ['projekt budowlany', 'detal elewacji', 'nadzór autorski'],
  },
  {
    id: 'kuchnia-z-widokiem',
    title: 'Schody w świetle',
    category: 'Wnętrza',
    place: 'okolice Wielunia',
    year: '2025',
    description: 'Ciepłe wnętrze kuchni, w którym naturalne drewno spotyka się z miękkim światłem.',
    image: '/amr-archive-07.png',
    position: 'center',
    facts: ['projekt wnętrz', 'materiały naturalne', 'zabudowa na wymiar'],
  },
  {
    id: 'schody',
    title: 'Salon złotej godziny',
    category: 'Wnętrza',
    place: 'Sieradz',
    year: '2024',
    description: 'Rzeźbiarskie schody i światło, które prowadzą przez wnętrze.',
    image: '/amr-archive-08.png',
    position: 'center',
    facts: ['detal wnętrza', 'konsultacje materiałowe', 'projekt kompleksowy'],
  },
  {
    id: 'salon-z-widokiem',
    title: 'Salon z widokiem',
    category: 'Wnętrza',
    place: 'Wieruszów',
    year: '2024',
    description: 'Przestrzeń dzienna otwarta na ogród, zbudowana wokół spokoju i naturalnych materiałów.',
    image: '/amr-project-09.png',
    position: 'center',
    facts: ['projekt wnętrz', 'układ funkcjonalny', 'nadzór autorski'],
  },
  {
    id: 'wieczorny-rytm',
    title: 'Wieczorny rytm',
    category: 'Wnętrza',
    place: 'Wieluń',
    year: '2023',
    description: 'Kameralna sypialnia, w której materiały i światło budują poczucie wyciszenia.',
    image: '/amr-project-10.png',
    position: 'center',
    facts: ['projekt wnętrz', 'koncepcja materiałowa', 'aranżacja'],
  },
];

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Usługi', href: '#uslugi' },
  { label: 'Realizacje', href: '#realizacje' },
  { label: 'Proces', href: '#proces' },
  { label: 'Opinie', href: '#opinie' },
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
    document.title = 'AMR Architektura — Marzena Ratajczyk';
    const description = 'AMR Architektura Marzena Ratajczyk — architektura i wnętrza w Wieluniu.';
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, []);
  return null;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b border-transparent header-transition ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="section-wrap flex h-[72px] items-center justify-between">
        <a href="#top" className="focus-ring flex items-center text-[#eee7d9]" aria-label="AMR Architektura — strona główna" data-testid="link-logo">
          <span className="font-display text-[17px] leading-none tracking-[-.02em]">AMR</span>
          <span className="ml-2 border-l border-[#eee7d9]/35 pl-2 text-[9px] uppercase tracking-[.2em] text-[#eee7d9]/75">Architektura</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Główna nawigacja">
          {navItems.map((item) => <a key={item.href} href={item.href} className="focus-ring text-[9px] font-medium uppercase tracking-[.18em] text-[#eee7d9]/65 transition-colors hover:text-[#eee7d9]" data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</a>)}
        </nav>
        <a href="#kontakt" className="focus-ring hidden border border-[#eee7d9]/32 px-4 py-2.5 text-[9px] font-medium uppercase tracking-[.17em] text-[#eee7d9] transition-colors hover:border-[#b45e36] hover:text-[#e08a61] sm:block" data-testid="link-header-consultation">Umów konsultację</a>
        <button type="button" className="focus-ring flex h-10 w-10 items-center justify-center text-[#eee7d9] lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {menuOpen && <nav className="mobile-menu border-t border-[#eee7d9]/15 bg-[#17120d] px-6 py-6 lg:hidden" aria-label="Nawigacja mobilna">
        <div className="flex flex-col gap-5">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="focus-ring text-xs font-medium uppercase tracking-[.18em] text-[#eee7d9]" data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}>{item.label}</a>)}
          <a href="#kontakt" onClick={() => setMenuOpen(false)} className="mt-2 border-t border-[#eee7d9]/15 pt-5 text-xs uppercase tracking-[.18em] text-[#d4754b]" data-testid="link-mobile-consultation">Umów konsultację <ArrowUpRight className="ml-2 inline" size={14} /></a>
        </div>
      </nav>}
    </header>
  );
}

function Hero() {
  const [videoError, setVideoError] = useState(false);
  return (
    <section id="top" className="hero-fallback relative flex min-h-[720px] items-end overflow-hidden text-[#eee7d9] md:min-h-[100svh]">
      {!videoError && <video className="hero-video" autoPlay muted loop playsInline poster="/amr-hero-poster.jpg" onError={() => setVideoError(true)} aria-label="Ujęcie z lotu ptaka nad Wieluniem"><source src="/amr-hero.mp4" type="video/mp4" /></video>}
      {videoError && <img className="hero-video" src="/amr-hero-poster.jpg" alt="" />}
      <div className="hero-overlay" />
      <div className="hero-grid absolute inset-0 opacity-50" />
      <Header />
      <div className="section-wrap relative z-10 w-full pb-8 pt-36 md:pb-10">
        <div className="absolute left-0 top-28 text-[9px] uppercase tracking-[.2em] text-[#eee7d9]/60">Wieluń, Polska</div>
        <div className="absolute right-0 top-28 text-right text-[9px] uppercase tracking-[.2em] text-[#eee7d9]/60">Architektura / wnętrza / projekty</div>
        <div className="hero-content max-w-3xl">
          <p className="mb-8 flex items-baseline gap-3 font-display uppercase leading-none tracking-[.13em] text-[#eee7d9]"><span className="text-[clamp(2.3rem,4.5vw,3.1rem)] tracking-[.02em]">AMR</span><span className="text-[clamp(.82rem,1.4vw,1rem)] tracking-[.2em] text-[#eee7d9]/75">ARCHITEKTURA</span></p>
          <h1 className="display-title max-w-3xl text-[clamp(2.4rem,5vw,4.3rem)] leading-[.82]">Dziedzictwo<br /><em className="font-normal text-[#d4774e]">projektowane z intencją.</em></h1>
          <div className="mt-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between md:mt-24">
            <p className="max-w-md text-sm leading-6 text-[#eee7d9]/70 md:text-[15px]">AMR Architektura — biuro Marzeny Ratajczyk. Projektujemy miejsca, które dobrze starzeją się razem z ludźmi.</p>
            <div className="flex shrink-0 items-center gap-6">
              <a href="#realizacje" className="focus-ring line-link text-[10px] font-medium uppercase tracking-[.18em]" data-testid="link-hero-projects">Zobacz realizacje <ArrowRight size={14} /></a>
              <a href="#kontakt" className="focus-ring border border-[#d4774e] bg-[#9a4525]/80 px-4 py-3 text-[10px] font-medium uppercase tracking-[.16em] transition-colors hover:bg-[#b45e36]" data-testid="link-hero-contact">Umów konsultację <ArrowUpRight className="ml-2 inline" size={14} /></a>
            </div>
          </div>
        </div>
        <div className="mt-20 flex items-center justify-between border-t border-[#eee7d9]/20 pt-4 text-[9px] uppercase tracking-[.18em] text-[#eee7d9]/50">
          <span>AMR / 2026</span><span className="hidden sm:block">Koncepcja — projekt — nadzór</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d4774e]" /> przewiń</span>
        </div>
      </div>
    </section>
  );
}

function StudioSection() {
  return (
    <section id="studio" className="section-pad bg-[#17120d]">
      <div className="section-wrap">
        <Reveal><div className="flex items-center gap-4 border-b border-[#eee7d9]/15 pb-4"><p className="eyebrow">01 / Studio</p><span className="h-px flex-1 bg-[#eee7d9]/10" /></div></Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <Reveal className="relative">
            <h2 className="display-title max-w-md text-[clamp(2.7rem,5vw,5.2rem)] leading-[.86] text-[#eee7d9]">Biuro zbudowane<br />na <em className="font-normal text-[#d4774e]">indywidualnym</em><br />podejściu — na każdym etapie.</h2>
            <p className="mt-8 max-w-sm text-sm leading-6 text-[#eee7d9]/58">Marzena Ratajczyk założyła AMR Architektura z prostego przekonania: dom — jak dziedzictwo — kształtuje tysiąc cichych decyzji. Każda z nich zasługuje na uwagę.</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#eee7d9]/58">Od pierwszego szkicu do odbioru pracujemy razem — prowadzona, wysłuchana i towarzysząca Ci na każdym etapie inwestycji.</p>
            <div className="mt-10 grid max-w-sm grid-cols-3 border-t border-[#eee7d9]/15 pt-5">
              <div><strong className="font-display text-3xl font-normal text-[#eee7d9]">5,0</strong><span className="mt-1 block text-[8px] uppercase tracking-[.16em] text-[#eee7d9]/45">ocena Google</span></div>
              <div><strong className="font-display text-3xl font-normal text-[#eee7d9]">100%</strong><span className="mt-1 block text-[8px] uppercase tracking-[.16em] text-[#eee7d9]/45">nadzoru nad projektem</span></div>
              <div><strong className="font-display text-3xl font-normal text-[#eee7d9]">5</strong><span className="mt-1 block text-[8px] uppercase tracking-[.16em] text-[#eee7d9]/45">obszarów współpracy</span></div>
            </div>
          </Reveal>
          <Reveal className="reveal-delay-1">
            <figure className="studio-image relative overflow-hidden">
              <img src="/amr-archive-01.png" alt="Dom jednorodzinny zaprojektowany przez AMR Architektura" className="h-full min-h-[420px] w-full object-cover object-center grayscale-[.15] sepia-[.12]" />
              <figcaption className="absolute bottom-0 left-0 border-r border-t border-[#eee7d9]/20 bg-[#17120d]/80 px-4 py-3 text-[9px] uppercase tracking-[.15em] text-[#eee7d9]/75">AMR Architektura / Wieluń</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const services = [
  { number: '01', title: 'Projekty budowlane i wykonawcze', copy: 'Od pierwszego układu funkcjonalnego po rysunek detalu. Dokumentacja, z którą można spokojnie budować.', bullets: ['analiza działki i uwarunkowań', 'projekt budowlany i wykonawczy', 'koordynacja branżowa'] },
  { number: '02', title: 'Koncepcje architektoniczne', copy: 'Kierunek dla nowego miejsca: bryła, światło, materiał i budżet zapisane w jednym czytelnym obrazie.', bullets: ['układy funkcjonalne', 'wizualizacje i moodboardy', 'wariantowanie rozwiązań'] },
  { number: '03', title: 'Inwentaryzacje budowlane', copy: 'Rzetelny zapis istniejącej przestrzeni, który daje dobrą podstawę do decyzji projektowych.', bullets: ['pomiary i dokumentacja', 'ocena stanu istniejącego', 'rysunki inwentaryzacyjne'] },
  { number: '04', title: 'Dokumentacje kosztorysowe', copy: 'Koszt inwestycji nazwany odpowiednio wcześnie. Konkretne zestawienia pomagają projektować w ramach.', bullets: ['przedmiary robót', 'zestawienia materiałowe', 'konsultacje budżetowe'] },
  { number: '05', title: 'Załatwianie spraw urzędowych', copy: 'Prowadzimy formalności, aby proces inwestycji był zrozumiały i nie zatrzymywał się na biurku.', bullets: ['uzgodnienia i opinie', 'kontakt z urzędami', 'kompletowanie wniosków'] },
];

function ServicesSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="uslugi" className="section-pad bg-[#121110]">
      <div className="section-wrap">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
          <div><p className="eyebrow">02 / Usługi</p><h2 className="display-title mt-6 max-w-2xl text-[clamp(3rem,6vw,6rem)] leading-[.82] text-[#eee7d9]">Cała droga projektu —<br /><em className="font-normal text-[#d4774e]">trzymana w jednej ręce.</em></h2></div>
          <p className="max-w-xs text-sm leading-6 text-[#eee7d9]/53">Pięć obszarów, jedna ciągła linia autorska. Każdy zaczyna się tam, gdzie skończył poprzedni — nic nie ginie w tłumaczeniu.</p>
        </Reveal>
        <div className="mt-16 border-t border-[#eee7d9]/15">
          {services.map((service, index) => {
            const isOpen = open === index;
            return <div key={service.number} className={`service-item border-b border-[#eee7d9]/12 ${isOpen ? 'bg-[#eee7d9]/[.025]' : ''}`}>
              <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} className="focus-ring grid w-full grid-cols-[2.8rem_1fr_2rem] items-center gap-4 py-6 text-left md:grid-cols-[4rem_1fr_2rem] md:py-7" aria-expanded={isOpen} aria-controls={`service-panel-${service.number}`} data-testid={`button-service-${service.number}`}>
                <span className="text-[9px] tracking-[.17em] text-[#d4774e]">{service.number}</span>
                <span className="font-display text-[clamp(1.45rem,2.5vw,2.35rem)] text-[#eee7d9]">{service.title}</span>
                <span className="flex h-7 w-7 items-center justify-center border border-[#eee7d9]/22 text-[#eee7d9]/75">{isOpen ? <Minus size={13} /> : <Plus size={13} />}</span>
              </button>
              {isOpen && <div id={`service-panel-${service.number}`} className="grid gap-6 pb-7 pl-[2.8rem] pr-8 md:grid-cols-[4rem_1fr_1fr] md:pl-16">
                <span />
                <p className="max-w-md text-sm leading-6 text-[#eee7d9]/58">{service.copy}</p>
                <ul className="space-y-2 text-[10px] uppercase tracking-[.13em] text-[#eee7d9]/63">{service.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-[#d4774e]" />{bullet}</li>)}</ul>
              </div>}
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<'Wszystkie' | 'Domy' | 'Wnętrza'>('Wszystkie');
  const filters: Array<'Wszystkie' | 'Domy' | 'Wnętrza'> = ['Wszystkie', 'Domy', 'Wnętrza'];
  const archiveProjects = [
    ...projects.slice(0, 8).map((project, index) => ({
      ...project,
      category: (index < 5 ? 'Domy' : 'Wnętrza') as Project['category'],
    })),
    {
      id: 'sypialnia-o-zmierzchu',
      title: 'Sypialnia o zmierzchu',
      category: 'Wnętrza' as const,
      place: '',
      year: '',
      description: 'Przytulna sypialnia o ciepłym klimacie.',
      image: '/amr-archive-09.png',
      position: 'center',
      facts: [],
    },
  ];
  const visibleProjects = filter === 'Wszystkie' ? archiveProjects : archiveProjects.filter((project) => project.category === filter);
  const firstRow = visibleProjects.slice(0, 3);
  const secondRow = visibleProjects.slice(3, 5);
  const thirdRow = visibleProjects.slice(5, 8);
  const fourthRow = visibleProjects.slice(8);
  const renderProject = (project: Project, className = '') => (
    <Reveal key={project.id} className={`archive-item ${className}`}>
      <button type="button" onClick={() => onOpen(project)} className="project-card focus-ring group block w-full text-left" data-testid={`button-project-${project.id}`}>
        <div className="project-art h-full"><img src={project.image} alt={`${project.title} — ${project.category}`} style={{ objectPosition: project.position }} /></div>
      </button>
    </Reveal>
  );
  return (
    <section id="realizacje" className="section-pad bg-[#17120d]">
      <div className="section-wrap">
        <Reveal className="archive-header grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
          <div>
            <p className="eyebrow">03 / Realizacje</p>
            <h2 className="display-title mt-6 max-w-2xl text-[clamp(3rem,6vw,6rem)] leading-[.82] text-[#eee7d9]">Wybrane archiwum<br /><em className="font-normal text-[#d4774e]">przestrzeni i realizacji.</em></h2>
          </div>
          <div className="archive-filters flex flex-wrap gap-5 md:justify-end md:self-start" role="group" aria-label="Filtruj realizacje">
            {filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`focus-ring border-b pb-2 text-[9px] font-medium uppercase tracking-[.17em] transition-colors ${filter === item ? 'border-[#d4774e] text-[#d4774e]' : 'border-transparent text-[#eee7d9]/45 hover:text-[#eee7d9]'}`} aria-pressed={filter === item} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>)}
          </div>
        </Reveal>
        <div key={filter} className="archive-rows archive-rows-transition mt-16">
          <div className="archive-row archive-row-one">
            {firstRow.map((project, index) => renderProject(project, `archive-row-one-item-${index + 1}`))}
          </div>
          {secondRow.length > 0 && <div className="archive-row archive-row-two">
            {secondRow.map((project, index) => renderProject(project, `archive-row-two-item-${index + 1}`))}
          </div>}
          {thirdRow.length > 0 && <div className="archive-row archive-row-three">
            {thirdRow.map((project, index) => renderProject(project, `archive-row-three-item-${index + 1}`))}
          </div>}
          {fourthRow.length > 0 && <div className="archive-row archive-row-four">
            {fourthRow.map((project, index) => renderProject(project, `archive-row-four-item-${index + 1}`))}
          </div>}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ['01', 'Rozmowa', 'Poznajemy miejsce, potrzeby i ramy inwestycji.'],
    ['02', 'Kierunek', 'Budujemy koncepcję: układ, światło, materiał.'],
    ['03', 'Dopracowanie', 'Przekładamy pomysł na dokładne rysunki i realny kosztorys.'],
    ['04', 'Realizacja', 'Jesteśmy przy budowie i decyzjach.'],
    ['05', 'Dobre życie', 'Dom zostaje z Tobą — my zostawiamy dokumentację i spokój.'],
  ];
  return (
    <section id="proces" className="section-pad bg-[#121110] text-[#eee7d9]">
      <div className="section-wrap">
        <Reveal><p className="eyebrow">04 / Proces</p><h2 className="display-title mt-6 max-w-3xl text-[clamp(3rem,6vw,6rem)] leading-[.82]">Pięć kroków do<br /><em className="font-normal text-[#d4774e]">własnego miejsca.</em></h2></Reveal>
        <div className="mt-16 grid border-t border-[#eee7d9]/15 md:grid-cols-5">
          {steps.map(([number, title, copy], index) => <Reveal key={number} className={`reveal-delay-${Math.min(index + 1, 3)}`}><div className="border-b border-[#eee7d9]/15 py-7 md:min-h-[270px] md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"><span className="text-[9px] tracking-[.17em] text-[#d4774e]">{number}</span><h3 className="mt-16 font-display text-2xl">{title}</h3><p className="mt-4 max-w-[11rem] text-xs leading-5 text-[#eee7d9]/52">{copy}</p></div></Reveal>)}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-[#eee7d9]/15 pt-5 text-[10px] uppercase tracking-[.14em] text-[#eee7d9]/43 sm:flex-row sm:items-center sm:justify-between"><span>Każdy projekt ma swój rytm.</span><span className="flex items-center gap-2"><Clock3 size={14} /> odpowiadamy w ciągu 2 dni roboczych</span></div>
      </div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section id="opinie" className="section-pad bg-[#17120d]">
      <div className="section-wrap">
        <Reveal><p className="eyebrow">05 / Opinie</p><h2 className="display-title mt-6 max-w-3xl text-[clamp(3rem,6vw,6rem)] leading-[.82] text-[#eee7d9]">Co mówią klienci, gdy<br /><em className="font-normal text-[#d4774e]">klucze są już w ich ręku.</em></h2></Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Reveal><article className="flex h-full min-h-[300px] flex-col border border-[#eee7d9]/12 bg-[#1d1711] p-7"><span className="font-display text-7xl leading-none text-[#eee7d9]">5,0</span><span className="mt-2 text-[9px] uppercase tracking-[.16em] text-[#eee7d9]/45">/ 5,0 · 4 opinie Google</span><div className="mt-auto border-t border-[#eee7d9]/12 pt-5"><p className="text-[9px] uppercase tracking-[.16em] text-[#eee7d9]/45">Atuty wskazane przez klientów</p><ul className="mt-4 space-y-2 text-xs text-[#eee7d9]/65"><li className="flex gap-2"><span className="text-[#d4774e]">—</span>Czas realizacji</li><li className="flex gap-2"><span className="text-[#d4774e]">—</span>Jakość</li><li className="flex gap-2"><span className="text-[#d4774e]">—</span>Profesjonalizm</li><li className="flex gap-2"><span className="text-[#d4774e]">—</span>Stosunek jakości do ceny</li></ul></div></article></Reveal>
          <Reveal className="reveal-delay-1"><article className="flex h-full min-h-[300px] flex-col border border-[#eee7d9]/12 bg-[#1d1711] p-7"><Quote className="mb-4 text-[#d4774e]" size={25} fill="currentColor" strokeWidth={0} /><blockquote className="font-display text-[1.7rem] leading-[.98] text-[#eee7d9]">„Zdecydowanie POLECAM biuro Pani Marzeny! Zrealizowała indywidualny projekt naszego domu jednorodzinnego — doskonały kontakt i doradztwo na każdym etapie.”</blockquote><p className="mt-auto border-t border-[#eee7d9]/12 pt-5 text-[9px] uppercase tracking-[.16em] text-[#eee7d9]/48">Id · lokalny przewodnik Google</p></article></Reveal>
          <Reveal className="reveal-delay-2"><article className="flex h-full min-h-[300px] flex-col border border-[#eee7d9]/12 bg-[#1d1711] p-7"><Quote className="mb-4 text-[#d4774e]" size={25} fill="currentColor" strokeWidth={0} /><blockquote className="font-display text-3xl leading-[.95] text-[#eee7d9]">„Polecam.”</blockquote><p className="mt-auto border-t border-[#eee7d9]/12 pt-5 text-[9px] uppercase tracking-[.16em] text-[#eee7d9]/48">Agnieszka Stępień<br /><span className="mt-1 block text-[#eee7d9]/30">opinia Google</span></p></article></Reveal>
        </div>
      </div>
    </section>
  );
}

function MapPanel() {
  const [zoom, setZoom] = useState(1);
  return <div className="map-panel relative min-h-[370px] overflow-hidden border border-[#eee7d9]/15" role="img" aria-label="Mapa lokalizacji biura AMR Architektura w Wieluniu">
    <div className="map-scene absolute inset-0" style={{ transform: `scale(${zoom})` }}>
      <div className="map-grid absolute inset-0" />
      <div className="map-road map-road-a" /><div className="map-road map-road-b" /><div className="map-road map-road-c" />
      <div className="absolute left-5 top-5 border border-[#17120d] bg-[#eee7d9] px-3 py-2 text-[9px] font-semibold uppercase tracking-[.14em] text-[#17120d]">Biuro</div>
      <div className="map-pin absolute left-[52%] top-[48%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#17120d] bg-[#b45e36] text-[#eee7d9]"><MapPin size={16} /></div>
      <div className="absolute bottom-4 left-5 bg-[#eee7d9]/80 px-3 py-2 text-[8px] uppercase tracking-[.13em] text-[#17120d]">98-300 Wieluń</div>
      <div className="absolute bottom-4 right-5 text-[8px] uppercase tracking-[.13em] text-[#17120d]/60">18° 34' E / 51° 13' N</div>
    </div>
    <div className="absolute right-4 top-4 z-10 flex flex-col overflow-hidden border border-[#17120d]/25 bg-[#eee7d9]/90 text-[#17120d] shadow-sm">
      <button type="button" onClick={() => setZoom((value) => Math.min(1.65, Number((value + 0.15).toFixed(2))))} className="focus-ring flex h-9 w-9 items-center justify-center border-b border-[#17120d]/20" aria-label="Powiększ mapę" data-testid="button-map-zoom-in"><Plus size={15} /></button>
      <button type="button" onClick={() => setZoom((value) => Math.max(1, Number((value - 0.15).toFixed(2))))} className="focus-ring flex h-9 w-9 items-center justify-center" aria-label="Pomniejsz mapę" data-testid="button-map-zoom-out"><Minus size={15} /></button>
    </div>
  </div>;
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [projectType, setProjectType] = useState('Dom jednorodzinny');
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setName('');
    setContact('');
    setMessage('');
  };
  return (
    <section id="kontakt" className="contact-panel section-pad">
      <div className="section-wrap">
        <Reveal><div className="flex items-center gap-4 border-b border-[#eee7d9]/15 pb-4"><p className="eyebrow">06 / Kontakt</p><span className="h-px flex-1 bg-[#eee7d9]/10" /></div></Reveal>
        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal><h2 className="display-title max-w-xl text-[clamp(3rem,6vw,6rem)] leading-[.82] text-[#eee7d9]">Zacznijmy<br /><em className="font-normal text-[#d4774e]">rozmowę.</em></h2><p className="mt-8 max-w-sm text-sm leading-6 text-[#eee7d9]/58">Opowiedz o przestrzeni, którą nosisz w głowie. Na każdą poważną wiadomość odpowiadamy w ciągu dwóch dni roboczych.</p><div className="mt-12"><MapPanel /></div></Reveal>
          <Reveal className="reveal-delay-1">
            {submitted ? <div className="contact-success flex min-h-[430px] flex-col justify-center px-7 py-8 md:px-12" role="status" data-testid="status-form-success"><CircleCheck className="text-[#d4774e]" size={30} strokeWidth={1.4} /><h3 className="mt-7 font-display text-4xl text-[#eee7d9]">Dziękujemy za wiadomość.</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#eee7d9]/58">Wrócimy do Ciebie z odpowiedzią w ciągu dwóch dni roboczych.</p><button type="button" onClick={() => setSubmitted(false)} className="focus-ring line-link mt-10 w-fit text-sm font-semibold text-[#eee7d9]" data-testid="button-form-new-message">Wyślij kolejną wiadomość <ArrowRight size={16} /></button></div> :
              <form onSubmit={submit} className="border-t border-[#eee7d9]/20 pt-2" data-testid="form-contact">
                <label className="form-label mt-7">Imię<input className="form-input" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Twoje imię" data-testid="input-contact-name" /></label>
                <label className="form-label mt-7">Telefon lub e-mail<input className="form-input" value={contact} onChange={(event) => setContact(event.target.value)} required placeholder="Jak możemy się z Tobą skontaktować?" data-testid="input-contact-contact" /></label>
                <label className="form-label mt-7">Rodzaj projektu<select className="form-input cursor-pointer" value={projectType} onChange={(event) => setProjectType(event.target.value)} data-testid="select-project-type"><option>Dom jednorodzinny</option><option>Wnętrze prywatne</option><option>Przebudowa</option><option>Konsultacja</option><option>Inny projekt</option></select></label>
                <label className="form-label mt-7">Wiadomość<textarea className="form-input min-h-24 resize-y" value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="Opowiedz o przestrzeni, którą nosisz w głowie" data-testid="input-contact-message" /></label>
                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xs text-[10px] leading-5 text-[#eee7d9]/38">Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.</p><button type="submit" className="focus-ring inline-flex items-center justify-center gap-3 bg-[#9a4525] px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[.15em] text-[#eee7d9] transition-colors hover:bg-[#b45e36]" data-testid="button-submit-contact">Umów bezpłatną konsultację <ArrowUpRight size={15} /></button></div>
              </form>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
   return <footer className="bg-[#121110] px-6 pb-8 text-[#eee7d9]"><div className="section-wrap border-t border-[#eee7d9]/15 pt-12"><div className="grid gap-12 md:grid-cols-[1.3fr_.7fr_.8fr]"><div><p className="font-display text-3xl">AMR Architektura</p><p className="mt-2 text-[9px] uppercase tracking-[.18em] text-[#eee7d9]/42">Marzena Ratajczyk / architekt</p><p className="mt-6 max-w-xs text-xs leading-5 text-[#eee7d9]/48">Przestrzeń jako dziedzictwo — projektowana z intencją, budowana na lata.</p></div><div><p className="eyebrow mb-5">Nawigacja</p><div className="grid gap-3 text-xs text-[#eee7d9]/58">{navItems.slice(0, 5).map((item) => <a key={item.href} href={item.href} className="focus-ring transition-colors hover:text-[#eee7d9]" data-testid={`link-footer-${item.label.toLowerCase()}`}>{item.label}</a>)}</div></div><div><p className="eyebrow mb-5">Biuro</p><div className="space-y-2 text-xs leading-5 text-[#eee7d9]/58"><p>osiedle Kopernika 6/2<br />98-300 Wieluń</p><a href="tel:+48533836666" className="focus-ring block hover:text-[#eee7d9]" data-testid="link-footer-phone">533 836 666</a><p>Pon–Sob · 08:00–16:00<br />Niedziela · zamknięte</p></div></div></div><div className="mt-14 border-t border-[#eee7d9]/10 pt-5 text-[9px] uppercase tracking-[.15em] text-[#eee7d9]/30"><span>© 2026 AMR Architektura Marzena Ratajczyk</span></div></div></footer>;
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
  return <div className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="lightbox-card grid max-h-[90vh] w-full max-w-5xl overflow-auto bg-[#1d1711] md:grid-cols-[1.05fr_.95fr]"><div className="project-art min-h-64 md:min-h-[520px]"><img src={project.image} alt="" style={{ objectPosition: project.position }} /><span className="absolute left-6 top-6 z-10 text-[9px] font-medium uppercase tracking-[.17em] text-[#eee7d9]">{project.category} / {project.year}</span></div><div className="relative flex flex-col p-7 md:p-12"><button type="button" onClick={onClose} className="focus-ring absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-[#eee7d9]" aria-label="Zamknij szczegóły projektu" data-testid="button-close-lightbox"><X size={21} strokeWidth={1.4} /></button><p className="eyebrow">Wybrany projekt</p><h2 id="project-dialog-title" className="display-title mt-6 pr-7 text-5xl leading-[.9] text-[#eee7d9]">{project.title}</h2><p className="mt-3 text-[9px] uppercase tracking-[.15em] text-[#eee7d9]/45">{project.place} · {project.year}</p><p className="mt-9 text-sm leading-7 text-[#eee7d9]/62">{project.description}</p><div className="mt-auto grid grid-cols-2 gap-3 border-t border-[#eee7d9]/15 pt-6">{project.facts.map((fact) => <div key={fact} className="flex items-start gap-2 text-xs leading-5 text-[#eee7d9]/62"><Check size={14} className="mt-0.5 text-[#d4774e]" />{fact}</div>)}</div><a href="#kontakt" onClick={onClose} className="focus-ring line-link mt-10 w-fit text-sm font-semibold text-[#eee7d9]" data-testid="link-lightbox-contact">Zapytaj o podobny projekt <ArrowRight size={16} /></a></div></div></div>;
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