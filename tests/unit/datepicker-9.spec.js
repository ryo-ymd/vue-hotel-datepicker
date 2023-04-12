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
    describe("case 9 (Sunday to sunday with 1 week minimum then Sunday to sunday period with 3 week): I can't select from 11/09 to 16,17,18/09", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                startAt: "2022-11-27",
                endAt: "2022-12-11",
                minimumDuration: 1,
                periodType: "weekly_by_sunday"
              },
              {
                startAt: "2022-12-15",
                endAt: "2023-01-01",
                minimumDuration: 3,
                periodType: "weekly_by_sunday"
              }
            ],
            startDate: new Date("2022-11-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-12-04"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 1", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define nextPeriod.minimumDuration equal to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define nextPeriodDisableDates length equal to 16", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(16);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-12-18"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-12-11"]');
        const possibleCheckout2 = wrapper.get('[data-testid="day-2022-12-25"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );

        expect(possibleCheckout2.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout2.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(10, 15, "2022-12", "2022-12-10");
      });
    });
  });
});
