async function handleResponse({ res, code, message, data, error }) {
    return res.status(200).json({ code: code || 500, error: error, message: message || "Internal server error.", data: data || [] })
}

export  {handleResponse}