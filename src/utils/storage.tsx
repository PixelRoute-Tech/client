export const storageKeys = {
    user:"USER"
}

export const setItem = (key:keyof typeof storageKeys | string,data:any):boolean=>{
     try {
        localStorage.setItem(key,JSON.stringify(data))
        return true
     } catch (error) {
        console.error(error)
        return false
     }
}

export const getItem = (key:keyof typeof storageKeys | string):any|false=>{
    try {
       const data = JSON.parse(localStorage.getItem(key) || null )
       return data
    } catch (error) {
        return false
    }
}

export const clearStorage = ()=>{
     try {
        [storageKeys.user].map(key=>{
         localStorage.removeItem(key)
        })
        return true
     } catch (error) {
        return false
     }
}