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
    describe("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", () => {
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
              }
            ],
            startDate: new Date("2023-01-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-03"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("7 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Tuesday", () => {
        // The last day disable must be a Monday to be able to output on Tuesday
        expect(
          new Date(
            wrapper.vm.nextPeriodDisableDates[
              wrapper.vm.nextPeriodDisableDates.length - 1
            ]
          ).getDay()
        ).toBe(1);
      });

      it("Should define nextPeriod.minimumDuration equal to 7", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(7);
      });

      it("Should define nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-08"]');

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
        const possibleCheckout = wrapper.get('[data-testid="day-2023-01-10"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckout.classes()).toContain("nightly");
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 9, "2023-01", "2023-01-10");
      });
    });
  });
});
