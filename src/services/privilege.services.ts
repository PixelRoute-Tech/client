import network from "@/config/network.config";

export const getMyPrivileges = async () => {
    const response = await network.get("/privileges/me");
    return response.data;
};

export const getUserPrivileges = async (userId: number | string) => {
    const response = await network.get(`/privileges/user/${userId}`);
    return response.data;
};

export const updateBulkPrivileges = async ({ userId, privileges }: { userId: number | string, privileges: any[] }) => {
    const response = await network.post(`/privileges/user/${userId}`, privileges);
    return response.data;
};
