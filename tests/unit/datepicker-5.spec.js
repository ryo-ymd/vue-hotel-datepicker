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
    describe("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 30/04", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
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
              }
            ],
            startDate: new Date("2023-04-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-04-08"]');

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

      it("Should define last nextPeriodDisableDates equal to Saturday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(6);
      });

      it("Should define nextPeriod.minimumDurationNights to 7", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(7);
      });

      it("Should define nextPeriodDisableDates length equal to 21", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(21);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDayOne = wrapper.get('[data-testid="day-2023-04-16"]');
        const beforeDayTwo = wrapper.get('[data-testid="day-2023-04-23"]');
        const beforeDayThree = wrapper.get('[data-testid="day-2023-04-29"]');

        // Can't select the 2023-04-16
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayOne.classes()).toContain("nightly");

        // Can't select the 2023-04-23
        expect(beforeDayTwo.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayTwo.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayTwo.classes()).toContain("nightly");

        // Can't select the 2023-04-29
        expect(beforeDayThree.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayThree.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayThree.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-04-30"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(9, 29, "2023-04", "2023-04-30");
      });
    });

    describe("case 5 (Saturday to Saturday then Sunday to Sunday) > I must be able to select from 24/12 to 31/12", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            startDate: new Date("2022-12-01"),
            periodDates: [
              {
                startAt: "2022-12-24",
                endAt: "2022-12-31",
                periodType: "weekly_by_saturday",
                minimumDuration: 1
              },
              {
                startAt: "2023-01-01",
                endAt: "2023-01-15",
                periodType: "weekly_by_sunday",
                minimumDuration: 2
              }
            ]
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-12-24"]');

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

      it("Should define nextPeriodDisableDates length equal to 12", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(12);
      });

      it("Should define last nextPeriodDisableDates equal to Saturday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(6);
      });

      it("Should define nextPeriod.minimumDurationNights to 14", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDayOne = wrapper.get('[data-testid="day-2022-12-30"]');

        // Can't select the 2022-12-11
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayOne.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-12-31"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(25, 30, "2022-04", "2022-12-30");
      });
    });
  });
});
