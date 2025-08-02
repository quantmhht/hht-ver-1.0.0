// src/store/organizationSlice.ts
import { Organization } from "@dts";
import {
    getOrganization,
    GetOrganizationParams,
} from "@service/services";
import { followOfficialAccount } from "@service/zalo";
import { StateCreator } from "zustand";

export interface OrganizationSlice {
    organization?: Organization;
    gettingOrganization?: boolean;
    followOA: (params: { id: string }) => Promise<void>;
    getOrganization: (params: GetOrganizationParams) => Promise<void>;
}

const organizationSlice: StateCreator<OrganizationSlice> = (set, get) => ({
    organization: undefined,
    gettingOrganization: false,

    followOA: async (params: { id: string }) => {
        try {
            await followOfficialAccount(params);
            const org = get().organization;

            if (org) {
                org.officialAccounts = org.officialAccounts?.map(item => {
                    if (item.oaId !== params.id) {
                        return item;
                    }
                    return {
                        ...item,
                        follow: true,
                    };
                });
                set(state => ({
                    ...state,
                    organization: org ?? undefined,
                }));
            }
        } catch (err) {
            console.log("err: ", err);
        }
    },

    getOrganization: async (params: GetOrganizationParams) => {
        try {
            set(state => ({
                ...state,
                gettingOrganization: true,
            }));
            const org = await getOrganization(params);

            set(state => ({
                ...state,
                organization: org ?? undefined,
            }));
        } catch (error) {
            console.error("Error getting organization:", error);
        } finally {
            set(state => ({
                ...state,
                gettingOrganization: false,
            }));
        }
    },
});

export default organizationSlice;