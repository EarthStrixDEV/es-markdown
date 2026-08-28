/**
 * Inline no-flash theme script. Runs synchronously in <head> before first
 * paint: stored preference ('esmd.theme') wins, otherwise the OS preference.
 * Any storage failure falls through to matchMedia.
 */
const themeScript = `(function(){var t;try{t=localStorage.getItem('esmd.theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
