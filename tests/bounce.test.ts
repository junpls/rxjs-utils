import { queueMap } from "../operators/queueMap";
import { interval, map, of, timer, zip } from "rxjs";
import { testScheduler } from "./utils";
import { bounce, bounceTime } from "../operators/bounce";

describe("bounce", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc---de|");
			const expected = "a-----d-|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounce(() => timer(t)))).toBe(expected);
		});
	});
	
	it("generates the inverted stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc---de|");
			const expected = "-bc----e|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounce(() => timer(t), true))).toBe(expected);
		});
	});
});

describe("bounceTime", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc---de|");
			const expected = "a-----d-|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounceTime(t))).toBe(expected);
		});
	});
});
