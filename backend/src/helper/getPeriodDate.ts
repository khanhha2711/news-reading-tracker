import { PeriodQuery } from 'src/dashboard/enum/period-query.enum';

export function getPeriodDate(date: Date, period: PeriodQuery): string {
  const value = new Date(date);

  switch (period) {
    case PeriodQuery.MONTH:
      return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
        2,
        '0',
      )}`;

    case PeriodQuery.WEEK: {
      const day = value.getDay();
      const diff = value.getDate() - day + (day === 0 ? -6 : 1);

      value.setDate(diff);

      return value.toISOString().slice(0, 10);
    }

    case PeriodQuery.DAY:
    default:
      return value.toISOString().slice(0, 10);
  }
}

