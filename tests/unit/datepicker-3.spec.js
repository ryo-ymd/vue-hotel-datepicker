import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Datepicker from "@/components/DatePicker/index.vue";

let wrapper = null;

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
    describe("case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
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
              }
            ],
            startDate: new Date("2022-12-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-12-25"]');

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

      it("Should define nextPeriod minimumDurationNights equal to 3", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(3);
      });

      it("Should define nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-12-31"]');

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
        const possibleCheckoutOne = wrapper.get(
          '[data-testid="day-2023-01-01"]'
        );
        const possibleCheckoutTwo = wrapper.get(
          '[data-testid="day-2023-01-02"]'
        );

        // Possible CheckOut
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
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(26, 31, "2022-12", "2022-12-25");
      });
    });

    describe("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 29/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
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
              }
            ],
            startDate: new Date("2023-01-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-22"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to 7", () => {
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

      it("Should define nextPeriod minimumDurationNights equal to 10", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(10);
      });

      it("Should define nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-28"]');

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
          '[data-testid="day-2023-01-29"]'
        );
        const possibleCheckoutTwo = wrapper.get(
          '[data-testid="day-2023-01-30"]'
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
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(23, 28, "2023-01", "2023-01-22");
      });
    });
  });
});
