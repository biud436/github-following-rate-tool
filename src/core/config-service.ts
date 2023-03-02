import { injectable, inject } from "inversify";
import "reflect-metadata";
import { load } from "ts-dotenv";
import { ENVMAP, ENVKEY } from "../types/env-map";

const __ = Symbol.for("__ENV__");

@injectable()
export class ConfigService {
    [__] = load({
        GITHUB_TOKEN: String,
        MAX_PAGE: Number,
    }) as ENVMAP;

    constructor() {
        if (!this[__].GITHUB_TOKEN) {
            throw new Error("깃허브 토큰을 기입해주십시오.");
        }
    }

    load() {
        return this[__];
    }

    get<T = string | number>(key: ENVKEY) {
        return this[__][key] as T;
    }
}
