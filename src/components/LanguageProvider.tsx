"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'it' | 'en' | 'es' | 'fr' | 'de' | 'ru' | 'ja' | 'zh' | 'ko' | 'hi';
type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  "La Nuova Era dell'Industria Musicale": { 
    it: "La Nuova Era dell'Industria Musicale", 
    en: "The New Era of the Music Industry",
    es: "La Nueva Era de la Industria Musical",
    fr: "La Nouvelle Ère de l'Industrie Musicale",
    de: "Die neue Ära der Musikindustrie",
    ru: "Новая эра музыкальной индустрии",
    ja: "音楽産業の新時代",
    zh: "音乐产业的新纪元",
    ko: "음악 산업의 새로운 시대",
    hi: "संगीत उद्योग का नया युग"
  },
  "Accesso Anticipato Chiuso": { 
    it: "Accesso Anticipato Chiuso", 
    en: "Early Access Closed",
    es: "Acceso Anticipado Cerrado",
    fr: "Accès Anticipé Fermé",
    de: "Vorabzugang Geschlossen",
    ru: "Ранний доступ закрыт",
    ja: "早期アクセス終了",
    zh: "抢先体验已关闭",
    ko: "사전 참여 종료",
    hi: "प्रारंभिक पहुँच बंद"
  },
  "Benvenuto a Bordo!": { 
    it: "Benvenuto a Bordo!", 
    en: "Welcome Aboard!",
    es: "¡Bienvenido a Bordo!",
    fr: "Bienvenue à Bord !",
    de: "Willkommen an Bord!",
    ru: "Добро пожаловать на борт!",
    ja: "ようこそ！",
    zh: "欢迎加入！",
    ko: "환영합니다!",
    hi: "स्वागत है!"
  },
  "Questa email è già in lista d'attesa!": { 
    it: "Questa email è già in lista d'attesa!", 
    en: "This email is already on the waitlist!",
    es: "¡Este correo ya está en la lista de espera!",
    fr: "Cet e-mail est déjà sur la liste d'attente !",
    de: "Diese E-Mail steht bereits auf der Warteliste!",
    ru: "Этот email уже в списке ожидания!",
    ja: "このメールアドレスは既に順番待ちリストに登録されています！",
    zh: "此邮箱已在候补名单中！",
    ko: "이 이메일은 이미 대기자 명단에 있습니다!",
    hi: "यह ईमेल पहले से ही प्रतीक्षा सूची में है!"
  },
  "Errore di connessione. Riprova.": { 
    it: "Errore di connessione. Riprova.", 
    en: "Connection error. Please try again.",
    es: "Error de conexión. Inténtalo de nuevo.",
    fr: "Erreur de connexion. Veuillez réessayer.",
    de: "Verbindungsfehler. Bitte versuchen Sie es erneut.",
    ru: "Ошибка подключения. Пожалуйста, попробуйте снова.",
    ja: "接続エラー。もう一度お試しください。",
    zh: "连接错误。请重试。",
    ko: "연결 오류. 다시 시도해 주세요.",
    hi: "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।"
  },
  "La tua email": { 
    it: "La tua email", 
    en: "Your email",
    es: "Tu correo",
    fr: "Votre e-mail",
    de: "Deine E-Mail",
    ru: "Ваш email",
    ja: "あなたのメール",
    zh: "你的邮箱",
    ko: "당신의 이메일",
    hi: "आपका ईमेल"
  },
  "è stata aggiunta alla lista prioritaria.": { 
    it: "è stata aggiunta alla lista prioritaria.", 
    en: "has been added to the priority list.",
    es: "ha sido añadido a la lista prioritaria.",
    fr: "a été ajouté à la liste prioritaire.",
    de: "wurde der Prioritätsliste hinzugefügt.",
    ru: "добавлен в приоритетный список.",
    ja: "優先リストに追加されました。",
    zh: "已加入优先名单。",
    ko: "우선순위 목록에 추가되었습니다.",
    hi: "प्राथमिकता सूची में जोड़ा गया है。"
  },
  "Ti contatteremo non appena i server saranno aperti al pubblico.": { 
    it: "Ti contatteremo non appena i server saranno aperti al pubblico.", 
    en: "We will contact you as soon as the servers are open to the public.",
    es: "Te contactaremos tan pronto como los servidores estén abiertos al público.",
    fr: "Nous vous contacterons dès que les serveurs seront ouverts au public.",
    de: "Wir werden dich kontaktieren, sobald die Server für die Öffentlichkeit zugänglich sind.",
    ru: "Мы свяжемся с вами, как только серверы станут открыты для всех.",
    ja: "サーバーが一般公開され次第ご連絡いたします。",
    zh: "服务器向公众开放后，我们将立即与您联系。",
    ko: "서버가 일반에 공개되는 대로 연락드리겠습니다.",
    hi: "जैसे ही सर्वर जनता के लिए खुलेंगे हम आपसे संपर्क करेंगे।"
  },
  "La piattaforma è attualmente in fase di Closed Beta.": { 
    it: "La piattaforma è attualmente in fase di Closed Beta.", 
    en: "The platform is currently in Closed Beta.",
    es: "La plataforma está actualmente en Beta Cerrada.",
    fr: "La plateforme est actuellement en Bêta Fermée.",
    de: "Die Plattform befindet sich derzeit in der Closed Beta.",
    ru: "Платформа в настоящее время находится в закрытом бета-тестировании.",
    ja: "プラットフォームは現在クローズドベータ版です。",
    zh: "该平台目前处于封闭内测阶段。",
    ko: "플랫폼은 현재 클로즈 베타 중입니다.",
    hi: "प्लेटफॉर्म वर्तमान में क्लोज्ड बीटा चरण में है।"
  },
  "Lascia la tua email per entrare in lista d'attesa.": { 
    it: "Lascia la tua email per entrare in lista d'attesa.", 
    en: "Leave your email to join the waitlist.",
    es: "Deja tu correo para unirte a la lista de espera.",
    fr: "Laissez votre e-mail pour rejoindre la liste d'attente.",
    de: "Hinterlasse deine E-Mail, um der Warteliste beizutreten.",
    ru: "Оставьте свой email, чтобы присоединиться к списку ожидания.",
    ja: "順番待ちリストに参加するにはメールアドレスを残してください。",
    zh: "留下您的邮箱以加入候补名单。",
    ko: "대기자 명단에 등록하려면 이메일을 남겨주세요.",
    hi: "प्रतीक्षा सूची में शामिल होने के लिए अपना ईमेल छोड़ें।"
  },
  "La tua email (es. dj@gmail.com)": { 
    it: "La tua email (es. dj@gmail.com)", 
    en: "Your email (e.g. dj@gmail.com)",
    es: "Tu correo (ej. dj@gmail.com)",
    fr: "Votre e-mail (ex. dj@gmail.com)",
    de: "Deine E-Mail (z.B. dj@gmail.com)",
    ru: "Ваш email (напр. dj@gmail.com)",
    ja: "メールアドレス (例: dj@gmail.com)",
    zh: "你的邮箱 (例 dj@gmail.com)",
    ko: "이메일 (예: dj@gmail.com)",
    hi: "आपका ईमेल (उदा. dj@gmail.com)"
  },
  "Iscrizione in corso...": { 
    it: "Iscrizione in corso...", 
    en: "Joining...",
    es: "Uniéndose...",
    fr: "Inscription en cours...",
    de: "Tritt bei...",
    ru: "Присоединяемся...",
    ja: "参加中...",
    zh: "加入中...",
    ko: "가입 중...",
    hi: "शामिल हो रहे हैं..."
  },
  "Mettimi in Lista d'Attesa": { 
    it: "Mettimi in Lista d'Attesa", 
    en: "Join Waitlist",
    es: "Unirse a la lista de espera",
    fr: "Rejoindre la liste",
    de: "Warteliste beitreten",
    ru: "Присоединиться",
    ja: "順番待ちに登録",
    zh: "加入候补名单",
    ko: "대기자 등록",
    hi: "प्रतीक्षा सूची में शामिल हों"
  },
  "Accesso Web3": { 
    it: "Accesso Web3", 
    en: "Web3 Access",
    es: "Acceso Web3",
    fr: "Accès Web3",
    de: "Web3-Zugang",
    ru: "Доступ Web3",
    ja: "Web3アクセス",
    zh: "Web3 访问",
    ko: "Web3 접속",
    hi: "Web3 एक्सेस"
  },
  "SONO UN DJ (Connetti Wallet)": { 
    it: "SONO UN DJ (Connetti Wallet)", 
    en: "I AM A DJ (Connect Wallet)",
    es: "SOY UN DJ (Conectar Billetera)",
    fr: "JE SUIS UN DJ (Connecter Wallet)",
    de: "ICH BIN EIN DJ (Wallet verbinden)",
    ru: "Я ДИДЖЕЙ (Подключить кошелек)",
    ja: "私はDJです (ウォレット接続)",
    zh: "我是 DJ (连接钱包)",
    ko: "저는 DJ입니다 (지갑 연결)",
    hi: "मैं एक डीजे हूँ (वॉलेट कनेक्ट करें)"
  },
  "SONO UN FAN (Connetti Wallet)": { 
    it: "SONO UN FAN (Connetti Wallet)", 
    en: "I AM A FAN (Connect Wallet)",
    es: "SOY UN FAN (Conectar Billetera)",
    fr: "JE SUIS UN FAN (Connecter Wallet)",
    de: "ICH BIN EIN FAN (Wallet verbinden)",
    ru: "Я ФАНАТ (Подключить кошелек)",
    ja: "私はファンです (ウォレット接続)",
    zh: "我是粉丝 (连接钱包)",
    ko: "저는 팬입니다 (지갑 연결)",
    hi: "मैं एक प्रशंसक हूँ (वॉलेट कनेक्ट करें)"
  },
  "Mercato": { it: "Mercato", en: "Market", es: "Mercado", fr: "Marché", de: "Markt", ru: "Рынок", ja: "市場", zh: "市场", ko: "시장", hi: "बाज़ार" },
  "Esplora": { it: "Esplora", en: "Explore", es: "Explorar", fr: "Explorer", de: "Erkunden", ru: "Исследовать", ja: "探索", zh: "探索", ko: "탐색", hi: "खोजें" },
  "Feed": { it: "Feed", en: "Feed", es: "Inicio", fr: "Flux", de: "Feed", ru: "Лента", ja: "フィード", zh: "动态", ko: "피드", hi: "फ़ीड" },
  "Artisti": { it: "Artisti", en: "Artists", es: "Artistas", fr: "Artistes", de: "Künstler", ru: "Артисты", ja: "アーティスト", zh: "艺术家", ko: "아티스트", hi: "कलाकार" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'it',
  setLanguage: () => {},
  t: (k) => k
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState<Language>('it');

  useEffect(() => {
    const saved = localStorage.getItem('fpm-lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('fpm-lang', newLang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);