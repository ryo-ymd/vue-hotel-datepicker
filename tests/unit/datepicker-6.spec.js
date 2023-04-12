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
    describe("case 6 (1 period then no period then one period weekly_by_saturday minimum 3 weeks): Saturday to Saturday (min 1 weeks and default minimumDuration) > I can select from 05/03 to 08,09,10,11/03 and 1/04/2023", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 3,
            periodDates: [
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
              }
            ],
            startDate: new Date("2023-03-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-03-05"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(3);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("3 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriodDisableDates to 15", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toEqual(15);
      });

      it("Should define nextPeriod.minimumDuration equal to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriodDisableDates length equal to 15", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(15);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay1 = wrapper.get('[data-testid="day-2023-03-06"]');
        const beforeDay2 = wrapper.get('[data-testid="day-2023-03-07"]');

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
        const possibleCheckout1 = wrapper.get('[data-testid="day-2023-03-08"]');
        const possibleCheckout2 = wrapper.get('[data-testid="day-2023-03-09"]');
        const possibleCheckout3 = wrapper.get('[data-testid="day-2023-03-10"]');
        const possibleCheckout4 = wrapper.get('[data-testid="day-2023-03-11"]');
        const possibleCheckout5 = wrapper.get('[data-testid="day-2023-04-01"]');

        expect(possibleCheckout1.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout1.classes()).toContain(
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

        expect(possibleCheckout5.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout5.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(6, 7, "2023-03", "2023-03-07");
        testingHoveringDate(12, 31, "2023-03", "2023-03-31");
      });
    });
  });
});
