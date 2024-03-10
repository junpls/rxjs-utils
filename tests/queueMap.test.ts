import { interval, map, of, zip } from "rxjs";
import { queueMap } from "../operators/queueMap";
import { testScheduler } from "./utils";

describe("queueMap", () => {
	it("generates the stream correctly", () => {
		testScheduler().run((helpers) => {
			const { cold, time, expectObservable } = helpers;
			const abc = cold("a---b----(cd|)");
			const expected = "-----a----(ab)(bc)-(cdd|)";
			const t = time("  -----|"); // 5

			expectObservable(
				abc.pipe(
					queueMap((val) =>
						zip(of(val, val), interval(t)).pipe(map((v) => v[0])),
					),
				),
			).toBe(expected);
		});
	});
});
