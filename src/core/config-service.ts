import { injectable, inject } from "inversify";
import "reflect-metadata";
import { load } from "ts-dotenv";
import { ENVMAP, ENVKEY } from "../types/env-map";

const __ = Symbol.for("__ENV__");

@injectable()
export class ConfigService {
    public [__] = load({
        GITHUB_TOKEN: String,
        MAX_PAGE: Number,
    }) as ENVMAP;

    constructor() {
        if (!this[__].GITHUB_TOKEN) {
            throw new Error("GITHUB_TOKEN is required");
        }
    }

    load() {
        return this[__];
    }

    get<T = string | number>(key: ENVKEY) {
        return this[__][key] as T;
    }
}
