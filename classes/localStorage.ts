class LocalStorage {
    private static msPerHour: number = 1000 * 60 * 60;

    public static get showTimeWarp(): boolean {
        try {
            return localStorage.getItem('showTimeWarp') != 'false'; //default open
        }
        catch {
            return false;
        }
    }
    public static set showTimeWarp(val: boolean) {
        try {
            localStorage.setItem('showTimeWarp', String(val));
        }
        catch {
        }
    }

    public static get(key: string, maxAgeInHours: number = undefined): string {
        if (maxAgeInHours) {
            if (!this.timestamp(key))
                return null;

            if (this.isOlderThan(key, maxAgeInHours))
                return null
        }
        try {
            return localStorage.getItem(key);
        }
        catch (e) {
            return null;
        }
    }

    public static set(key: string, data: string, timestamp: boolean = false) {
        try {
            if (timestamp)
                localStorage.setItem(key + '-timestamp', new Date().getTime().toString());

            localStorage.setItem(key, data);
        } catch {
        }
    }

    public static delete(key: string) {
        try {
            localStorage.removeItem(key);
        }
        catch {
        }
    }

    public static isBefore(key: string, date: Date): boolean {
        return this.timestamp(key) < date.getTime();
    }
    public static isOlderThan(key: string, maxAgeInHours: number): boolean {
        return (new Date().getTime() - this.timestamp(key)) / this.msPerHour > maxAgeInHours;
    }

    public static timestamp(key: string): number {
        try {
            var timestamp = localStorage.getItem(key + '-timestamp');
            return timestamp ? parseInt(localStorage.getItem(key + '-timestamp')) : 0;
        }
        catch {
            return 0;
        }
    }

    public static timestampDateTime(key: string): string {
        return Common.dateTimeStringFromMs(this.timestamp(key));
    }
}