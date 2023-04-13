/* eslint-disable vars-on-top */
import fecha from "fecha";
// eslint-disable-next-line import/no-named-default
import { default as dayjs } from "dayjs";
// eslint-disable-next-line import/no-named-default
import { default as utc } from "dayjs/plugin/utc";
// eslint-disable-next-line import/no-named-default
import { default as isBetween } from "dayjs/plugin/isBetween";
// eslint-disable-next-line import/no-named-default
import { default as timezone } from "dayjs/plugin/timezone";
// eslint-disable-next-line import/no-named-default
import { default as isSameOrAfter } from "dayjs/plugin/isSameOrAfter";
// eslint-disable-next-line import/no-named-default
import { default as isSameOrBefore } from "dayjs/plugin/isSameOrBefore";
// eslint-disable-next-line import/no-named-default
import { default as weekday } from "dayjs/plugin/weekday";
import { default as minMax } from "dayjs/plugin/minMax";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(minMax);

export const transformDay = d => {
  const getTimezone = window?.vueDatePicker?.timezone || "Europe/Paris";

  return dayjs.tz(d, getTimezone);
};

const addDate = (date, quantity, type) => {
  const d = dayjs(date);

  return d.add(quantity, type).toDate();
};

const subtractDate = (date, quantity, type) => {
  const d = dayjs(date);

  return d.subtract(quantity, type).toDate();
};

const isAfter = (time1, time2) => {
  const d1 = transformDay(time2);
  const d2 = transformDay(time1);

  return d1.isAfter(d2, "day");
};

const isBefore = (time1, time2) => {
  const d1 = transformDay(time1);
  const d2 = transformDay(time2);

  return d1.isBefore(d2, "day");
};

const isBeforeOrEqual = (time1, time2) => {
  const d1 = transformDay(time2);
  const d2 = transformDay(time1);

  return d1.isSameOrBefore(d2, "day");
};

export const isBetweenDate = (fromDate, toDate, givenDate) => {
  const d1 = transformDay(fromDate);
  const d2 = transformDay(toDate);
  const d3 = transformDay(givenDate);

  return transformDay(d3).isBetween(d1, d2, "day", []);
};

const getDateDiff = (time1, time2, type) => {
  const d1 = transformDay(time1);
  const d2 = transformDay(time2);

  return Math.abs(d1.diff(d2, type));
};

export default {
  transformDay(d) {
    return transformDay(d);
  },
  formatTransformDay(d) {
    return transformDay(d).format("YYYY-MM-DD");
  },
  getNextDate(datesArray, referenceDate) {
    const now = transformDay(referenceDate);
    const closest = Infinity;

    return datesArray.find(d => {
      const date = transformDay(d);

      if (date.isAfter(now) && closest) {
        return d;
      }

      return null;
    });
  },
  nextDateByDayOfWeek(weekDay, referenceDate) {
    const newReferenceDate = transformDay(referenceDate);
    let newWeekDay = weekDay.toLowerCase();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    const referenceDateDay = newReferenceDate.day();

    for (let i = 7; i--; ) {
      if (newWeekDay === days[i]) {
        newWeekDay = i <= referenceDateDay ? i + 7 : i;
        break;
      }
    }

    const daysUntilNext = newWeekDay - referenceDateDay;

    return addDate(newReferenceDate, daysUntilNext, "day");
  },
  nextDateByDayOfWeekArray(daysArray, referenceDate) {
    const tempArray = [];

    for (let i = 0; i < daysArray.length; i++) {
      tempArray.push(this.nextDateByDayOfWeek(daysArray[i], referenceDate));
    }

    return this.getNextDate(tempArray, referenceDate);
  },
  countDays(start, end, type = "day") {
    const d1 = transformDay(start);
    const d2 = transformDay(end);

    return Math.abs(d1.diff(d2, type));
  },
  substractDays(date, quantity) {
    return subtractDate(date, quantity, "day");
  },
  addDays(date, quantity) {
    return addDate(date, quantity, "day");
  },
  getDayDiff(d1, d2) {
    // const t1 = transformDay(time1).millisecond();
    // const t2 = transformDay(time2).millisecond();

    const t2 = new Date(d2).getTime();
    const t1 = new Date(d1).getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
  },
  getNextDay(date, dayIndex) {
    const currentDate = date;

    currentDate.setDate(
      currentDate.getDate() +
        ((dayIndex - 1 - currentDate.getDay() + 7) % 7) +
        1
    );

    return currentDate;
  },
  getFirstDayOfMonth(date) {
    const d = transformDay(date);

    return d.startOf("month").toDate();
  },
  getFirstDay(date, firstDayOfWeek) {
    return transformDay(date)
      .startOf("month")
      .weekday(firstDayOfWeek)
      .format("YYYY-MM-DD");
  },
  getNextMonth(date) {
    return transformDay(date)
      .add(1, "month")
      .startOf("month")
      .toDate();
  },
  validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
    return isBetweenDate(fromDate, toDate, givenDate);
  },
  isDateIsBeforeOrEqual(fromDate, givenDate) {
    return isBeforeOrEqual(fromDate, givenDate);
  },
  getMonthDiff(d1, d2) {
    return getDateDiff(d1, d2, "month");
  },
  shortenString(arr, sLen) {
    const newArr = [];

    for (let i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }

    return newArr;
  },
  getDaysArray(start, end) {
    const d1 = transformDay(start);
    const d2 = transformDay(end);
    const lenghDifference = getDateDiff(d1.toDate(), d2.toDate(), "day");
    const arr = [];

    if (lenghDifference > 0) {
      for (let index = 0; index < lenghDifference + 1; index++) {
        const day = d1.add(index, "day").toDate();

        arr.push(day);
      }
    }

    return arr;
  },
  dateFormater(date, format) {
    const f = format || "YYYY-MM-DD";

    if (date) {
      return fecha.format(date, f);
    }

    return "";
  },
  pluralize(countOfDays, periodType = "night") {
    if (periodType === "week") {
      return countOfDays > 7 ? this.i18n.weeks : this.i18n.week;
    }

    return countOfDays !== 1 ? this.i18n.nights : this.i18n.night;
  },
  isDateAfter(time1, time2) {
    return isAfter(time1, time2);
  },
  isDateBefore(time1, time2) {
    return isBefore(time1, time2);
  },
  isDateBeforeOrEqual(time1, time2) {
    return isBeforeOrEqual(time2, time1);
  },
  compareDay(day1, day2) {
    const date1 = transformDay(day1).format("YYYY-MM-DD");
    const date2 = transformDay(day2).format("YYYY-MM-DD");

    if (date1 > date2) {
      return 1;
    }

    if (date1 === date2) {
      return 0;
    }

    if (date1 < date2) {
      return -1;
    }

    return null;
  },
  minDay() {
    return dayjs.min(arguments);
  }
};
