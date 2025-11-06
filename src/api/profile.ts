

export async function getProfileApi() {
    // need to implement original api call 
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ name: 'Default user', email: 'user@example.com', role: "USER" })
        }, 2000)
    })
}