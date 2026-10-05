
const appname = "zeneats";

export async function getUser(): Promise<string> {
    try {
        const response = await ZOHO.CREATOR.UTIL.getInitParams();
        return response.loginUser;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

export async function getRecordsPublish(configModule: { report_name: string; publish_link?: string; criteria?: string; fields?: string; max_records?: number; }) {
    try {

        var config: Record<string, any> = {
            app_name: appname,
            report_name: configModule.report_name,
            criteria: configModule.criteria || ""
        };
        // Fetch only the given fields (comma separated link names) for a faster response
        if (configModule.fields) {
            config.field_config = "custom";
            config.fields = configModule.fields;
        }
        if (configModule.max_records) {
            config.max_records = configModule.max_records;
        }
        const response = await ZOHO.CREATOR.DATA.getRecords(config);
        return response.data || [];
    } catch (error) {
        console.error("Error getting:", error);
        return [];
    }
}

export async function POSTRecordPublish(configModule: { form_name: string; publish_link?: string; dataParam?: Record<string, any>; }) {
    try {
        const jsonData = {
            data: configModule.dataParam
        };
        var config = {
            app_name: appname,
            form_name: configModule.form_name,
            payload: jsonData
        };
        const response = await ZOHO.CREATOR.DATA.addRecords(config);
        if (response.code == 3000) {
            return { "code": response.code, "data": response };
        }
        else {
            console.log("POST rec error = ", response)
            return { "code": response.code, "data": "null" };
        }
    }
    catch (error) {
        console.error("Error :", error);
        throw error;
    }
}

export async function updateRecordByID(configModule: { report_name: string; dataParam?: Record<string, any>; ID: string; }) {
    try {
        const jsonData = {
            data: configModule.dataParam
        };
        var config = {
            app_name: appname,
            report_name: configModule.report_name,
            id: configModule.ID,
            payload: jsonData
        };
        const response = await ZOHO.CREATOR.DATA.updateRecordById(config);
        if (response.code == 3000) {
            return { "code": response.code, "data": response };
        }
        else {
            console.log("Update rec error = ", response)
            return { "code": response.code, "data": "null" };
        }
    }
    catch (error) {
        console.error("Error :", error);
        throw error;
    }
}
// Zoho file URL -> loaded image src, so each image downloads only once
const imageCache = new Map<string, string>();
const imageRequests = new Map<string, Promise<string>>();

export function getCachedImageURL(imageURL: string): string | undefined {
    return imageCache.get(imageURL);
}

// Load a Zoho file/image URL (e.g. /api/v2.1/.../download?filepath=...) through the SDK
export function loadImageURL(imageURL: string): Promise<string> {
    const cached = imageCache.get(imageURL);
    if (cached) return Promise.resolve(cached);

    const pending = imageRequests.get(imageURL);
    if (pending) return pending;

    const request = new Promise<string>((resolve, reject) => {
        const imgTag = new Image();
        imgTag.onload = () => {
            imageCache.set(imageURL, imgTag.src);
            imageRequests.delete(imageURL);
            resolve(imgTag.src);
        };
        imgTag.onerror = () => {
            imageRequests.delete(imageURL);
            reject(new Error("Image load failed: " + imageURL));
        };
        try {
            // SDK always calls the 3rd argument, so a callback must be passed (else "d is not a function")
            ZOHO.CREATOR.UTIL.setImageData(imgTag, imageURL, () => { /* image src is set; onload resolves */ });
        } catch (error) {
            imageRequests.delete(imageURL);
            reject(error);
        }
    });
    imageRequests.set(imageURL, request);
    return request;
}
