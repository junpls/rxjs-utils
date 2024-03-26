import { BehaviorSubject, Subject } from "rxjs";
import { filterRisingEdge, transaction } from "../operators/transaction";

describe("filterRisingEdge", () => {
	it("generates the stream correctly (on booleans)", () => {
        const res: [boolean, boolean][] = [];
        const source = new Subject<boolean>();
        source.pipe(filterRisingEdge()).subscribe(i => {
            res.push(i);
        });
        source.next(false);
        expect(res).toEqual([]);
        source.next(false);
        expect(res).toEqual([]);
        source.next(true);
        expect(res).toEqual([[false, true]]);
        source.next(true);
        expect(res).toEqual([[false, true]]);
        source.next(false);
        expect(res).toEqual([[false, true]]);
        source.next(true);
        expect(res).toEqual([[false, true], [false, true]]);
    });

	it("generates the stream correctly (on numbers)", () => {
        const res: [number, number][] = [];
        const source = new Subject<number>();
        source.pipe(filterRisingEdge()).subscribe(i => {
            res.push(i);
        });
        source.next(0);
        expect(res).toEqual([]);
        source.next(0);
        expect(res).toEqual([]);
        source.next(1);
        expect(res).toEqual([[0, 1]]);
        source.next(2);
        expect(res).toEqual([[0, 1]]);
        source.next(0);
        expect(res).toEqual([[0, 1]]);
        source.next(3);
        expect(res).toEqual([[0, 1], [0, 3]]);
    });
});

describe("transaction", () => {
	it("generates the stream correctly (summarize = false)", () => {
        const res: number[] = [];
        const source = new BehaviorSubject<number>(0);
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(1);
        source.next(2);
        signal.next(true);
        source.next(3);
        expect(res).toEqual([0, 3]);
	});
 
	it("generates the stream correctly (summarize = true)", () => {
        const res: number[] = [];
        const source = new BehaviorSubject<number>(0);
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(1);
        source.next(2);
        signal.next(true);
        source.next(3);
        expect(res).toEqual([0, 2, 3]);
	});
 
	it("generates no summary without a previous emission", () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(false);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        signal.next(true);
        expect(res).toEqual([]);
	});
 
	it("does not generate the summary twice", () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(false);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        source.next(1);
        signal.next(true);
        signal.next(false);
        signal.next(true);
        expect(res).toEqual([1]);
	});

	it("does not generate the summary when nothing was emitted during pause", () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        source.next(1);
        signal.next(false);
        signal.next(true);
        expect(res).toEqual([1]);
	});

	it("generates the stream correctly (on Subject)", () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(1);
        source.next(2);
        signal.next(true);
        source.next(3);
        expect(res).toEqual([3]);
	});

	it("generates the stream correctly (on Subject, summarize)", () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(1);
        source.next(2);
        signal.next(true);
        source.next(3);
        expect(res).toEqual([2, 3]);
	});

    it('does not summarize repeatedly', () => {
        const res: number[] = [];
        const source = new Subject<number>();
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(1);
        source.next(2);
        signal.next(true);
        signal.next(true);
        source.next(3);
        expect(res).toEqual([2, 3]);
    });

    it('emits latest value in summary, even if it is falsy', () => {
        const res: boolean[] = [];
        const source = new Subject<boolean>();
        const signal = new BehaviorSubject<boolean>(true);
        source.pipe(transaction(signal, true)).subscribe(i => {
            res.push(i);
        });
        signal.next(false);
        source.next(false);
        signal.next(true);
        expect(res).toEqual([false]);
    });
});
