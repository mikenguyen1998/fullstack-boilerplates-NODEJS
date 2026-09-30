import { STORAGE_KEYS } from '@/config/constants';

/**
 * Inline script executed before paint to prevent a flash of the wrong theme.
 * Reads the persisted Zustand `ui-storage` value. Kept in a non-client module so
 * Server Components receive the actual string.
 */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${STORAGE_KEYS.ui}')||'{}');var t=(s.state&&s.state.theme)||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
