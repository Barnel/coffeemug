import { ZodError, ZodIssue } from "zod";

export const zodErrorMessage = (e: ZodError) => {
    return e.issues.reduce((acc: string, curr: ZodIssue) => {
        acc += `[ Property: ${curr.path[0]}, error: ${curr.message} ]`;
        return acc;
    }, 'Validation failed.');

}