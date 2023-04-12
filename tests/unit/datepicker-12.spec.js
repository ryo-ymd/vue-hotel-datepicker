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
    describe("case 12 (Nighly 5 days then nightly 3 days) - max is priority : I can select 26/10 from 31/10", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                endAt: "2022-08-27",
                minimumDuration: 5,
                periodType: "nightly",
                startAt: "2022-10-29"
              },
              {
                endAt: "2022-10-29",
                minimumDuration: 3,
                periodType: "nightly",
                startAt: "2022-12-17"
              }
            ],
            startDate: new Date("2022-10-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-10-26"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(5);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("5 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 5", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(5);
      });

      it("Should define nextPeriod.minimumDuration equal to 5", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(5);
      });

      it("Should define nextPeriodDisableDates length equal to 4", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(4);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay1 = wrapper.get('[data-testid="day-2022-10-27"]');
        const beforeDay2 = wrapper.get('[data-testid="day-2022-10-28"]');
        const beforeDay3 = wrapper.get('[data-testid="day-2022-10-29"]');
        const beforeDay4 = wrapper.get('[data-testid="day-2022-10-30"]');

        expect(beforeDay1.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay1.classes()).toContain(
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
        expect(beforeDay4.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay4.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-10-31"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(27, 30, "2022-10", "2022-10-30");
      });
    });
  });
});
