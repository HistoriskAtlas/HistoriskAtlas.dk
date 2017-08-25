class LocalStorage {
    private static msPerHour: number = 1000 * 60 * 60;

    public static get showTimeWarp(): boolean {
        return localStorage.getItem('showTimeWarp') != 'false'; //default open
    }
    public static set showTimeWarp(val: boolean) {
        localStorage.setItem('showTimeWarp', String(val));
    }

    public static get(key: string, maxAgeInHours: number = undefined): string {
        if (maxAgeInHours) {
            if (!this.timestamp(key))
                return null;

            if (this.isOlderThan(key, maxAgeInHours))
                return null
        }
        return localStorage.getItem(key);
    }

    public static set(key: string, data: string, timestamp: boolean = false) {
        if (timestamp)
            localStorage.setItem(key + '-timestamp', new Date().getTime().toString());

        return localStorage.setItem(key, data);
    }

    public static delete(key: string) {
        localStorage.removeItem(key);
    }

    public static isBefore(key: string, date: Date): boolean {
        return this.timestamp(key) < date.getTime();
    }
    public static isOlderThan(key: string, maxAgeInHours: number): boolean {
        return (new Date().getTime() - this.timestamp(key)) / this.msPerHour > maxAgeInHours;
    }

    public static timestamp(key: string): number {
        var timestamp = localStorage.getItem(key + '-timestamp');
        return timestamp ? parseInt(localStorage.getItem(key + '-timestamp')) : 0;
    }

    public static timestampDateTime(key: string): string {
        return Common.dateTimeStringFromMs(this.timestamp(key));
    }
}