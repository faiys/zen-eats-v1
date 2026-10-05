import { useState, useEffect, useMemo, useRef } from 'react';
import { getUser, getRecordsPublish, POSTRecordPublish, updateRecordByID, loadImageURL } from './Zohoapi';
import { AllStaffsReport, AllMenuItemsReport, AllMasterMenuCategoriesReport, MyOrdersReport, YourPicksReport, YourPicksForm, AllOrderChecklistsReport, OrderChecklistForm } from './Modelconfig';
import { FoodItem } from '../data/foodItems';
import defaultFoodImg from '../assets/images/hero_friday_spread_1790948481132.jpg';

// App owner checks orders in Your_Picks_Report, other users in My_Orders (same as old widget)
const OWNER_EMAIL = "nmg214@nmg.cpa";

export interface TodayOrder {
    orderId: string;
    itemId: string;
}

export interface SubmitOrderResult {
    success: boolean;
    orderId?: string;
    message?: string;
}

// Today's date as dd-MMM-yyyy (e.g. 05-Oct-2026), used for Date_Str / Date_field
export function getCurrentDateDDMMMYYYY(): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}-${months[today.getMonth()]}-${today.getFullYear()}`;
}

// Order summary for Export PDF: category -> item -> ordered users
export interface OrderSummaryItem {
    itemId: string;
    name: string;
    count: number;
    users: string[];
    userIds: string[];
}

export interface OrderSummaryCategory {
    name: string;
    count: number;
    items: OrderSummaryItem[];
}

export interface OrderSummary {
    date: string;
    totalOrders: number;
    categories: OrderSummaryCategory[];
}

// One past order of the login user (Order History)
export interface OrderHistoryEntry {
    orderId: string;
    date: string;
    dateValue: number;
    itemId: string;
    itemName: string;
    category: string;
    image?: string;
}

// "05-Oct-2026" -> timestamp (0 if invalid), used to sort history by date
function parseDDMMMYYYY(value: string): number {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const parts = (value || "").split("-");
    if (parts.length !== 3) return 0;
    const month = months.indexOf(parts[1].slice(0, 3).toLowerCase());
    const time = new Date(Number(parts[2]), month, Number(parts[0])).getTime();
    return month === -1 || isNaN(time) ? 0 : time;
}

// Field link names in Order_Checklist form / All_Order_Checklists report
const CHECKLIST_FIELDS = {
    item: "Menu_Item",      // lookup to menu item
    staff: "Staff",         // single lookup to staff (required), one record per staff
    note: "Notes",          // multi line
    date: "Date_field",     // date (dd-MMM-yyyy)
    checkedBy: "Checked_By" // email of login user who checked
};

// Saved checklist record for one item + staff today
export interface ChecklistEntry {
    recordId: string;
    note: string;
}

// Checklist key for one row (item + staff)
export function getChecklistKey(itemId: string, staffId: string): string {
    return `${itemId}_${staffId}`;
}

export interface LoginUser {
    name: string;
    email: string;
    staffId: string;
    shiftId: string;
    canExportPDF: boolean;
    canViewChecklist: boolean;
}

// Zoho decision box (checkbox) value: true / "true"
function isChecked(value: any): boolean {
    return value === true || String(value).toLowerCase() === "true";
}

// Staff name can be a Zoho "Name" field (object) or a single line text (string)
function getStaffName(staff: Record<string, any>, email: string): string {
    const nameField = staff["Name"] ?? staff["Staff_Name"];
    if (typeof nameField === "string" && nameField.trim()) {
        return nameField.trim();
    }
    if (nameField && typeof nameField === "object") {
        const fullName = nameField.zc_display_value || nameField.display_value
            || [nameField.first_name, nameField.last_name].filter(Boolean).join(" ");
        if (fullName && fullName.trim()) {
            return fullName.trim();
        }
    }
    // Fallback: part of the email before @
    return email.split("@")[0];
}

export interface MenuCategory {
    id: string;
    name: string;
    isVeg?: boolean;
}

// Lookup display value: v2 API returns zc_display_value, v1 returned display_value
function getLookupDisplay(lookup: any): string {
    if (!lookup) return "";
    if (typeof lookup === "string") return lookup;
    return lookup.zc_display_value || lookup.display_value || "";
}

// Category name field in All_Master_Menu_Categories
function getCategoryName(record: Record<string, any>): string {
    const nameField = record["Category"] ?? record["Category_Name"] ?? record["Name"];
    return typeof nameField === "string" ? nameField : getLookupDisplay(nameField);
}

// Veg / Non Veg field in All_Master_Menu_Categories (e.g. dropdown "Veg" / "Non Veg")
const FOOD_TYPE_FIELD = "Food_Type";

// Read "Veg" / "Non Veg" text: true = Veg, false = Non Veg, undefined = not found
function parseVegText(text: string): boolean | undefined {
    if (/\bnon[\s-]*veg/i.test(text)) return false;
    if (/\bveg(etarian)?\b/i.test(text)) return true;
    return undefined;
}

// Veg type of a category: from its Food_Type field, else from the category name (e.g. "Veg Snacks")
function getCategoryIsVeg(record: Record<string, any>, categoryName: string): boolean | undefined {
    const value = record[FOOD_TYPE_FIELD];
    if (typeof value === "boolean") return value;
    const fieldText = typeof value === "string" ? value : getLookupDisplay(value);
    return parseVegText(fieldText) ?? parseVegText(categoryName);
}

// Item_Image can be a single value or a list; each value a URL string or { url } object.
// Zoho file URLs (/api/...) are kept as-is and loaded by ZohoImage via the SDK.
function getItemImages(imageField: any): string[] {
    const imageList = Array.isArray(imageField) ? imageField : (imageField ? [imageField] : []);
    const images = imageList
        .map((img: any) => (typeof img === "string" ? img : img?.url || img?.display_value || ""))
        .filter((url: string) => url);
    return images.length > 0 ? images : [defaultFoodImg];
}

// Convert All_Menu_Items record to FoodItem used by the UI
function toFoodItem(record: Record<string, any>, categoryById: Record<string, MenuCategory>): FoodItem {
    const description = record["Description"] || "";
    const categoryId = record["Menu_Category"]?.["ID"] || "";
    const category = categoryById[categoryId];
    const categoryName = category?.name || getLookupDisplay(record["Menu_Category"]) || "Others";
    return {
        id: record["ID"],
        name: record["Item_Name"] || "",
        category: categoryName,
        categoryId: categoryId,
        isVeg: category ? category.isVeg : parseVegText(categoryName),
        rating: 0,
        reviewCount: 0,
        prepTime: "",
        tag: categoryName,
        tagType: "popular",
        description: description,
        fullDescription: description,
        price: 0,
        originalPrice: 0,
        discount: "",
        images: getItemImages(record["Item_Image"]),
        calories: "",
        portion: "",
        addOns: [],
        popularTags: []
    };
}

export function useManage() {
    const [loginUser, setLoginUser] = useState<LoginUser>({
        name: "",
        email: "",
        staffId: "",
        shiftId: "",
        canExportPDF: false,
        canViewChecklist: false
    });
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);
    const [todayOrder, setTodayOrder] = useState<TodayOrder | null>(null);
    const [isOrderLoading, setIsOrderLoading] = useState(true);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const isSubmittingRef = useRef(false);
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const orderSummaryRef = useRef<OrderSummary | null>(null);
    const [checklist, setChecklist] = useState<Record<string, ChecklistEntry>>({});
    const [isChecklistLoading, setIsChecklistLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[] | null>(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // Get login user email, then fetch staff record from All_Staffs
    async function loadLoginUser() {
        try {
            const email = await getUser();
            const staffData = await getRecordsPublish({
                ...AllStaffsReport,
                criteria: `(Email == "${email}")`
            });
            if (staffData.length > 0) {
                const staff = staffData[0];
                setLoginUser({
                    name: getStaffName(staff, email),
                    email: email,
                    staffId: staff["ID"],
                    shiftId: staff["Shift_Allocation"]?.["ID"] || "",
                    // Export PDF access from All_Staffs (replaces hardcoded user list)
                    canExportPDF: isChecked(staff["Enable_Order_PDF_In_Portal"]),
                    // Order Checklist access from All_Staffs
                    canViewChecklist: isChecked(staff["Order_Checklist_In_portal_View"])
                });
            }
            else {
                setLoginUser({ name: email.split("@")[0], email: email, staffId: "", shiftId: "", canExportPDF: false, canViewChecklist: false });
            }
        }
        catch (error) {
            console.error("Error loading login user:", error);
        }
        finally {
            setIsUserLoading(false);
        }
    }

    // Get login user's order for today (Staff + Date_Str)
    async function fetchTodayOrder(staffId: string, email: string): Promise<TodayOrder | null> {
        const orderReport = email === OWNER_EMAIL ? YourPicksReport : MyOrdersReport;
        const orderData = await getRecordsPublish({
            ...orderReport,
            criteria: `(Staff.ID == ${staffId} && Date_Str == "${getCurrentDateDDMMMYYYY()}")`
        });
        if (orderData.length > 0) {
            return {
                orderId: orderData[0]["ID"],
                itemId: orderData[0]["Menu_Item"]?.["ID"] || ""
            };
        }
        return null;
    }

    async function loadTodayOrder(staffId: string, email: string) {
        setIsOrderLoading(true);
        try {
            setTodayOrder(await fetchTodayOrder(staffId, email));
        }
        catch (error) {
            console.error("Error loading today's order:", error);
            setTodayOrder(null);
        }
        finally {
            setIsOrderLoading(false);
        }
    }

    // Confirm order: POST to Your_Picks if no order today.
    // If today's order has a different item (order changed), update the same record by ID.
    async function submitOrder(item: FoodItem): Promise<SubmitOrderResult> {
        if (!loginUser.staffId) {
            return { success: false, message: "Staff record not found for your login." };
        }
        if (isSubmittingRef.current) {
            return { success: false, message: "Your order is already being placed." };
        }
        isSubmittingRef.current = true;
        setIsSubmittingOrder(true);
        try {
            // Check again before saving, so one user never gets two orders for the same day
            const existingOrder = await fetchTodayOrder(loginUser.staffId, loginUser.email);
            if (existingOrder) {
                // Same item already ordered, nothing to change
                if (existingOrder.itemId === item.id) {
                    setTodayOrder(existingOrder);
                    return { success: true, orderId: existingOrder.orderId };
                }
                const updateResp = await updateRecordByID({
                    ...YourPicksReport,
                    ID: existingOrder.orderId,
                    dataParam: {
                        "Menu_Category": item.categoryId,
                        "Menu_Item": item.id
                    }
                });
                if (updateResp.code != 3000) {
                    return { success: false, message: "Could not change your order. Please try again." };
                }
                setTodayOrder({ orderId: existingOrder.orderId, itemId: item.id });
                return { success: true, orderId: existingOrder.orderId };
            }

            const postResp = await POSTRecordPublish({
                ...YourPicksForm,
                dataParam: {
                    "Staff": loginUser.staffId,
                    "Menu_Category": item.categoryId,
                    "Menu_Item": item.id,
                    "Date_Str": getCurrentDateDDMMMYYYY(),
                    "Date_field": getCurrentDateDDMMMYYYY()
                }
            });
            if (postResp.code == 3000) {
                const orderId = postResp.data?.data?.ID || "";
                setTodayOrder({ orderId: orderId, itemId: item.id });
                return { success: true, orderId: orderId };
            }
            return { success: false, message: "Could not place your order. Please try again." };
        }
        catch (error) {
            console.error("Error submitting order:", error);
            return { success: false, message: "Could not place your order. Please try again." };
        }
        finally {
            isSubmittingRef.current = false;
            setIsSubmittingOrder(false);
        }
    }

    // Start loading all item images once, so category switching shows them instantly
    function preloadImages(items: FoodItem[]) {
        items.forEach((item) => {
            item.images
                .filter((url) => url.startsWith("/api/"))
                .forEach((url) => loadImageURL(url).catch(() => { /* card will retry */ }));
        });
    }

    // Get active menu items for the login user's shift
    async function loadMenuItems(shiftId: string) {
        setIsMenuLoading(true);
        try {
            const [categoryData, menuData] = await Promise.all([
                getRecordsPublish({
                    ...AllMasterMenuCategoriesReport,
                    criteria: `(Shift_Allocation == ${shiftId})`
                }),
                getRecordsPublish({
                    ...AllMenuItemsReport,
                    criteria: `(Status == "Active" && Menu_Category.Shift_Allocation == ${shiftId})`
                })
            ]);
            const categoryList: MenuCategory[] = categoryData
                .map((record: Record<string, any>) => {
                    const name = getCategoryName(record);
                    return { id: record["ID"], name: name, isVeg: getCategoryIsVeg(record, name) };
                })
                .filter((cat: MenuCategory) => cat.name);
            const categoryById: Record<string, MenuCategory> = {};
            categoryList.forEach((cat) => { categoryById[cat.id] = cat; });
            setMenuCategories(categoryList);
            const items = menuData.map((record: Record<string, any>) => toFoodItem(record, categoryById));
            setMenuItems(items);
            preloadImages(items);
        }
        catch (error) {
            console.error("Error loading menu items:", error);
            setMenuItems([]);
            setMenuCategories([]);
        }
        finally {
            setIsMenuLoading(false);
        }
    }

    // Today's orders for the login user's shift, grouped as category -> item -> users.
    // Shows loading only when there is no summary yet; otherwise refreshes quietly in background.
    async function loadOrderSummary() {
        const date = getCurrentDateDDMMMYYYY();
        const hasCurrentSummary = orderSummaryRef.current?.date === date;
        if (!hasCurrentSummary) setIsSummaryLoading(true);
        try {
            const orderData = loginUser.shiftId
                ? await getRecordsPublish({
                    ...YourPicksReport,
                    criteria: `(Date_Str == "${date}" && Staff.Shift_Allocation == ${loginUser.shiftId})`,
                    fields: "Menu_Item,Menu_Category,Staff"
                })
                : [];

            const itemById: Record<string, FoodItem> = {};
            menuItems.forEach((item) => { itemById[item.id] = item; });

            const categoryMap = new Map<string, Map<string, OrderSummaryItem>>();
            orderData.forEach((record: Record<string, any>) => {
                const itemId = record["Menu_Item"]?.["ID"] || "";
                const menuItem = itemById[itemId];
                const itemName = menuItem?.name || getLookupDisplay(record["Menu_Item"]) || "Unknown item";
                const categoryName = menuItem?.category || getLookupDisplay(record["Menu_Category"]) || "Others";
                const userName = getLookupDisplay(record["Staff"]) || "Unknown";
                const userId = record["Staff"]?.["ID"] || "";

                if (!categoryMap.has(categoryName)) categoryMap.set(categoryName, new Map());
                const itemMap = categoryMap.get(categoryName)!;
                const key = itemId || itemName;
                if (!itemMap.has(key)) itemMap.set(key, { itemId, name: itemName, count: 0, users: [], userIds: [] });
                const summaryItem = itemMap.get(key)!;
                summaryItem.count += 1;
                summaryItem.users.push(userName);
                summaryItem.userIds.push(userId);
            });

            // Keep category order same as category tabs; items by most ordered
            const categoryOrder = categories.filter((cat) => cat !== "All");
            const summaryCategories: OrderSummaryCategory[] = [...categoryMap.entries()]
                .map(([name, itemMap]) => {
                    const items = [...itemMap.values()]
                        .map((item) => {
                            // Sort users by name, keeping each name with its staff ID
                            const pairs = item.users
                                .map((user, i) => ({ user, id: item.userIds[i] }))
                                .sort((a, b) => a.user.localeCompare(b.user));
                            return { ...item, users: pairs.map((p) => p.user), userIds: pairs.map((p) => p.id) };
                        })
                        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
                    return { name, count: items.reduce((sum, item) => sum + item.count, 0), items };
                })
                .sort((a, b) => {
                    const ia = categoryOrder.indexOf(a.name);
                    const ib = categoryOrder.indexOf(b.name);
                    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
                });

            const summary = { date, totalOrders: orderData.length, categories: summaryCategories };
            orderSummaryRef.current = summary;
            setOrderSummary(summary);
            return summary;
        }
        catch (error) {
            console.error("Error loading order summary:", error);
            if (!hasCurrentSummary) setOrderSummary({ date, totalOrders: 0, categories: [] });
            return null;
        }
        finally {
            setIsSummaryLoading(false);
        }
    }

    // Order Checklist: today's grouped orders (from order summary) + saved checklist entries
    async function loadChecklist() {
        const date = getCurrentDateDDMMMYYYY();
        const isFirstLoad = Object.keys(checklist).length === 0;
        if (isFirstLoad) setIsChecklistLoading(true);
        try {
            const [, checklistData] = await Promise.all([
                loadOrderSummary(),
                getRecordsPublish({
                    ...AllOrderChecklistsReport,
                    criteria: `(${CHECKLIST_FIELDS.date} == "${date}")`
                })
            ]);
            // One entry per item + staff record
            const entries: Record<string, ChecklistEntry> = {};
            checklistData.forEach((record: Record<string, any>) => {
                const itemId = record[CHECKLIST_FIELDS.item]?.["ID"] || "";
                const staffId = record[CHECKLIST_FIELDS.staff]?.["ID"] || "";
                if (!itemId || !staffId) return;
                entries[getChecklistKey(itemId, staffId)] = {
                    recordId: record["ID"],
                    note: record[CHECKLIST_FIELDS.note] || ""
                };
            });
            setChecklist(entries);
        }
        catch (error) {
            console.error("Error loading order checklist:", error);
        }
        finally {
            setIsChecklistLoading(false);
        }
    }

    // Row checkbox ticked: post one Order_Checklist record for this item + staff with the row's note
    async function submitChecklistRow(itemId: string, staffId: string, note: string): Promise<boolean> {
        if (!itemId || !staffId) return false;
        const key = getChecklistKey(itemId, staffId);
        if (checklist[key]) return true;
        try {
            const postResp = await POSTRecordPublish({
                ...OrderChecklistForm,
                dataParam: {
                    [CHECKLIST_FIELDS.item]: itemId,
                    [CHECKLIST_FIELDS.staff]: staffId,
                    [CHECKLIST_FIELDS.note]: note,
                    [CHECKLIST_FIELDS.date]: getCurrentDateDDMMMYYYY(),
                    [CHECKLIST_FIELDS.checkedBy]: loginUser.email
                }
            });
            if (postResp.code == 3000) {
                const recordId = postResp.data?.data?.ID || "";
                setChecklist((prev) => ({ ...prev, [key]: { recordId, note } }));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error saving checklist row:", error);
            return false;
        }
    }

    // Note edited on a checked row: update Notes of that Order_Checklist record
    async function updateChecklistNote(key: string, note: string): Promise<boolean> {
        const entry = checklist[key];
        if (!entry || !entry.recordId) return false;
        if (entry.note === note) return true;
        try {
            const updateResp = await updateRecordByID({
                ...AllOrderChecklistsReport,
                ID: entry.recordId,
                dataParam: { [CHECKLIST_FIELDS.note]: note }
            });
            if (updateResp.code == 3000) {
                setChecklist((prev) => ({ ...prev, [key]: { ...prev[key], note } }));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error updating checklist note:", error);
            return false;
        }
    }

    // All orders of the login user, newest date first.
    // Shows loading only the first time; later opens refresh quietly in background.
    async function loadOrderHistory() {
        if (!loginUser.staffId) {
            setOrderHistory([]);
            return;
        }
        if (orderHistory === null) setIsHistoryLoading(true);
        try {
            const orderReport = loginUser.email === OWNER_EMAIL ? YourPicksReport : MyOrdersReport;
            const orderData = await getRecordsPublish({
                ...orderReport,
                criteria: `(Staff.ID == ${loginUser.staffId})`,
                fields: "Menu_Item,Menu_Category,Date_Str"
            });

            const itemById: Record<string, FoodItem> = {};
            menuItems.forEach((item) => { itemById[item.id] = item; });

            const history: OrderHistoryEntry[] = orderData
                .map((record: Record<string, any>) => {
                    const itemId = record["Menu_Item"]?.["ID"] || "";
                    const menuItem = itemById[itemId];
                    const date = record["Date_Str"] || "";
                    return {
                        orderId: record["ID"],
                        date: date,
                        dateValue: parseDDMMMYYYY(date),
                        itemId: itemId,
                        itemName: menuItem?.name || getLookupDisplay(record["Menu_Item"]) || "Unknown item",
                        category: menuItem?.category || getLookupDisplay(record["Menu_Category"]) || "Others",
                        image: menuItem?.images[0]
                    };
                })
                .sort((a: OrderHistoryEntry, b: OrderHistoryEntry) => b.dateValue - a.dateValue);
            setOrderHistory(history);
        }
        catch (error) {
            console.error("Error loading order history:", error);
            if (orderHistory === null) setOrderHistory([]);
        }
        finally {
            setIsHistoryLoading(false);
        }
    }

    // Export PDF button only when Enable_Order_PDF_In_Portal is true for the login staff
    const canExportPDF = loginUser.canExportPDF;

    // Category tabs from All_Master_Menu_Categories, plus any item category not in master, with "All" first
    const categories = useMemo(() => {
        const categorySet = new Set<string>();
        menuCategories.forEach((cat) => categorySet.add(cat.name));
        menuItems.forEach((item) => categorySet.add(item.category));
        return ["All", ...categorySet];
    }, [menuCategories, menuItems]);

    useEffect(() => {
        loadLoginUser();
    }, []);

    // Preload order summary for Export PDF / Order Checklist users, so they open instantly
    useEffect(() => {
        if ((canExportPDF || loginUser.canViewChecklist) && loginUser.shiftId && !isMenuLoading) {
            loadOrderSummary();
        }
    }, [canExportPDF, loginUser.canViewChecklist, loginUser.shiftId, isMenuLoading]);

    useEffect(() => {
        if (isUserLoading) return;
        if (loginUser.staffId) {
            loadTodayOrder(loginUser.staffId, loginUser.email);
        }
        else {
            setTodayOrder(null);
            setIsOrderLoading(false);
        }
    }, [isUserLoading, loginUser.staffId, loginUser.email]);

    useEffect(() => {
        if (isUserLoading) return;
        if (loginUser.shiftId) {
            loadMenuItems(loginUser.shiftId);
        }
        else {
            setMenuItems([]);
            setIsMenuLoading(false);
        }
    }, [isUserLoading, loginUser.shiftId]);

    return {
        loginUser,
        isUserLoading,
        menuItems,
        menuCategories,
        categories,
        isMenuLoading,
        canExportPDF,
        canViewChecklist: loginUser.canViewChecklist,
        checklist,
        isChecklistLoading,
        loadChecklist,
        submitChecklistRow,
        updateChecklistNote,
        orderHistory,
        isHistoryLoading,
        loadOrderHistory,
        orderSummary,
        isSummaryLoading,
        loadOrderSummary,
        todayOrder,
        isOrderLoading,
        isSubmittingOrder,
        submitOrder
    };
}
