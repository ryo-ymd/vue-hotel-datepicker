import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";

describe("Datepicker Helpers", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachToDocument: true,
      propsData: {
        minNights: 3,
        disabledDates: ["2020-05-28", "2020-05-10", "2020-05-01", "2020-05-22"]
      }
    });
  });

  describe("nextDateByDayOfWeek", () => {
    it("should return the next given day of the week when comparing a date to a date", () => {
      expect(
        new Date(wrapper.vm.nextDateByDayOfWeek("Saturday", "10-11-2017"))
      ).toEqual(new Date("10-14-2017"));
    });
  });

  describe("nextDateByDayOfWeekArray", () => {
    it("should return the next date when comparing to an array days of the week", () => {
      expect(
        wrapper.vm.nextDateByDayOfWeekArray(
          ["Saturday", "Tuesday"],
          "11-08-2017"
        )
      ).toEqual(new Date("11-11-2017"));
    });
  });

  describe("getNextDate", () => {
    it("should return the next day when comparing a date to a dates array", () => {
      expect(
        wrapper.vm.getNextDate(
          ["10-10-2017", "10-15-2017", "10-20-2017"],
          "10-12-2017"
        )
      ).toEqual("10-15-2017");
    });
  });

  describe("countDays", () => {
    it("should correctly count the number of days between two given dates", () => {
      expect(wrapper.vm.countDays("10-10-2017", "10-15-2017")).toEqual(5);
    });
  });

  describe("addDays", () => {
    it("should return the correct date when given a date and the amount of days to add", () => {
      expect(wrapper.vm.addDays("10-10-2017", 5)).toEqual(
        new Date("10-15-2017")
      );
    });
  });

  describe("getFirstDaySunday", () => {
    it("should return the first sunday of a given month", () => {
      expect(wrapper.vm.getFirstDay(new Date("10-10-2017"), 0)).toEqual(
        new Date("10-01-2017")
      );
    });
  });

  describe("getFirstDayMonday", () => {
    it("should return the first monday of a given month", () => {
      expect(wrapper.vm.getFirstDay(new Date("10-10-2017"), 1)).toEqual(
        new Date("09-25-2017")
      );
    });
  });

  describe("getFirstDayOfMonth", () => {
    it("should return the first sunday of a given month", () => {
      expect(wrapper.vm.getFirstDayOfMonth(new Date("12-10-2017"))).toEqual(
        new Date("12-01-2017")
      );
    });
  });

  describe("getNextMonth", () => {
    it("should return the next month of a given date", () => {
      expect(wrapper.vm.getNextMonth(new Date("12-10-2017"))).toEqual(
        new Date("01-01-2018")
      );
    });
  });

  describe("validateDateBetweenTwoDates", () => {
    it("should return true", () => {
      expect(
        wrapper.vm.validateDateBetweenTwoDates(
          "2020-05-10",
          "2020-05-28",
          "2020-05-15"
        )
      ).toEqual(true);
    });

    it("should return false", () => {
      expect(
        wrapper.vm.validateDateBetweenTwoDates(
          "2020-05-10",
          "2020-05-28",
          "2020-05-29"
        )
      ).toEqual(false);
    });
  });

  describe("isDateIsBeforeOrEqual", () => {
    it("should return true = before", () => {
      expect(
        wrapper.vm.isDateIsBeforeOrEqual("2020-01-10", "2020-01-05")
      ).toEqual(true);
    });

    it("should return true = equal", () => {
      expect(
        wrapper.vm.isDateIsBeforeOrEqual("2020-01-05", "2020-01-05")
      ).toEqual(true);
    });

    it("should return false = after", () => {
      expect(
        wrapper.vm.isDateIsBeforeOrEqual("2020-01-05", "2020-01-10")
      ).toEqual(false);
    });
  });

  describe("getMonthDiff", () => {
    it("should return 1", () => {
      expect(wrapper.vm.getMonthDiff("2020-01-05", "2020-02-10")).toEqual(1);
    });

    it("should return 10", () => {
      expect(wrapper.vm.getMonthDiff("2020-01-05", "2020-11-10")).toEqual(10);
    });
  });

  describe("isDateAfter", () => {
    it("should return true - after", () => {
      expect(wrapper.vm.isDateAfter("2022-01-10", "2022-01-11")).toEqual(true);
    });

    it("should return false - !after", () => {
      expect(wrapper.vm.isDateAfter("2022-01-11", "2022-01-10")).toEqual(false);
    });
  });

  describe("isDateBefore", () => {
    it("should return true - before", () => {
      expect(wrapper.vm.isDateAfter("2022-01-11", "2022-01-10")).toEqual(false);
    });

    it("should return false - !before", () => {
      expect(wrapper.vm.isDateAfter("2022-01-10", "2022-01-11")).toEqual(true);
    });
  });

  describe("isDateBeforeOrEqual", () => {
    it("should return true - before", () => {
      expect(
        wrapper.vm.isDateBeforeOrEqual("2020-01-10", "2020-01-10")
      ).toEqual(true);
    });

    it("should return true", () => {
      expect(
        wrapper.vm.isDateBeforeOrEqual("2020-01-10", "2020-01-10")
      ).toEqual(true);
    });

    it("should return false", () => {
      expect(
        wrapper.vm.isDateBeforeOrEqual("2022-01-10", "2022-01-11")
      ).toEqual(true);
    });
  });
});
