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
    describe("case 10 (Saturday to Saturday with 1 week minimum then Monday to monday period with 3 week): I can't select from 11/09 to 16,17,18/09", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            periodDates: [
              {
                startAt: "2023-04-01",
                endAt: "2023-04-08",
                minimumDuration: 1,
                periodType: "weekly_by_saturday"
              },
              {
                startAt: "2023-04-10",
                endAt: "2023-05-01",
                minimumDuration: 3,
                periodType: "weekly_by_monday"
              }
            ],
            startDate: new Date("2023-04-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-04-01"]');

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

      it("Should define nextPeriodDisableDates length equal to 19", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(19);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-04-17"]');
        const beforeDay2 = wrapper.get('[data-testid="day-2023-04-23"]');

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
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-04-08"]');
        const possibleCheckout2 = wrapper.get('[data-testid="day-2023-04-09"]');
        const possibleCheckout3 = wrapper.get('[data-testid="day-2023-04-10"]');
        const possibleCheckout4 = wrapper.get('[data-testid="day-2023-04-24"]');

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

        expect(possibleCheckout4.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout4.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(2, 7, "2023-04", "2023-04-07");
        testingHoveringDate(11, 23, "2023-04", "2023-04-23");
        testingHoveringDate(25, 30, "2023-04", "2023-04-30");
      });
    });
  });
});
