
import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

interface ObjectSort {
    [key: string]: string | number | object;
}

const prisma = new PrismaClient()

export const getAllUser = () =>{
    try {
        const query = prisma.userRunx.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const getIdUser = async (id :number) =>{
    try {
        const query = await prisma.userRunx.findUnique({
            where: {id: Number(id)}
        })
        return query
        
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const checkUser = async (user: any) =>{
    try {
        const email: string = user.userData.email
        
        const query = await prisma.userRunx.findUnique({
            where: {
                email: email
            }
        })
        const passUser: any = query?.password
        if (!passUser) {
            throw new Error('User not found')            
        }
        const isMatch = await Bun.password.verify(user.userData.password, passUser);
        if (!isMatch) {
            return {message :'login fail'}           
        }
        return {
            loggedIn: true,
            query
        }
    } catch (error) {
        console.log('error',error)
        return {
            loggedIn: false
        }
    } 
}

export const duplecateUser = async (email: any) =>{
    try {
        const query = await prisma.userRunx.findUnique({
            where: {
                email: email
            }
        })
        return query
        
    } catch (error) {
        return "error"
    } 
}

export const createUser = async (user: any) =>{
    try {
        const users = await prisma.userRunx.create({
            data: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                policy_agreement: user.policy_agreement
            }
        })
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const updateUser = async (userBody: any, userId: number) =>{
    try {   
        const updateUser = await prisma.userRunx.update({
            where: {
                id: userId
            },
            data: {
                firstname: userBody.firstName,
                lastname: userBody.lastName,
                birth_date: new Date(userBody.dateofBirth), 
                gender: userBody.gender,
                nationalid_or_passport: userBody.idNumber,
                nationality: userBody.nationality,
                country: userBody.selectedNationality,
                telephone: userBody.telephone,
                //email: userBody.email
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}


export const createOrg = async (org: any) =>{
    try {
        const users = await prisma.organization.create({
            data: {
                Organization_name: org.Organization_name
            }
        })
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}


export const editOrg = async (body: any, id: number) =>{
    try {
        const updateUser = await prisma.organization.update({
            where: {
                id: id
            },
            data: {
                Organization_name: body.Organization_name
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const getAllOrg = () =>{
    try {
        const query = prisma.organization.findMany({
            include: {
                event: true,
            },
        })
        return query
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const createEvent = async (events: any) =>{
    try {
        const title: string = events.title
        const query = await prisma.events.findUnique({
            where: {
                title: title
            }
        })
        if (query) {
            return false
        }
        const users = await prisma.events.create({
            data: {
                title: events.title,
                location: events.location,
                Organization_id: events.Organization_id
            }
        })
        return true
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const getAllEvent = () =>{
    try {
        const query = prisma.events.findMany({
            include: {
                races: true,
            },
        })
        return query
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}



export const eventFilter = async  (filter:{ location?: string }) =>{
    try {
        const filterQuery: ObjectSort = {};
        if (filter.location) {
            filterQuery["location"] = {
                equals: filter.location
            }
        }
        const eventsData = await prisma.events.findMany({
            where: {
                ...filterQuery
            }
        });
        return eventsData
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}














