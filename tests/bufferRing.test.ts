import { bufferRing } from "../operators/bufferRing";
import { of } from "rxjs";

describe("bufferRing", () => {
	it("buffer size: 2", () => {
		let res: number[][] = [];
		of(1, 2, 3)
			.pipe(bufferRing(2))
			.subscribe((r) => res.push(r));
		expect(res).toStrictEqual([[1], [2, 1], [3, 2]]);
	});

	it("buffer size: 1", () => {
		let res: number[][] = [];
		of(1, 2, 3)
			.pipe(bufferRing(1))
			.subscribe((r) => res.push(r));
		expect(res).toStrictEqual([[1], [2], [3]]);
	});

	it("buffer size: 0", () => {
		let res: number[][] = [];
		of(1, 2, 3)
			.pipe(bufferRing(0))
			.subscribe((r) => res.push(r));
		expect(res).toStrictEqual([[], [], []]);
	});

	it("completes", () => {
		let completed = false;
		of(1, 2, 3)
			.pipe(bufferRing(0))
			.subscribe({
				complete: () => {
					completed = true;
				},
			});
		expect(completed).toBeTruthy();
	});
});
