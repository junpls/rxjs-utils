import { timer } from "rxjs";
import { lazySample } from "../operators/lazySample";
import { testScheduler } from "./utils";

describe("lazySample", () => {
	it("generates the stream correctly (final value on completion)", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc----de|");
			const expected = "a--c---d-(e|)";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(lazySample(() => timer(0, t)))).toBe(expected);
		});
	});

	it("generates the stream correctly (no final value on completion)", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("abc----de|");
			const expected = "a--c---d-|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(lazySample(() => timer(0, t), false))).toBe(
				expected,
			);
		});
	});

	it("doesn't emit a single event twice", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("a---|");
			const expected = "a---|";
			const t = time("  ---|"); // 3

			expectObservable(abc.pipe(lazySample(() => timer(0, t), false))).toBe(
				expected,
			);
		});
	});
});
