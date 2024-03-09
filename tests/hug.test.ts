import { queueMap } from "../operators/queueMap";
import { interval, map, of, timer, zip } from "rxjs";
import { testScheduler } from "./utils";
import { hug, hugTime } from "../operators/hug";

describe("hug", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc-----de|");
			const expected = "a----c--d-(e|)";
			const t = time("    ---|"); // 3

			expectObservable(abc.pipe(hug(() => timer(t)))).toBe(expected);
		});
	});

	it("doesn't emit a single event twice", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("a---|");
			const expected = "a---|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(hug(() => timer(t)))).toBe(expected);
		});
	});
});

describe("hugTime", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc-----de|");
			const expected = "a----c--d-(e|)";
			const t = time("    ---|"); // 3

			expectObservable(abc.pipe(hugTime(t))).toBe(expected);
		});
	});
});
