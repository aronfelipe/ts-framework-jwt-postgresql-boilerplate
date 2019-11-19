export default interface ResponseInterface {
    token: {token: string, expiresIn: number},
    data: any
}