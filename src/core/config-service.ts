import { injectable, inject } from "inversify";
import "reflect-metadata";
import { load } from "ts-dotenv";
import { ENVMAP, ENVKEY } from "../types/env-map";

/**
 * 파일 내에서만 유효한 한정자로 만든다.
 */
const __ = Symbol.for("__ENV__");

@injectable()
export class ConfigService {
    [__] = load({
        GITHUB_TOKEN: String,
        MAX_PAGE: Number,
    }) as ENVMAP;

    constructor() {
        if (!this[__].GITHUB_TOKEN) {
            throw new Error(
                "Please set the environment variable named GITHUB_TOKEN in your .env file."
            );
        }
    }

    load() {
        return this[__];
    }

    get<T = string | number>(key: ENVKEY) {
        return this[__][key] as T;
    }
}
