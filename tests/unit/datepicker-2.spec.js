import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Datepicker from "@/components/DatePicker/index.vue";

let wrapper = null;
const periodDates = [
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2022-12-18",
    endAt: "2023-01-01",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-01",
    endAt: "2023-01-05",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-01-05",
    endAt: "2023-01-15",
    periodType: "nightly",
    minimumDuration: 7
  },
  {
    startAt: "2023-01-15",
    endAt: "2023-01-29",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-29",
    endAt: "2023-02-26",
    periodType: "nightly",
    minimumDuration: 10
  },
  {
    startAt: "2023-02-26",
    endAt: "2023-03-05",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-03-11",
    endAt: "2023-04-15",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7
  },
  {
    startAt: "2023-11-27",
    endAt: "2023-12-25",
    periodType: "weekly_by_monday",
    minimumDuration: 1
  }
];

const testingHoveringDate = async (min, max, date, enterDate) => {
  await wrapper
    .get(`[data-testid="daywrap-${enterDate}"]`)
    .trigger("mouseenter");

  await flushPromises();

  for (let index = min; index < max; index++) {
    const endDate = index < 10 ? `0${index}` : index;

    expect(
      wrapper.get(`[data-testid="day-${date}-${endDate}"]`).classes()
    ).toContain("afterMinimumDurationValidDay");
  }
};

afterEach(() => {
  wrapper.destroy();
});

describe("Datepicker Component", () => {
  describe("Periods", () => {
    describe("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates,
            startDate: new Date("2023-01-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-13"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(
          wrapper.vm.nextPeriod.minimumDurationNights
        );
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 1", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      });

      it("Should define nextPeriodDisableDates length equal to 8", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-21"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-01-22"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 9, "2023-01", "2023-01-22");
      });
    });

    describe("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates,
            startDate: new Date("2023-02-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-02-24"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 1", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      });

      it("Should define nextPeriodDisableDates length equal to 8", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-03-04"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-03-05"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(25, 28, "2023-02", "2023-02-24");
        testingHoveringDate(1, 4, "2023-03", "2023-02-24");
      });
    });

    describe("case 2 (min duration: 10 nights min > only Saturday to Saturday) > I must be able to select from 03/02 to 11/02 Saturday to Saturday takes priority over the 10 night minimum", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            startDate: new Date("2023-02-01"),
            periodDates: [
              {
                startAt: "2023-01-21",
                endAt: "2023-02-04",
                periodType: "nightly",
                minimumDuration: 10
              },
              {
                startAt: "2023-02-04",
                endAt: "2023-02-11",
                periodType: "weekly_by_saturday",
                minimumDuration: 1
              }
            ]
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-02-03"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define nextPeriod.minimumDuration equal to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define nextPeriodDisableDates length equal to 7", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(7);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-02-10"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-02-11"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 10, "2023-02", "2023-02-03");
      });
    });
  });
});
