import { EventEmitter } from "events";
import { inject, injectable } from "inversify";
import { OctokitInjector } from "../client/octokit-injector";
import { OCTOKIT_INJECTOR } from "./constants";

@injectable()
export class App extends EventEmitter {
    public static Listeners: EventEmitter = new EventEmitter();

    constructor(
        @inject(OCTOKIT_INJECTOR)
        private readonly octokitInjector: OctokitInjector
    ) {
        super();
    }

    async start() {
        await this.octokitInjector.create();
    }
}
