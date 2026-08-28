/**
 * Inline no-flash language script. Runs synchronously in <head> before first
 * paint: stored preference ('esmd.lang') wins, anything else falls back to
 * English. Any storage failure falls through to 'en'.
 */
const langScript = `(function(){var v;try{v=localStorage.getItem('esmd.lang')}catch(e){}if(v!=='th'){v='en'}document.documentElement.lang=v})()`;

export function LangScript() {
  return <script dangerouslySetInnerHTML={{ __html: langScript }} />;
}
