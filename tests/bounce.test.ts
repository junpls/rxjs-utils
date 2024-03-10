import { timer } from "rxjs";
import { bounce, bounceTime } from "../operators/bounce";
import { testScheduler } from "./utils";

describe("bounce", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("ab-c---de|");
			const expected = "a------d-|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounce(() => timer(t)))).toBe(expected);
		});
	});

	it("generates the inverted stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("ab-c---de|");
			const expected = "-b-c----e|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounce(() => timer(t), true))).toBe(expected);
		});
	});
});

describe("bounceTime", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("ab-c---de|");
			const expected = "a------d-|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounceTime(t))).toBe(expected);
		});
	});

	it("generates the inverted stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("ab-c---de|");
			const expected = "-b-c----e|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(bounceTime(t, true))).toBe(expected);
		});
	});
});
