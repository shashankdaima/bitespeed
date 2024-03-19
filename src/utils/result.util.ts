import { number } from "zod";

class Result<T> {
    constructor(public data: T | null, public error: any, public code: number){}
}

class Success<T> extends Result<T> {
    constructor(public data: T) {
        super(data, null,200);
    }
}

class Exception<T> extends Result<T> {
    constructor(public error: any, public code: number = 500) {
        super(null, error, code);
    }
}
export { Result, Success, Exception };
