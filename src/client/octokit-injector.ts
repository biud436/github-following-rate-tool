import { inject, injectable } from "inversify";
import { ConfigService } from "../core/config-service";
import { CONFIG_SERVICE } from "../core/constants";
import { Octokit } from "@octokit/core";
import { User, Following } from "../types/follower.interface";
import { App } from "../core/app";

const PER_PAGE = 100;
const HTTP_STATUS_OK = 200;

const DEFAULT_OCTOKIT_HEADER = {
    headers: {
        "X-GitHub-Api-Version": "2022-11-28",
    },
};

@injectable()
export class OctokitInjector {
    private octokit!: Octokit;

    private followers?: User[];
    private following?: Following[];

    constructor(
        @inject(CONFIG_SERVICE) private readonly configService: ConfigService
    ) {}

    async create() {
        try {
            this.octokit = new Octokit({
                auth: this.configService.get("GITHUB_TOKEN"),
            });

            this.followers = await this.request("GET /user/followers");
            this.following = await this.request("GET /user/following");
            const compareResult = await this.compareFollowingAndFollowers();

            App.Listeners.emit("result", compareResult);
        } catch (e: any) {}
    }

    async request(url: "GET /user/followers" | "GET /user/following") {
        let currentPage = 1;

        const maxPage = this.configService.get<number>("MAX_PAGE");
        let data: Array<User> = [];

        while (currentPage <= maxPage) {
            try {
                const res = await this.octokit.request(url, {
                    DEFAULT_OCTOKIT_HEADER,
                    per_page: PER_PAGE,
                    page: currentPage,
                });

                if (res.status === HTTP_STATUS_OK) {
                    data = [
                        ...res.data.map<User>((follower) => {
                            return {
                                id: follower.id,
                                login: follower.login,
                            };
                        }),
                        ...data,
                    ];

                    currentPage++;
                }
            } catch (e: any) {
                break;
            }
        }

        return data;
    }

    async compareFollowingAndFollowers() {
        try {
            if (!this.followers || !this.following) {
                throw new Error(
                    "Cannot find followers or following. Please retry."
                );
            }

            const following = this.following.map((following) => following.id);
            const followers = this.followers.map((follower) => follower.id);

            // 내가 팔로우 하고 있는 사람들 중에서 나를 팔로우 하지 않는 사람들
            const NOT_FOLLOWING_BACK = this.following.filter(
                (following) => !followers.includes(following.id)
            );

            // 나를 팔로우 하고 있는 사람들 중에서 내가 팔로우 하지 않는 사람들
            const NOT_FOLLOWING = this.followers.filter(
                (follower) => !following.includes(follower.id)
            );

            return {
                notFollowingBack: NOT_FOLLOWING_BACK,
                notFollowing: NOT_FOLLOWING,
            };
        } catch (e: any) {}
    }
}
