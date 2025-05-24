export const generateUniqueNumericToken = (length = 10) => {
    const timestamp = Math.floor(Date.now() / 1000) // Current time in seconds
    const randomPart = Math.floor(Math.random() * 10 ** (length - 6)) // Random number with remaining digits
    const token = `${timestamp % 10 ** 6}${randomPart
        .toString()
        .padStart(length - 6, "0")}` // Ensure length

    return token
}