export interface Timer {
    end(): void;
}
export declare function time(label: string): Timer;
