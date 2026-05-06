import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "ro" | "ru";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.about": { ro: "Despre noi", ru: "О нас" },
  "nav.classes": { ro: "Cursuri", ru: "Занятия" },
  "nav.schedule": { ro: "Orar", ru: "Расписание" },
  "nav.pricing": { ro: "Prețuri", ru: "Цены" },
  "nav.contact": { ro: "Contact", ru: "Контакты" },
  "nav.gallery": { ro: "Galerie", ru: "Галерея" },
  "nav.booking": { ro: "Rezervare", ru: "Запись" },

  // Hero
  "hero.title": {
    ro: "Studio de dans pentru adulți în Chișinău",
    ru: "Танцевальная студия для взрослых в Кишинёве"
  },
  "hero.subtitle": {
    ro: "Descoperă lumea dansului într-un studio modern dedicat adulților.\nLa Prima Dance poți învăța dansuri latino și de societate, îți poți îmbunătăți forma fizică și te poți bucura de mișcare și muzică într-o atmosferă elegantă și prietenoasă.",
    ru: "Откройте для себя мир бальных и латинских танцев в современной студии Prima Dance.\nМы обучаем танцам взрослых — от начинающих до тех, кто мечтает выступать на международных соревнованиях."
  },
  "hero.tags": { ro: "Latin • Ballroom • Pro-Am", ru: "Latin • Ballroom • Pro-Am" },
  "hero.cta": { ro: "Programează-te", ru: "Записаться" },

  // About
  "about.title": { ro: "Despre studio", ru: "О студии" },
  "about.welcome": {
    ro: "Bine ai venit la Prima Dance",
    ru: "Добро пожаловать в Prima Dance"
  },
  "about.text1": {
    ro: "Prima Dance este un studio de dans din Chișinău creat special pentru adulți care își doresc să învețe să danseze, să se dezvolte și să descopere bucuria dansului.",
    ru: "Prima Dance — это современная танцевальная студия в Кишинёве, созданная для взрослых, которые хотят научиться красиво танцевать, улучшить физическую форму и получить удовольствие от движения и музыки."
  },
  "about.text2": {
    ro: "În studioul nostru se întâlnesc oameni care vin să danseze pentru plăcere, pentru sănătate, pentru socializare sau pentru a participa la competiții.",
    ru: "Наша студия объединяет людей, которые приходят танцевать для себя, для настроения, для спорта или для участия в соревнованиях."
  },
  "about.listTitle": {
    ro: "La Prima Dance vei găsi:",
    ru: "В Prima Dance вы найдете:"
  },
  "about.list1": {
    ro: "o sală de dans spațioasă și profesional echipată",
    ru: "просторный профессиональный танцевальный зал"
  },
  "about.list2": {
    ro: "antrenori experimentați",
    ru: "опытных тренеров"
  },
  "about.list3": {
    ro: "o atmosferă confortabilă și elegantă",
    ru: "комфортную атмосферу"
  },
  "about.list4": {
    ro: "programe moderne de antrenament",
    ru: "современные программы тренировок"
  },
  "about.closing": {
    ro: "Lucrăm cu persoane de orice nivel — de la începători care fac primii pași în dans până la cei care se pregătesc pentru competiții internaționale.",
    ru: "Мы работаем с учениками любого уровня — от тех, кто делает первые шаги в танце, до тех, кто готовится к выступлениям на международных турнирах."
  },

  // Classes
  "classes.title": { ro: "Cursuri", ru: "Занятия" },
  "class.stretching": { ro: "Stretching", ru: "Stretching" },
  "class.stretching.desc": {
    ro: "Exerciții pentru îmbunătățirea mobilității articulațiilor și elasticității mușchilor.",
    ru: "Тренировка для улучшения подвижности суставов и эластичности мышц."
  },
  "class.relax": { ro: "Relax Time", ru: "Relax Time" },
  "class.relax.desc": {
    ro: "Relaxare și întindere blândă a mușchilor după antrenamente intense.",
    ru: "Расслабление и мягкое вытяжение мышц после активных тренировок."
  },
  "class.totalbody": { ro: "Total Body", ru: "Total Body" },
  "class.totalbody.desc": {
    ro: "Exerciții pentru tonifierea musculaturii și un corp suplu și bine definit.",
    ru: "Комплекс для тонуса мышц и подтянутого спортивного силуэта."
  },
  "class.latintechnique": { ro: "Latin Technique", ru: "Latin Technique" },
  "class.latintechnique.desc": {
    ro: "Exersarea tehnicii elementelor latine de bază și avansate.",
    ru: "Отработка техники базовых и продвинутых латинских элементов."
  },
  "class.latinhits": { ro: "Latin Hits", ru: "Latin Hits" },
  "class.latinhits.desc": {
    ro: "Învățarea de combinații și dansuri noi în stilul latino sportiv.",
    ru: "Изучение новых связок и танцев по спортивно-бальной латине."
  },
  "class.dance": { ro: "Dance", ru: "Dance" },
  "class.dance.desc": {
    ro: "Antrenament de o oră și jumătate, cu încălzire, revenire, dansuri latine și sociale, potrivit pentru toate nivelurile.",
    ru: "Полуторачасовая тренировка с разминкой, заминкой, латинскими и социальными танцами для любого уровня."
  },
  "class.dancemix": { ro: "Dance Mix", ru: "Dance Mix" },
  "class.dancemix.desc": {
    ro: "Dans continuu și dinamic pe muzică, cu învățarea combinațiilor, fără exerciții tehnice detaliate.",
    ru: "Динамичное непрерывное танцевание под музыку с изучением связок, без разбора техники."
  },

  // Schedule
  "schedule.title": { ro: "Orar", ru: "Расписание" },
  "schedule.mon": { ro: "Luni", ru: "Понедельник" },
  "schedule.tue": { ro: "Marți", ru: "Вторник" },
  "schedule.wed": { ro: "Miercuri", ru: "Среда" },
  "schedule.thu": { ro: "Joi", ru: "Четверг" },
  "schedule.fri": { ro: "Vineri", ru: "Пятница" },
  "schedule.sat": { ro: "Sâmbătă", ru: "Суббота" },
  "schedule.sun": { ro: "Duminică", ru: "Воскресенье" },
  "schedule.noclass": { ro: "Fără cursuri programate", ru: "Нет запланированных занятий" },
  "schedule.foreveryone": { ro: "pentru toți", ru: "для всех" },

  // Pricing
  "pricing.title": { ro: "Prețuri", ru: "Цены" },
  "pricing.group": { ro: "Cursuri de grup", ru: "Групповые занятия" },
  "pricing.personal": { ro: "Lecții personale", ru: "Персональные занятия" },
  "pricing.minutes": { ro: "55 minute", ru: "55 минут" },
  "pricing.lessons": { ro: "lecții", ru: "занятий" },
  "pricing.lesson": { ro: "lecție", ru: "занятие" },
  "pricing.unlimited": { ro: "Lunar nelimitat", ru: "Безлимит на месяц" },
  "pricing.rules.title": { ro: "Reguli", ru: "Правила" },
  "pricing.rules.text": {
    ro: "Plata în avans este necesară! Dacă anulați un curs cu mai puțin de 6 ore în avans sau fără notificare prealabilă, cursul va fi anulat și nu se va acorda rambursare.",
    ru: "Запись по предоплате! В случае отмены тренировки менее чем за 6 часов или без предупреждения, занятие списывается без возврата средств."
  },

  // Contact
  "contact.title": { ro: "Contact", ru: "Контакты" },
  "contact.address": { ro: "Chișinău, Moldova", ru: "Кишинёв, Молдова" },
  "footer.rights": { ro: "Toate drepturile rezervate.", ru: "Все права защищены." },

  // Booking
  "booking.title": { ro: "Rezervare", ru: "Запись" },
  "booking.subtitle": { ro: "Alege cursul, data și ora", ru: "Выберите занятие, дату и время" },
  "booking.selectClass": { ro: "Alege cursul", ru: "Выберите занятие" },
  "booking.selectDate": { ro: "Alege data", ru: "Выберите дату" },
  "booking.selectTime": { ro: "Alege ora", ru: "Выберите время" },
  "booking.yourDetails": { ro: "Datele tale", ru: "Ваши данные" },
  "booking.continue": { ro: "Continuă", ru: "Продолжить" },
  "booking.confirm": { ro: "Confirmă rezervarea", ru: "Подтвердить запись" },
  "booking.back": { ro: "Înapoi", ru: "Назад" },
  "booking.backToSite": { ro: "Înapoi la site", ru: "Назад на сайт" },
  "booking.success": { ro: "Rezervare confirmată!", ru: "Запись подтверждена!" },
  "booking.class": { ro: "Curs", ru: "Занятие" },
  "booking.date": { ro: "Data", ru: "Дата" },
  "booking.time": { ro: "Ora", ru: "Время" },
  "booking.full": { ro: "Complet", ru: "Мест нет" },
  "booking.spotsLeft": { ro: "locuri libere", ru: "мест свободно" },
  "booking.namePlaceholder": { ro: "Numele complet", ru: "Полное имя" },
  "booking.phonePlaceholder": { ro: "Număr de telefon", ru: "Номер телефона" },
  "booking.emailPlaceholder": { ro: "Adresa de email", ru: "Электронная почта" },
  "booking.fillAll": { ro: "Completează toate câmpurile", ru: "Заполните все поля" },
  "booking.alreadyBooked": { ro: "Ați rezervat deja acest curs", ru: "Вы уже записаны на это занятие" },
  "booking.classFull": { ro: "Clasa este complet rezervată.", ru: "Места закончились." },
  "booking.spotsRemaining": { ro: "Locuri rămase", ru: "Осталось мест" },
  "booking.totalSpots": { ro: "Total locuri", ru: "Всего мест" },

  // Overlay
  "overlay.quote": { ro: "Dansul este poezia piciorului.", ru: "Танец — это поэзия ног." },

  // Gallery
  "gallery.title": { ro: "Galerie", ru: "Галерея" },
  "gallery.subtitle": { ro: "Momente din studio", ru: "Моменты из студии" },
  "gallery.tour.title": { ro: "Tur Prima Dance", ru: "Тур по Prima Dance" },
  "gallery.tour.subtitle": { ro: "Vizitează studioul nostru", ru: "Загляните в нашу студию" },

  // Account
  "nav.account": { ro: "Contul Meu", ru: "Мой аккаунт" },
  "account.title": { ro: "Contul Meu", ru: "Мой аккаунт" },
  "account.subtitle": { ro: "Verifică programările tale", ru: "Проверьте свои записи" },
  "account.emailLabel": { ro: "Adresa ta de email", ru: "Ваш email" },
  "account.search": { ro: "Vezi programările", ru: "Показать записи" },
  "account.empty": { ro: "Nu există programări asociate acestui email.", ru: "Для этого email нет записей." },
  "account.found": { ro: "Programările tale", ru: "Ваши записи" },
  "account.sendCode": { ro: "Trimite codul", ru: "Отправить код" },
  "account.codeHint": { ro: "Vei primi un cod de verificare pe email. Verifică și folderul Spam.", ru: "Вы получите код подтверждения на email. Проверьте также папку Спам." },
  "account.enterCode": { ro: "Introdu codul", ru: "Введите код" },
  "account.verify": { ro: "Verifică", ru: "Подтвердить" },
  "account.resend": { ro: "Retrimite codul", ru: "Отправить код повторно" },
  "account.codeSent": { ro: "Codul a fost trimis pe email. Verifică și Spam!", ru: "Код отправлен на email. Проверьте папку Спам!" },
  "account.invalidCode": { ro: "Cod invalid. Încearcă din nou.", ru: "Неверный код. Попробуйте снова." },
  "account.error": { ro: "A apărut o eroare", ru: "Произошла ошибка" },
  "account.logout": { ro: "Deconectare", ru: "Выйти" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ro");

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
