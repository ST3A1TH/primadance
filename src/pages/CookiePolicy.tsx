import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { CONSENT_EVENT, getConsent, setConsent, type CookieConsent } from "@/lib/cookie-consent";

type Section = { h: string; p?: string[]; list?: string[] };

const content: Record<"ro" | "ru", { title: string; intro: string; updated: string; sections: Section[]; table: string[][]; tableHead: string[] }> = {
  ro: {
    title: "Politica privind cookie-urile",
    updated: "Ultima actualizare: 3 octombrie 2026",
    intro:
      "Această politică explică ce sunt cookie-urile, cum le folosește site-ul Prima Dance (primadance.md) și cum îți poți gestiona preferințele în orice moment.",
    sections: [
      {
        h: "Ce sunt cookie-urile",
        p: [
          "Cookie-urile sunt fișiere text de mici dimensiuni pe care un site le salvează în browserul tău. Ele permit site-ului să funcționeze corect, să-ți rețină alegerile și să ne ajute să înțelegem cum este folosit, pentru a-l îmbunătăți.",
        ],
      },
      {
        h: "Ce tipuri de cookie-uri folosim",
        list: [
          "Cookie-uri strict necesare — asigură funcționarea de bază a site-ului (de exemplu, reținerea alegerii tale privind cookie-urile sau autentificarea în contul tău). Acestea nu pot fi dezactivate.",
          "Cookie-uri de analiză și marketing — prin Google Analytics și Google Tag Manager aflăm câte persoane vizitează site-ul, ce pagini sunt cele mai utile și cât de eficiente sunt campaniile noastre. Acestea sunt activate doar dacă îți exprimi acordul.",
        ],
      },
      {
        h: "Servicii terțe",
        p: [
          "Pentru programări folosim widget-ul Altegio, iar pe paginile galeriei pot fi afișate materiale video. Acești furnizori pot seta propriile cookie-uri atunci când interacționezi cu serviciile lor, conform politicilor lor de confidențialitate.",
          "Folosim Google Consent Mode: până nu accepți, scripturile Google de analiză și publicitate nu sunt încărcate și nu se setează cookie-uri de urmărire.",
        ],
      },
      {
        h: "Cum îți gestionezi preferințele",
        p: [
          "Poți accepta sau refuza cookie-urile neesențiale din bannerul afișat la prima vizită. Îți poți schimba decizia oricând folosind butoanele de mai jos. De asemenea, poți șterge sau bloca cookie-urile din setările browserului, însă unele funcții ale site-ului pot să nu mai funcționeze corect.",
        ],
      },
      {
        h: "Contact",
        p: [
          "Pentru întrebări legate de această politică ne poți scrie pe Instagram @primadancemd sau ne poți suna la +373 61 100 499.",
        ],
      },
    ],
    tableHead: ["Cookie", "Furnizor", "Scop", "Durată"],
    table: [
      ["pd_cookie_consent", "Prima Dance", "Reține alegerea ta privind cookie-urile (necesar)", "Până la ștergere"],
      ["_ga, _ga_*", "Google Analytics", "Statistici anonime de vizitare (analiză)", "2 ani"],
      ["_gid", "Google Analytics", "Diferențierea vizitatorilor (analiză)", "24 de ore"],
      ["_gcl_*", "Google", "Măsurarea eficienței reclamelor (marketing)", "90 de zile"],
    ],
  },
  ru: {
    title: "Политика использования файлов cookie",
    updated: "Последнее обновление: 3 октября 2026 г.",
    intro:
      "Эта политика объясняет, что такое файлы cookie, как их использует сайт Prima Dance (primadance.md) и как вы можете в любой момент управлять своими настройками.",
    sections: [
      {
        h: "Что такое файлы cookie",
        p: [
          "Файлы cookie — это небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Они обеспечивают корректную работу сайта, запоминают ваш выбор и помогают нам понять, как используется сайт, чтобы делать его лучше.",
        ],
      },
      {
        h: "Какие файлы cookie мы используем",
        list: [
          "Строго необходимые — обеспечивают базовую работу сайта (например, запоминают ваш выбор в отношении cookie или вход в личный кабинет). Их нельзя отключить.",
          "Аналитические и маркетинговые — с помощью Google Analytics и Google Tag Manager мы узнаём, сколько людей посещают сайт, какие страницы наиболее полезны и насколько эффективна наша реклама. Они включаются только с вашего согласия.",
        ],
      },
      {
        h: "Сторонние сервисы",
        p: [
          "Для онлайн-записи мы используем виджет Altegio, а на страницах галереи могут отображаться видео. Эти сервисы могут устанавливать собственные файлы cookie при взаимодействии с ними в соответствии со своими политиками конфиденциальности.",
          "Мы используем Google Consent Mode: пока вы не дадите согласие, аналитические и рекламные скрипты Google не загружаются и отслеживающие файлы cookie не устанавливаются.",
        ],
      },
      {
        h: "Как управлять настройками",
        p: [
          "Вы можете принять или отклонить необязательные файлы cookie в баннере при первом посещении. Изменить решение можно в любое время с помощью кнопок ниже. Также вы можете удалить или заблокировать cookie в настройках браузера, однако некоторые функции сайта могут работать некорректно.",
        ],
      },
      {
        h: "Контакты",
        p: [
          "По вопросам, связанным с этой политикой, напишите нам в Instagram @primadancemd или позвоните по номеру +373 61 100 499.",
        ],
      },
    ],
    tableHead: ["Cookie", "Поставщик", "Назначение", "Срок"],
    table: [
      ["pd_cookie_consent", "Prima Dance", "Запоминает ваш выбор по cookie (необходимый)", "До удаления"],
      ["_ga, _ga_*", "Google Analytics", "Анонимная статистика посещений (аналитика)", "2 года"],
      ["_gid", "Google Analytics", "Различение посетителей (аналитика)", "24 часа"],
      ["_gcl_*", "Google", "Оценка эффективности рекламы (маркетинг)", "90 дней"],
    ],
  },
};

