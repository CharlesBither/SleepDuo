/** Error state of the app */
let errorMsg: string = ""

/** Updates the error state with a new message */
export const setErrorMsg = (msg: string): void => {
    errorMsg = msg;
}

/** gets the error message from the app's error state */
export const getErrorMsg = (): string => {
    return errorMsg;
}