import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";

let wrapper = null;

afterEach(() => {
  wrapper.destroy();
});

describe("Datepicker Component", () => {
  describe("Periods", () => {
    describe("Tooltip return always a modulo 7 when periods is weekly", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            disableCheckoutOnCheckin: true,
            alwaysVisible: true,
            countOfDesktopMonth: 2,
            firstDayOfWeek: 1,
            minNights: 1,
            disabledDates: [
              "2023-01-01",
              "2023-01-02",
              "2023-01-03",
              "2023-01-04",
              "2023-01-05",
              "2023-01-06",
              "2023-01-07",
              "2023-01-08",
              "2023-01-15",
              "2023-01-16",
              "2023-01-17",
              "2023-01-18",
              "2023-01-19"
            ],
            periodDates: [
              {
                startAt: "2023-01-09",
                endAt: "2023-01-15",
                minimumDuration: 5,
                periodType: "nightly"
              },
              {
                startAt: "2023-01-15",
                endAt: "2023-06-25",
                minimumDuration: 1,
                periodType: "weekly_by_sunday"
              }
            ],
            startDate: new Date("2023-01-01")
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-10"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(5);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("5 Nights minimum.");
      });

      it("Should return a nightly count", async () => {
        await wrapper
          .get('[data-testid="daywrap-2023-01-15"]')
          .trigger("mouseenter");

        expect(wrapper.vm.customTooltip).toBe("5 Nights");
      });
    });
  });
});
