import { describe, test, expect } from "vitest";
import { OverflightSession } from "./OverflightSession";

describe("OverflightSession", () => {
    test("It should record the times of the flight stages", () => {
        const session = new OverflightSession();
        const startTime = new Date("2025-01-01T12:00:00Z");
        const above10ElTime = new Date("2025-01-01T12:00:10Z");
        const under10ElTime = new Date("2025-01-01T12:00:30Z");
        const endTime = new Date("2025-01-01T12:01:00Z");

        session.update(startTime, true, false); //sat start visible
        session.update(above10ElTime, true, true); //sat visible, above 10 degrees 
        session.update(under10ElTime, true, false); //sat visible, under 10 degrees 
        session.update(endTime, false, false); // sat ending visible

        expect(session.isFinish()).toBe(true);

        const result = session.complete();

        expect(result.visibleStartTime).toEqual(startTime);
        expect(result.visible10ElevTime).toEqual(above10ElTime);
        expect(result.visibl10ElevEndTime).toEqual(under10ElTime);
        expect(result.visibleEndTime).toEqual(endTime);
    });

    test("It should not return a overflight if the satellite was not visible", () => {
        const session = new OverflightSession();

        expect(session.isFinish()).toBe(false);

        expect(() => session.complete()).toThrowError('Overflight is not ending');
    });
});