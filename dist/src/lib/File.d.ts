export declare class Directory {
    static exists(props: {
        path: string;
    }): boolean;
    static isDir(props: {
        path: string;
    }): boolean;
    static copy(props: {
        src: string;
        dst: string;
        force?: boolean;
    }): void;
    static delete(props: {
        path: string;
    }): void;
    static create(props: {
        path: string;
        check?: boolean;
        recursive?: boolean;
    }): void;
    static createIfNotExists(props: {
        path: string;
        recursive?: boolean;
    }): void;
}
export declare class File {
    static readJson(props: {
        path: string;
    }): object;
    static isFile(props: {
        path: string;
    }): boolean;
    static read(props: {
        path: string;
    }): string;
    static writeJson(props: {
        path: string;
        data: any;
    }): any;
    static copy(props: {
        src: string;
        dst: string;
    }): void;
    static dirName(props: {
        path: string;
    }): string;
    static exists(props: {
        path: string;
    }): boolean;
    static create(props: {
        path: string;
        check?: boolean;
        data?: any;
        createDir?: boolean;
    }): void;
}
