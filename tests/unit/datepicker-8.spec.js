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
    describe("case 8 (no period then period of 8 minimum nights): No period and 8 night minumum > I can't select from 11/09 to 16,17,18/09", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                startAt: "2022-09-01",
                endAt: "2022-09-10",
                minimumDuration: 4,
                periodType: "nightly"
              },
              {
                startAt: "2022-09-15",
                endAt: "2022-09-31",
                minimumDuration: 8,
                periodType: "nightly"
              }
            ],
            startDate: new Date("2022-08-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-09-11"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(1);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 Night minimum.");
      });

      it("Should define dynamicNightCounts to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriod.minimumDuration equal to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriodDisableDates length equal to 4", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(4);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-09-16"]');
        const beforeDay2 = wrapper.get('[data-testid="day-2022-09-17"]');
        const beforeDay3 = wrapper.get('[data-testid="day-2022-09-18"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay2.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay2.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay3.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay3.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-09-19"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(10, 15, "2022-09", "2022-09-10");
      });
    });
  });
});
