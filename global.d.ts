// global.d.ts
declare global {
    interface Notification {
        permission: 'default' | 'granted' | 'denied';
        requestPermission(): Promise<'default' | 'granted' | 'denied'>;
    }
}

export {};