const CookiePolicy = () => {
  const { lang, t } = useLanguage();
  const c = content[lang];
  const [consent, setLocal] = useState<CookieConsent | null>(getConsent());

  useEffect(() => {
    const sync = () => setLocal(getConsent());
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  const status = consent === null ? t("cookies.statusNone") : consent.analytics ? t("cookies.statusAccepted") : t("cookies.statusDeclined");

  return (
    <>
      <SEOHead
        title={lang === "ro" ? "Politica Cookie | Prima Dance" : "Политика Cookie | Prima Dance"}
        description={c.intro}
        canonical="https://www.primadance.md/cookie-policy"
        lang={lang}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body mb-8">
              <ArrowLeft className="w-4 h-4" />
              {lang === "ro" ? "Înapoi" : "Назад"}
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-wide">{c.title}</h1>
            <p className="text-muted-foreground text-xs font-body mb-8">{c.updated}</p>
            <p className="text-muted-foreground font-body leading-relaxed mb-10">{c.intro}</p>

            <section id="settings" className="border border-border p-6 mb-12">
              <h2 className="font-display text-2xl text-foreground mb-2">{t("cookies.settingsTitle")}</h2>
              <p className="text-sm font-body text-muted-foreground mb-5">
                {t("cookies.currentStatus")}: <span className="text-foreground">{status}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => setConsent(false)} className="border border-border px-5 py-2.5 text-xs font-body uppercase tracking-wider text-foreground hover:bg-muted transition-colors">
                  {t("cookies.decline")}
                </button>
                <button onClick={() => setConsent(true)} className="bg-foreground text-background px-5 py-2.5 text-xs font-body uppercase tracking-wider hover:opacity-85 transition-opacity">
                  {t("cookies.accept")}
                </button>
              </div>
            </section>

            {c.sections.map((s) => (
              <section key={s.h} className="mb-10">
                <h2 className="font-display text-2xl text-foreground mb-3">{s.h}</h2>
                {s.p?.map((p) => (
                  <p key={p} className="text-muted-foreground font-body text-sm leading-relaxed mb-3">{p}</p>
                ))}
                {s.list && (
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-body text-sm leading-relaxed">
                    {s.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )}
                {s === c.sections[1] && (
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full text-left text-sm font-body border-t border-border">
                      <thead>
                        <tr>{c.tableHead.map((h) => <th key={h} className="py-3 pr-4 text-foreground font-medium border-b border-border">{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {c.table.map((row) => (
                          <tr key={row[0]} className="border-b border-border">
                            {row.map((cell, i) => <td key={i} className="py-3 pr-4 text-muted-foreground align-top">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default CookiePolicy;
