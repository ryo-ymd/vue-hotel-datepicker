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
    describe("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates,
            startDate: new Date(new Date("2022-09-01").setUTCHours(0, 0, 0, 0))
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-09-03"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(14);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("2 weeks minimum.");
      });

      it("Should define dynamicNightCounts to 14", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(14);
      });

      it("Should define last nextPeriodDisableDates equal to Saturday", () => {
        // The last day disable must be a Saturday to be able to exit on Friday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(5);
      });

      it("Should define nextPeriod.minimumDuration equal to 14", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
      });

      it("Should define nextPeriodDisableDates length equal to 13", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(13);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-09-16"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-09-17"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 17, "2022-09", "2022-09-03");
      });
    });

    describe("case 4 minimumDuration 4, nextPeriod saturday to saturday (min 2 weeks each period) > I can't select december 17", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                startAt: "2022-12-05",
                endAt: "2022-12-10",
                minimumDuration: 4,
                periodType: "nightly"
              },
              {
                startAt: "2022-12-10",
                endAt: "2022-12-24",
                minimumDuration: 2,
                periodType: "weekly_by_saturday"
              }
            ],
            startDate: new Date("2022-12-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-12-05"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(4);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("4 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 14", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(4);
      });

      it("Should define nextPeriod", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
      });

      it("Should define nextPeriodDisableDates length equal to 16", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(16);
      });

      it("Should define last nextPeriodDisableDates equal to Thursday", () => {
        // The last day disable must be a Friday to be able to exit on Saturday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(5);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-12-17"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckoutOne = wrapper.get(
          '[data-testid="day-2022-12-09"]'
        );
        const possibleCheckoutTwo = wrapper.get(
          '[data-testid="day-2022-12-10"]'
        );
        const possibleCheckoutThree = wrapper.get(
          '[data-testid="day-2022-12-24"]'
        );

        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckoutThree.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutThree.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(9, 10, "2022-12", "2022-12-05");
        testingHoveringDate(24, 24, "2022-12", "2022-12-05");
      });
    });

    describe("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates,
            startDate: new Date("2022-10-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-10-15"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");
      });

      it("Should define dynamicNightCounts to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define last nextPeriodDisableDates equal to Thursday", () => {
        // The last day disable must be a Thursday to be able to exit on Friday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(4);
      });

      it("Should define nextPeriod.minimumDuration equal to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define nextPeriodDisableDates length equal to 19", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(19);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-11-04"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("weekly_by_saturday");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-11-05"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(16, 31, "2022-10", "2022-11-05");
        testingHoveringDate(1, 4, "2022-11", "2022-11-05");
      });
    });
  });
});
