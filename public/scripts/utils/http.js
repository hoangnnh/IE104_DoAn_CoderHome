export const httpGet = async (url, options = {}) => {
    const res = await fetch(url, { method: "GET", ...options });
    if (!res.ok) throw new Error(`HTTP GET ${url} failed: ${res.status}`);
    return res.json();
};


export const httpPost = async (url, body, options = {}) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        ...options,
    });
    if (!res.ok) throw new Error(`HTTP POST ${url} failed: ${res.status}`);
    return res.json();
};


export const httpDelete = async (url, options = {}) => {
    const res = await fetch(url, { method: "DELETE", ...options });
    if (!res.ok) throw new Error(`HTTP DELETE ${url} failed: ${res.status}`);
    return res.json();
};