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
    describe("case 11 (Saturday to Saturday with 2 week minimum then sunday to sunday period with 1 week): I can select 18/09 from 08/10", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                endAt: "2022-09-10",
                minimumDuration: 1,
                periodType: "weekly_by_saturday",
                startAt: "2022-09-03"
              },
              {
                endAt: "2022-10-15",
                minimumDuration: 1,
                periodType: "weekly_by_saturday",
                startAt: "2022-10-01"
              },
              {
                endAt: "2022-09-25",
                minimumDuration: 2,
                periodType: "weekly_by_sunday",
                startAt: "2022-09-11"
              }
            ],
            startDate: new Date("2022-09-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-09-18"]');

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

      it("Should define nextPeriod.minimumDuration equal to 14", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(14);
      });

      it("Should define nextPeriodDisableDates length equal to 19", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(19);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay1 = wrapper.get('[data-testid="day-2022-09-25"]');
        const beforeDay2 = wrapper.get('[data-testid="day-2022-10-01"]');

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
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-10-08"]');
        const possibleCheckout2 = wrapper.get('[data-testid="day-2022-10-15"]');
        const possibleCheckout3 = wrapper.get('[data-testid="day-2022-10-16"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );

        expect(possibleCheckout2.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout2.classes()).toContain(
          "datepicker__month-day--valid"
        );

        expect(possibleCheckout3.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout3.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(19, 30, "2022-09", "2022-09-30");
        testingHoveringDate(1, 7, "2022-09", "2022-10-07");
      });
    });
  });
});
