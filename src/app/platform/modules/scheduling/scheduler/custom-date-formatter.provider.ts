import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { startOfWeek, endOfWeek, format, isSameMonth } from 'date-fns';

export class CustomDateFormatter extends CalendarDateFormatter {
    // you can override any of the methods defined in the parent class

    public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'EEE', locale);
    }

    public monthViewTitle({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'MMMM y', locale);
    }

    public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'EEE', locale);
    }

    public weekViewTitle({ date, locale }: DateFormatterParams): string {
        const start = startOfWeek(date), end = endOfWeek(date);
        if (isSameMonth(start, end))
            return format(start, 'MMM DD', { locale: locale }) + ' - ' + format(end, 'DD', { locale: locale })
        else
            return format(start, 'MMM DD', { locale: locale }) + ' - ' + format(end, 'MMM DD', { locale: locale })
    }

    //   public dayViewHour({ date, locale }: DateFormatterParams): string {
    //     return new DatePipe(locale).transform(date, 'HH:mm', locale);
    //   }

    public dayViewTitle({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'EEEE MMM d', locale);
    }

}
