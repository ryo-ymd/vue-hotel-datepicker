import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";
import Day from "@/components/Day.vue";

let wrapper = null;
const periodDates = [
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
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
  },
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
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7
  },
  {
    startAt: "2023-11-27",
    endAt: "2023-12-25",
    periodType: "weekly_by_monday",
    minimumDuration: 1
  }
];

const mountComponent = (
  startDate = new Date("01-01-2022"),
  alwaysVisible = true
) => {
  return mount(Datepicker, {
    components: { Day },
    propsData: {
      alwaysVisible,
      countOfDesktopMonth: 2,
      firstDayOfWeek: 1,
      minNights: 1,
      periodDates,
      startDate
    }
  });
};

afterEach(() => {
  wrapper.destroy();
});

describe("Datepicker Calendar", () => {
  it("should correctly re-render the calendar", async () => {
    wrapper = await mountComponent(new Date("01-01-2023"), false);

    expect(wrapper.vm.show).toBe(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).toBe(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).toBe(true);
    }, 200);
  });
});

describe("Datepicker Component", () => {
  describe("Click on input", () => {
    beforeEach(async () => {
      wrapper = await mountComponent(new Date("01-01-2023"), false);
    });

    it("should toggle the calendar visibility on input click", () => {
      expect(wrapper.vm.isOpen).toBe(false);

      const datepickerInput = wrapper.find('[data-qa="datepickerInput"]');

      datepickerInput.trigger("click");

      expect(wrapper.vm.isOpen).toBe(true);
    });
  });

  describe("Click on next page", () => {
    it("should correctly render the next and previous months", () => {
      const { activeMonthIndex } = wrapper.vm;

      wrapper.vm.renderNextMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex + 1);

      wrapper.vm.renderPreviousMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex);
    });
  });
});
