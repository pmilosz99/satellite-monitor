import { IOverflight } from "./model";

export class OverflightSession {
    private visibleStartTime: Date | null = null;
    private visibleEndTime: Date | null = null;
    private above10StartTime: Date | null = null;
    private above10EndTime: Date | null = null;

    update(currentTime: Date, isSatVisibleInAllSky: boolean, isSatVisibleAbove10: boolean): void {
        if (isSatVisibleInAllSky) {
            if (!this.visibleStartTime) {
                this.visibleStartTime = new Date(currentTime);
            }
        }

        if (isSatVisibleAbove10) {
            if (!this.above10StartTime) {
                this.above10StartTime = new Date(currentTime);
            }
        }

        if (!isSatVisibleAbove10 && isSatVisibleInAllSky) {
            if (this.above10StartTime) {
                this.above10EndTime = new Date(currentTime);
            }
        }

        if (!isSatVisibleInAllSky) {
            if (this.visibleStartTime) {
                this.visibleEndTime = new Date(currentTime);
            }
        }
    }

    isFinish(): boolean {
        return this.visibleEndTime !== null;
    }

    complete(): IOverflight {
        if (!this.isFinish()) {
            throw new Error('Overflight is not ending');
        }

        const middleTime = new Date(
            (this.visibleStartTime!.getTime() + this.visibleEndTime!.getTime()) / 2
        );

        return {
            visibleStartTime: this.visibleStartTime!,
            visible10ElevTime: this.above10StartTime,
            visibleMaxHeightTime: middleTime,
            visibl10ElevEndTime: this.above10EndTime,
            visibleEndTime: this.visibleEndTime!,
        };
    }
}