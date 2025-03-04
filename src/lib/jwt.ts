export function parseJwt(slackIdToken: string) {
    const base64Url = slackIdToken.split('.')[1]
    if (!base64Url) {
        console.error("No Base64 URL in the JWT")
        throw new Error("Bad JWT")
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
            .toString('utf-8')
            .split('')
            .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join(''),
    )

    return JSON.parse(jsonPayload)
}