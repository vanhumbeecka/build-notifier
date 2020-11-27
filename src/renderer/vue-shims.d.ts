declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare module 'vuex-electron' {
    import { Plugin } from 'vuex'
    import { IpcMain, IpcRenderer } from 'electron'

    interface PersistedStateOptions {
        storage?: {
            set(key: string, value: any): void;
            get(key: string): any;
            delete(key: string): void;
        };
        storageKey?: string;
        whitelist?: string[];
        blacklist?: string[];
    }
    interface SharedMutationsOptions {
        type?: 'renderer' | 'main';
        ipcMain?: IpcMain;
        ipcRenderer?: IpcRenderer;
    }

    function createPersistedState<S>(
        options?: PersistedStateOptions
    ): Plugin<S>
    function createSharedMutations<S>(
        options?: SharedMutationsOptions
    ): Plugin<S>
}

declare module 'vue-echarts' {
}

declare var __static: string;
