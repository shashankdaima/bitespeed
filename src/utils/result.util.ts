class Result<T> {
    constructor(public data: T|null, public error: any) {}
}

class Success<T> extends Result<T> {
    constructor(public data: T) {
        super(data, null);
    }
}

class Exception<T> extends Result<T> {
    constructor(public error: any) {
        super(null, error);
    }
}
export {Result, Success, Exception };