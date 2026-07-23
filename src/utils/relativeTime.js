const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;

export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'nunca acessou';

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'nunca acessou';

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 0) return 'agora';
  if (diffSec < MINUTE) return 'agora';
  if (diffSec < HOUR) {
    const m = Math.floor(diffSec / MINUTE);
    return `há ${m} min`;
  }
  if (diffSec < DAY) {
    const h = Math.floor(diffSec / HOUR);
    return `há ${h} h`;
  }
  if (diffSec < MONTH) {
    const d = Math.floor(diffSec / DAY);
    return d === 1 ? 'há 1 dia' : `há ${d} dias`;
  }
  const mo = Math.floor(diffSec / MONTH);
  return mo === 1 ? 'há 1 mês' : `há ${mo} meses`;
}
