import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectLang, pick as pickField, type Lang } from './lang';
import { translate, type StringKey } from './strings';

const KEY = 'lang';

function readStored(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
  pick: (row: Record<string, any> | null | undefined, field: string) => string | null;
}

const Ctx = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    detectLang({ search: window.location.search, stored: readStored(), languages: navigator.languages ?? [] }),
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* storage blocked: choice lasts for this visit */ }
    // A ?lang= in the URL beats the saved choice on reload, so keep it in step with the button.
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', l);
      window.history.replaceState(window.history.state, '', url);
    }
  }, []);

  const value: LangValue = {
    lang,
    setLang,
    t: (key) => translate(key, lang),
    pick: (row, field) => pickField(row, field, lang),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang must be used inside LangProvider');
  return v;
}
